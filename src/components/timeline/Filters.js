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
import SettingsPanel from "./SettingsPanel";

// Define search modes
const SEARCH_MODES = {
  HYBRID: 'hybrid',
  VECTOR: 'vector',
  TEXT: 'text'
};

export default function Filters({
  filters,
  starred,
  setStarred,
  setFilters,
  setSelectedEntryFromSearch,
  windowWidth,
}) {
  // Make dropdown closed by default on all screen sizes
  const [isFilterGroupExpanded, setIsFilterGroupExpanded] = useState(false);
  
  // Settings panel state
  const [isSettingsPanelShown, setIsSettingsPanelShown] = useState(false);
  
  // Search mode state (default to hybrid)
  const [searchMode, setSearchMode] = useState(SEARCH_MODES.HYBRID);

  // Use a consistent label
  const renderLabel = () => "Filter and search";

  const [searchText, setSearchText] = useState("");

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

  return (
    <div className="timeline-filter-wrapper">
      <div className="timeline-filter">
        <div className="filter-and-button">
          <button
            className="expand-filters-button"
            aria-controls="filters-expandable"
            aria-expanded={isFilterGroupExpanded}
            onClick={() => setIsFilterGroupExpanded(!isFilterGroupExpanded)}
          >
            <h2>{renderLabel()}</h2>
            <i className={`fas fa-caret-${isFilterGroupExpanded ? "up" : "down"}`}></i>
          </button>
        </div>

        <div
          id="filters-expandable"
          className={`filters-expandable ${isFilterGroupExpanded ? "expanded" : ""}`}
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
          
          {/* Search inside dropdown */}
          <div className="search-container-dropdown">
            <Search
              filters={filters}
              setFilters={setFilters}
              searchText={searchText}
              setSearchText={setSearchText}
              setSelectedEntryFromSearch={setSelectedEntryFromSearch}
              searchMode={searchMode}
            />
          </div>
        </div>
      </div>
      
      {isSettingsPanelShown && (
        <SettingsPanel
          setIsSettingsPanelShown={setIsSettingsPanelShown}
          searchMode={searchMode}
          setSearchMode={setSearchMode}
          sortOrder={filters.sort}
          setSortOrder={(sortOrder) => setFilters({...filters, sort: sortOrder})}
        />
      )}
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
