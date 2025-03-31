import { forwardRef, useImperativeHandle, useRef } from "react";
import { useRouter } from "next/router";
import PropTypes from "prop-types";
import { WindowWidthPropType } from "../../hooks/useWindowWidth";

import { STORAGE_URL } from "../../constants/urls";
import { SOCIAL } from "../../constants/navigation";

import Link from "next/link";
import ExternalLink from "../ExternalLink";
import NavigationBar from "../navigation/NavigationBar";
import MobileNavigation from "../navigation/MobileNavigation";
import NoJsNavigation from "../navigation/NoJsNavigation";

const Header = forwardRef(function Header(
  { windowWidth, isBrowserRendering, clearAllFiltering },
  ref
) {
  const componentRef = useRef();
  useImperativeHandle(ref && ref.focusRef ? ref.focusRef : null, () => ({
    focus: () => componentRef.current.focus(),
  }));
  const router = useRouter();

  const maybeRenderNavigation = () => {
    if (!isBrowserRendering) {
      return <NoJsNavigation />;
    } else if (windowWidth !== "xs" && windowWidth !== "sm") {
      return <NavigationBar />;
    } else {
      // Rendered within the <header> element in this case
      return null;
    }
  };

  const renderSkipToTimeline = () => {
    if (router.pathname === "/") {
      // Avoid rendering this on 404 pages, etc
      return (
        <a href="#timeline" className="show-on-focus">
          Skip to timeline
        </a>
      );
    }
  };

  const renderMainPageLink = (contents, className = null) => {
    if (clearAllFiltering && isBrowserRendering) {
      return (
        <button className={className} onClick={clearAllFiltering}>
          <span className="sr-only">Clear timeline filters</span>
          {contents}
        </button>
      );
    }
    return (
      <Link href="/" className={className}>
        {contents}
      </Link>
    );
  };

  const renderImage = () => {
    return renderMainPageLink(
      // eslint-disable-next-line @next/next/no-img-element
      <img
        className="logo"
        src={`https://cln.sh/0ZcJDPXv+`}
        alt="MCPilled.com logo - Model Context Protocol"
        style={{ maxWidth: "100%", height: "auto", objectFit: "contain" }}
      />,
      "logo-image-link"
    );
  };

  const renderLinks = () => (
    <>
      <p>
        Created by{" "}
        <ExternalLink href="https://twitter.com/altryne">
          Alex Volkov
        </ExternalLink>
        , AI Evangelist with{" "}
        <ExternalLink href="https://wandb.ai/">
          Weights & Biases
        </ExternalLink>
        .
      </p>
      <ul className="social-links">
        {SOCIAL.map((link) => (
          <li key={link.label}>
            <ExternalLink href={link.href}>
              <i className={`fa-fw ${link.icon}`} aria-hidden={true} alt="">
                <span className="sr-only">{link.label}</span>
              </i>
            </ExternalLink>
          </li>
        ))}
      </ul>
    </>
  );

  const renderMobileImageAndLinks = () => (
    <div className="mobile-image-and-links">
      <div>{renderLinks()}</div>
      <div className="mobile-image-wrapper">{renderImage()}</div>
    </div>
  );

  return (
    <>
      {maybeRenderNavigation()}
      <header
        className="timeline-page page-header"
        ref={ref && ref.inViewRef ? ref.inViewRef : null}
      >
        {(windowWidth === "sm" || windowWidth === "xs") && <MobileNavigation />}
        {renderSkipToTimeline()}
        <div className="constrain-width">
          {!(windowWidth === "sm" || windowWidth === "xs") && renderImage()}
          <div className="header-content">
            <h1 ref={componentRef} tabIndex={-1}>
              {renderMainPageLink(<span data-component-name="Header">MCPilled.com</span>)}
            </h1>
            <p className="subtitle">
              Take the MCPill and find out what's happening in the world of the Model Context Protocol (MCP) 
            </p>
            {windowWidth === "sm" || windowWidth === "xs"
              ? renderMobileImageAndLinks()
              : renderLinks()}
          </div>
        </div>
      </header>
    </>
  );
});

Header.propTypes = {
  windowWidth: WindowWidthPropType,
  nojs: PropTypes.bool,
  isBrowserRendering: PropTypes.bool,
  clearAllFiltering: PropTypes.func,
};

Header.defaultProps = {
  nojs: false,
};

export default Header;
