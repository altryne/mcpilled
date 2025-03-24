import PropTypes from "prop-types";

import { useState, useMemo, useCallback, useEffect } from "react";
import useIsBrowserRendering from "../../hooks/useIsBrowserRendering";

import {
  getLocalStorage,
  LOCALSTORAGE_KEYS,
  setLocalStorage,
} from "../../js/localStorage";
import { fallback } from "../../js/utilities";

import ScrollToTop from "./ScrollToTop";
import SettingsPanel from "./SettingsPanel";

export default function FixedAtBottom({
  headerInView,
  scrollToTop,
  searchMode,
  setSearchMode,
  sortOrder,
  setSortOrder,
}) {
  const isBrowserRendering = useIsBrowserRendering();
  const prefersReducedMotion = useMemo(() => {
    if (isBrowserRendering) {
      const result = window.matchMedia("(prefers-reduced-motion: reduce)");
      return result && result.matches;
    }
    return null;
  }, [isBrowserRendering]);

  const [isSettingsPanelShown, setIsSettingsPanelShown] = useState(false);
  const [isAnimationPaused, setIsAnimationPaused] = useState(
    fallback(
      getLocalStorage(LOCALSTORAGE_KEYS.flamesAnimationPaused, null),
      prefersReducedMotion
    )
  );

  useEffect(() => {
    // Need to update this value once the browser rendering check passes, otherwise this remains null
    // regardless of prefers-reduced-motion settings
    if (prefersReducedMotion !== null) {
      if (isAnimationPaused === null) {
        setIsAnimationPaused(prefersReducedMotion);
      }
    }
  }, [prefersReducedMotion, isAnimationPaused]);

  const makeToggleFunction = useCallback(
    (isToggledOn, toggleFn, localStorageKey = null) =>
      () => {
        if (localStorageKey) {
          setLocalStorage(localStorageKey, !isToggledOn);
        }
        toggleFn(!isToggledOn);
      },
    []
  );

  const toggleShowSettingsPanel = useMemo(
    () => makeToggleFunction(isSettingsPanelShown, setIsSettingsPanelShown),
    [makeToggleFunction, isSettingsPanelShown]
  );
  
  const toggleFlamesAnimation = useMemo(
    () =>
      makeToggleFunction(
        isAnimationPaused,
        setIsAnimationPaused,
        LOCALSTORAGE_KEYS.flamesAnimationPaused
      ),
    [makeToggleFunction, isAnimationPaused]
  );

  if (!isBrowserRendering) {
    return null;
  }

  const renderSettingsButton = () => (
    <button
      onClick={toggleShowSettingsPanel}
      title={`${isSettingsPanelShown ? "Hide" : "Show"} settings panel`}
      className="fixed-at-bottom-button"
    >
      <i className="fas fa-gear" aria-hidden={true}>
        <span className="sr-only">
          {`${isSettingsPanelShown ? "Hide" : "Show"} settings panel`}
        </span>
      </i>
    </button>
  );

  return (
    <>
      <div className="fix-at-bottom">
        {!headerInView && <ScrollToTop scrollToTop={scrollToTop} />}
        {renderSettingsButton()}
        {isSettingsPanelShown && (
          <SettingsPanel
            setIsSettingsPanelShown={setIsSettingsPanelShown}
            searchMode={searchMode}
            setSearchMode={setSearchMode}
            sortOrder={sortOrder}
            setSortOrder={setSortOrder}
            isAnimationPaused={isAnimationPaused}
            toggleFlamesAnimation={toggleFlamesAnimation}
          />
        )}
      </div>
    </>
  );
}

FixedAtBottom.propTypes = {
  headerInView: PropTypes.bool.isRequired,
  scrollToTop: PropTypes.func.isRequired,
  searchMode: PropTypes.string,
  setSearchMode: PropTypes.func,
  sortOrder: PropTypes.string,
  setSortOrder: PropTypes.func,
};

FixedAtBottom.defaultProps = {
  searchMode: "hybrid",
  setSearchMode: () => {},
  sortOrder: "Descending",
  setSortOrder: () => {},
};
