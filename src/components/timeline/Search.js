import { useEffect, useState, useMemo } from "react";
import PropTypes from "prop-types";
import clsx from "clsx";

import { useRouter } from "next/router";
import { useCombobox } from "downshift";

import { search as searchEntries } from "../../db/searchEntries";
import { humanizeDate, truncateToNearestWord, sentenceCase } from "../../js/utilities";
import FILTERS from "../../constants/filters";

const MINIMUM_SEARCH_LENGTH = 3;
const BODY_SNIPPET_LENGTH = 200;

const SEARCH_MODES = {
  HYBRID: 'hybrid',
  VECTOR: 'vector',
  TEXT: 'text'
};

function stateReducer(state, actionAndChanges) {
  const { type, changes } = actionAndChanges;
  switch (type) {
    case useCombobox.stateChangeTypes.InputKeyDownEnter:
    case useCombobox.stateChangeTypes.ItemClick:
      // Don't change the input value on selection so people can
      // return to the same query without retyping it. Also close the menu.
      return {
        ...changes,
        inputValue: state.inputValue,
      };
    default:
      return changes;
  }
}

export default function Search({
  filters,
  setFilters,
  searchText,
  setSearchText,
  setSelectedEntryFromSearch,
  searchMode,
}) {
  const router = useRouter();

  const [searchTerm, setSearchTerm] = useState(searchText || "");
  const [items, setItems] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [searchStats, setSearchStats] = useState(null);

  // Function to handle search button click
  const handleSearch = async () => {
    if (searchTerm.length >= MINIMUM_SEARCH_LENGTH) {
      setIsSearching(true);
      try {
        const startTime = performance.now();
        const results = await searchEntries(searchTerm, filters, searchMode);
        const endTime = performance.now();
        
        setItems(results.hits);
        setSearchStats({
          total: results.hits.length,
          textScore: results.textScore || 0,
          vectorScore: results.vectorScore || 0,
          time: Math.round(endTime - startTime),
        });
        
        if (results.hits.length > 0) {
          setShowDropdown(true);
          openMenu();
        } else {
          setShowDropdown(false);
          closeMenu();
        }
      } catch (error) {
        console.error("Search error:", error);
        setShowDropdown(false);
        closeMenu();
      } finally {
        setIsSearching(false);
      }
    }
  };

  // Handle Enter key press in the search input
  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      handleSearch();
      event.preventDefault();
    }
  };

  const {
    isOpen,
    getMenuProps,
    getInputProps,
    highlightedIndex,
    getItemProps,
    openMenu,
    closeMenu,
  } = useCombobox({
    stateReducer,
    items: items,
    itemToString: (item) => (item ? item.title : null),
    onInputValueChange: ({ inputValue }) => {
      setSearchTerm(inputValue);
      setSearchText(inputValue);
      
      // Hide dropdown when input is cleared
      if (!inputValue || inputValue.length === 0) {
        setShowDropdown(false);
        closeMenu();
      }
    },
    onSelectedItemChange: ({ selectedItem }) => {
      if (selectedItem) {
        setSelectedEntryFromSearch(selectedItem.readableId);
        // Write the URL so people can permalink easily
        router.push(
          { query: { ...router.query, id: selectedItem.readableId } },
          null,
          {
            shallow: true,
          }
        );
        closeMenu();
      }
    },
  });

  const renderEntryBodySnippet = (item) => {
    const itemBody = item._highlightResult.body;
    let snippet;
    if (itemBody.matchLevel === "none") {
      // Matched word was in title, just show the first bit of the snippet
      snippet = truncateToNearestWord(itemBody.value, BODY_SNIPPET_LENGTH);
    } else {
      let highlightedLocation = itemBody.value.indexOf("<em>");
      if (highlightedLocation < 50) {
        // The highlighted word is towards the beginning, so no need to trim from the start
        snippet = truncateToNearestWord(itemBody.value, BODY_SNIPPET_LENGTH);
      } else if (itemBody.value.length - highlightedLocation < 150) {
        snippet =
          "&#8230;" +
          truncateToNearestWord(
            itemBody.value.substring(
              itemBody.value.length - BODY_SNIPPET_LENGTH
            ),
            BODY_SNIPPET_LENGTH
          );
      } else {
        // The highlighted word is in the middle somewhere, so center the snippet on it
        snippet =
          "&#8230;" +
          truncateToNearestWord(
            itemBody.value.substring(
              Math.max(0, highlightedLocation - BODY_SNIPPET_LENGTH / 2),
              highlightedLocation + BODY_SNIPPET_LENGTH / 2
            ),
            BODY_SNIPPET_LENGTH
          ) +
          "&#8230;";
      }
    }
    return (
      <div
        className="body-snippet"
        dangerouslySetInnerHTML={{ __html: snippet }}
      />
    );
  };

  return (
    <div className="search">
      <div className="search-input-container">
        <input
          {...getInputProps({
            placeholder: "Search is hybrid, feel free to type questions in natural language",
            onFocus: () => {
              if (items.length > 0 && showDropdown) {
                openMenu();
              }
            },
            onKeyDown: handleKeyDown,
          })}
          className="search-input"
        />
        <button 
          className={clsx("search-button", { "searching": isSearching })} 
          onClick={handleSearch}
          disabled={searchTerm.length < MINIMUM_SEARCH_LENGTH || isSearching}
        >
          {isSearching ? "Searching..." : "Search"}
        </button>
      </div>
      
      <div
        className={clsx("search-results", {
          "search-results--open": isOpen && items.length > 0 && showDropdown,
        })}
        {...getMenuProps()}
      >
        {isOpen && items.length > 0 && showDropdown && (
          <>
            <div className="search-stats">
              {searchStats && (
                <p>
                  Found {searchStats.total} results{" "}
                  {searchMode === "hybrid" && (
                    <span>
                      (Text: {searchStats.textScore.toFixed(2)}, Vector: {searchStats.vectorScore.toFixed(2)})
                    </span>
                  )}{" "}
                  in {searchStats.time}ms
                </p>
              )}
            </div>
            {items.map((item, index) => (
              <div
                className={clsx("search-result", {
                  "search-result--highlighted": highlightedIndex === index,
                })}
                key={`${item.readableId}`}
                {...getItemProps({ item, index })}
              >
                <div className="search-result-title">
                  <span
                    dangerouslySetInnerHTML={{
                      __html: item._highlightResult.title.value,
                    }}
                  />
                </div>
                <div className="search-result-date">
                  {humanizeDate(item.date)}
                </div>
                {renderEntryBodySnippet(item)}
                <div className="search-result-scores">
                  <span className="search-result-score">Score: {item._score.toFixed(2)}</span>
                  {item._textScore > 0 && (
                    <span className="search-result-score">Text: {item._textScore.toFixed(2)}</span>
                  )}
                  {item._vectorScore > 0 && (
                    <span className="search-result-score">Vector: {item._vectorScore.toFixed(2)}</span>
                  )}
                </div>
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
}

Search.propTypes = {
  filters: PropTypes.shape({
    theme: PropTypes.arrayOf(PropTypes.oneOf(Object.keys(FILTERS.theme)))
      .isRequired,
    category: PropTypes.arrayOf(PropTypes.oneOf(Object.keys(FILTERS.category)))
      .isRequired,
    server: PropTypes.arrayOf(PropTypes.oneOf(Object.keys(FILTERS.server)))
      .isRequired,
  }).isRequired,
  setFilters: PropTypes.func.isRequired,
  searchText: PropTypes.string,
  setSearchText: PropTypes.func.isRequired,
  setSelectedEntryFromSearch: PropTypes.func.isRequired,
  searchMode: PropTypes.string.isRequired,
};
