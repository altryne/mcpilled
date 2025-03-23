import PropTypes from "prop-types";
import { useAppState } from "../../context/AppContext";
import SettingsCheckbox from "../Checkbox";

export default function SettingsPanel({
  setIsSettingsPanelShown,
  isAnimationPaused,
  toggleFlamesAnimation,
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
              name="system-theme"
              value="use-system-theme"
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
              name="dark-mode"
              value="use-dark-mode"
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
              name="light-mode"
              value="use-light-mode"
              checked={theme === "light"}
              onChange={() => {
                setTheme("light");
              }}
            />
            <label htmlFor="use-light-mode">Force light mode</label>
          </div>
        </div>
      </div>
      <h3>Animations</h3>
      <div className="settings-section">
        <SettingsCheckbox
          id="animate-flames"
          checked={!isAnimationPaused}
          toggleCheckbox={toggleFlamesAnimation}
        >
          Animate flames
        </SettingsCheckbox>
      </div>
    </div>
  );
}

SettingsPanel.propTypes = {
  setIsSettingsPanelShown: PropTypes.func.isRequired,
  isAnimationPaused: PropTypes.bool, // Can be null
  toggleFlamesAnimation: PropTypes.func.isRequired,
};
