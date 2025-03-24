import PropTypes from "prop-types";
import { useAppState } from "../../context/AppContext";
import SettingsCheckbox from "../Checkbox";

export default function SettingsPanel({
  setIsSettingsPanelShown,
  searchMode,
  setSearchMode,
  sortOrder,
  setSortOrder,
}) {
  const { theme, setTheme, useSansSerif, toggleUseSansSerif } = useAppState();

  return (
    <div className="settings-panel">
      <div className="header-and-close">
        <h2>Settings</h2>
        <button onClick={() => setIsSettingsPanelShown(false)}>
          <i className="fas fa-xmark" aria-hidden={true}></i>
          <span className="sr-only">Close settings panel</span>
        </button>
      </div>
      <h3>Appearance</h3>
      <div className="settings-section">
        <SettingsCheckbox
          id="use-sans-serif-font"
          checked={!!useSansSerif}
          toggleCheckbox={toggleUseSansSerif}
        >
          Use sans-serif font
        </SettingsCheckbox>

        <div className="radio-group">
          <h4>Theme</h4>
          <div className="input-group">
            <input
              type="radio"
              id="use-system-theme"
              name="theme"
              value="system"
              checked={theme === "system"}
              onChange={() => {
                setTheme("system");
              }}
            />
            <label htmlFor="use-system-theme">Use system theme</label>
          </div>
          <div className="input-group">
            <input
              type="radio"
              id="use-dark-mode"
              name="theme"
              value="dark"
              checked={theme === "dark"}
              onChange={() => {
                setTheme("dark");
              }}
            />
            <label htmlFor="use-dark-mode">Force dark mode</label>
          </div>
          <div className="input-group">
            <input
              type="radio"
              id="use-light-mode"
              name="theme"
              value="light"
              checked={theme === "light"}
              onChange={() => {
                setTheme("light");
              }}
            />
            <label htmlFor="use-light-mode">Force light mode</label>
          </div>
        </div>
      </div>
      <h3>Timeline</h3>
      <div className="settings-section">
        <div className="radio-group">
          <h4>Sort Order</h4>
          <div className="input-group">
            <input
              type="radio"
              id="sort-descending"
              name="sort-order"
              value="Descending"
              checked={sortOrder === "Descending"}
              onChange={() => setSortOrder("Descending")}
            />
            <label htmlFor="sort-descending">Newest first (Descending)</label>
          </div>
          <div className="input-group">
            <input
              type="radio"
              id="sort-ascending"
              name="sort-order"
              value="Ascending"
              checked={sortOrder === "Ascending"}
              onChange={() => setSortOrder("Ascending")}
            />
            <label htmlFor="sort-ascending">Oldest first (Ascending)</label>
          </div>
        </div>
      </div>
      <h3>Search Mode</h3>
      <div className="settings-section">
        <div className="radio-group">
          <div className="input-group">
            <input
              type="radio"
              id="search-mode-hybrid"
              name="search-mode"
              value="hybrid"
              checked={searchMode === "hybrid"}
              onChange={() => setSearchMode("hybrid")}
            />
            <label htmlFor="search-mode-hybrid">Hybrid (Text + Vector)</label>
          </div>
          <div className="input-group">
            <input
              type="radio"
              id="search-mode-vector"
              name="search-mode"
              value="vector"
              checked={searchMode === "vector"}
              onChange={() => setSearchMode("vector")}
            />
            <label htmlFor="search-mode-vector">Vector Only</label>
          </div>
          <div className="input-group">
            <input
              type="radio"
              id="search-mode-text"
              name="search-mode"
              value="text"
              checked={searchMode === "text"}
              onChange={() => setSearchMode("text")}
            />
            <label htmlFor="search-mode-text">Text Only</label>
          </div>
        </div>
      </div>
    </div>
  );
}

SettingsPanel.defaultProps = {
  searchMode: "hybrid",
  sortOrder: "Descending",
};

SettingsPanel.propTypes = {
  setIsSettingsPanelShown: PropTypes.func.isRequired,
  searchMode: PropTypes.string.isRequired,
  setSearchMode: PropTypes.func.isRequired,
  sortOrder: PropTypes.oneOf(["Ascending", "Descending"]).isRequired,
  setSortOrder: PropTypes.func.isRequired,
};
