import { useState } from "react";
import PropTypes from "prop-types";
import { WindowWidthPropType } from "../../hooks/useWindowWidth";

import FILTERS, {
  FILTER_CATEGORIES,
  EMPTY_FILTERS,
} from "../../constants/filters";
import { sentenceCase } from "../../js/utilities";

import Select from "react-select";
import Search from "./Search";
import Checkbox from "../Checkbox";

export default function Filters({
  filters,
  starred,
  setStarred,
  setFilters,
  setSelectedEntryFromSearch,
  windowWidth,
}) {
  // Expand by default if there are initial filters defined
  const [isFilterGroupExpanded, setIsFilterGroupExpanded] = useState(
    FILTER_CATEGORIES.some((filter) => filters[filter].length > 0)
  );

  const renderLabel = () => {
    if (windowWidth === "xl") {
      return "Filter:";
    }
    return "Filter and search";
  };

  const renderFilterGroup = (filter) => {
    return (
      <Select
        key={filter}
        instanceId={filter}
        className="filter-select"
        options={Object.entries(FILTERS[filter]).map(([key, value]) => ({
          value: key,
          label: value,
        }))}
        isClearable={true}
        isMulti={true}
        placeholder={sentenceCase(filter)}
        styles={{
          menu: (provided) => ({ ...provided, width: "200px" }),
        }}
        onChange={(values) => {
          setFilters({
            ...filters,
            [filter]: values ? values.map((v) => v.value) : [],
          });
        }}
        value={filters[filter].map((value) => ({
          value,
          label: FILTERS[filter][value],
        }))}
      />
    );
  };

  const renderSortButton = () => (
    <button
      className="sort-button"
      onClick={() =>
        setFilters({
          ...filters,
          sort: filters.sort === "Ascending" ? "Descending" : "Ascending",
        })
      }
    >
      <i
        className={`fas fa-caret-${
          filters.sort === "Ascending" ? "up" : "down"
        }`}
        aria-hidden={true}
      ></i>{" "}
      {filters.sort}
    </button>
  );

  const [searchText, setSearchText] = useState("");

  return (
    <div className="timeline-filter-wrapper">
      <section className="timeline-filter">
        <button
          className="expand-filters-button"
          aria-controls="filters-expandable"
          aria-expanded={windowWidth === "xl" ? null : isFilterGroupExpanded}
          disabled={windowWidth === "xl"}
          onClick={() => setIsFilterGroupExpanded(!isFilterGroupExpanded)}
        >
          <h2>{renderLabel()}</h2>
          <i className="fas fa-caret-down"></i>
        </button>

        <div
          id="filters-expandable"
          className={`filters-expandable ${
            isFilterGroupExpanded ? "expanded" : ""
          }`}
        >
          <div className="filters-group">
            {FILTER_CATEGORIES.map(renderFilterGroup)}
            <Checkbox
              checked={starred}
              toggleCheckbox={(e) => setStarred(e.target.checked)}
              id="starred-filter"
              className="inline-checkbox"
            >
              Show only starred
            </Checkbox>
            <button
              onClick={() => {
                setFilters(EMPTY_FILTERS);
                setStarred(false);
                setSearchText("");
              }}
              disabled={
                !starred &&
                !searchText &&
                FILTER_CATEGORIES.every(
                  (filter) => filters[filter].length === 0
                )
              }
            >
              Clear all
            </button>
          </div>

          <div className="search-group">
            <Search
              filters={filters}
              setFilters={setFilters}
              searchText={searchText}
              setSearchText={setSearchText}
              setSelectedEntryFromSearch={setSelectedEntryFromSearch}
            />
            {renderSortButton()}
          </div>
        </div>
      </section>
    </div>
  );
}

Filters.propTypes = {
  filters: PropTypes.shape({
    theme: PropTypes.arrayOf(PropTypes.oneOf(Object.keys(FILTERS.theme)))
      .isRequired,
    category: PropTypes.arrayOf(PropTypes.oneOf(Object.keys(FILTERS.category)))
      .isRequired,
    server: PropTypes.arrayOf(PropTypes.oneOf(Object.keys(FILTERS.server)))
      .isRequired,
    sort: PropTypes.oneOf(["Descending", "Ascending"]).isRequired,
  }).isRequired,
  starred: PropTypes.bool.isRequired,
  setStarred: PropTypes.func.isRequired,
  setFilters: PropTypes.func.isRequired,
  setSelectedEntryFromSearch: PropTypes.func.isRequired,
  windowWidth: WindowWidthPropType.isRequired,
};
