/* eslint-disable @next/next/no-img-element */
import { useCallback, useEffect, useRef, useState, useMemo } from "react";
import useIsBrowserRendering from "../../hooks/useIsBrowserRendering";
import { useRouter } from "next/router";

import PropTypes from "prop-types";
import { EntryPropType } from "../../js/entry";
import { getEntryImageProps, getLightboxImageProps } from "../../js/images";
import { WindowWidthPropType } from "../../hooks/useWindowWidth";
import clsx from "clsx";

import { STORAGE_URL } from "../../constants/urls";
import FILTERS from "../../constants/filters";
import { ICON_PATHS, ALL_ICONS } from "../../constants/icons";

import {
  getCollectionName,
  humanizeDate,
  humanizeList,
  getPermalink,
} from "../../js/utilities";

import { InView } from "react-intersection-observer";
import Link from "next/link";
import TimelineEntryContent from "./TimelineEntryContent";
import { useSearchParams } from "next/navigation";

export default function Entry({
  entry,
  className,
  windowWidth,
  glossary,
  collection,
  allCollections,
  setCollection,
  setStarred,
  shouldScrollToElement,
}) {
  const ref = useRef();
  const router = useRouter();
  const searchParams = useSearchParams();
  const isBrowserRendering = useIsBrowserRendering();

  const [showCopiedPopup, setShowCopiedPopup] = useState(false);
  const [showLightbox, setShowLightbox] = useState(false);

  useEffect(() => {
    if (ref.current && isBrowserRendering) {
      const rect = ref.current.getBoundingClientRect();
      window.scrollTo(0, rect.y - 70);
    }
  }, [ref, isBrowserRendering]);

  const onEsc = useCallback((event) => {
    if (event.keyCode === 27) {
      setShowLightbox(false);
    }
  }, []);

  useEffect(() => {
    document.addEventListener("keydown", onEsc);
    return () => {
      document.removeEventListener("keydown", onEsc);
    };
  }, [onEsc]);

  const permalink = (id) => {
    const newParams = { ...router.query, id };
    router.push({ query: newParams }, null, { shallow: true });
    const perma = getPermalink(newParams);
    navigator.clipboard.writeText(perma);
    setShowCopiedPopup(true);
    setTimeout(() => {
      setShowCopiedPopup(false);
    }, 1000);
  };

  const getTagString = (category) => {
    if (
      entry.filters &&
      entry.filters[category] &&
      entry.filters[category].length
    ) {
      return entry.filters[category]
        .map((key) => FILTERS[category][key])
        .sort()
        .join(", ");
    }
    return null;
  };

  // If a user is viewing a collection, don't render that tag for all the entries again
  const collectionsToRender = useMemo(() => {
    if ("collection" in entry && Array.isArray(entry.collection)) {
      return entry.collection.filter((coll) => coll !== collection);
    }
    return null;
  }, [entry, collection]);

  const noJsPermalink = useMemo(
    () =>
      router.route.startsWith("/web1")
        ? `#${entry.readableId}`
        : `?id=${entry.readableId}`,
    [entry.readableId, router.route]
  );

  const isEntryHighlighted = useMemo(
    () => entry.readableId === searchParams.get("id"),
    [entry.readableId, searchParams]
  );

  const renderIcon = () => {
    if (entry.icon) {
      // Check if the icon exists in ALL_ICONS
      if (ALL_ICONS[entry.icon] && ICON_PATHS[entry.icon]) {
        return (
          <div className="icon-wrapper" title={ALL_ICONS[entry.icon].text}>
            <img
              src={`/icons/${ICON_PATHS[entry.icon]}`}
              alt="" // Decorative, hidden to screenreaders
              aria-hidden="true"
            />
          </div>
        );
      } else {
        // Fallback for icons that don't exist
        return (
          <div className="icon-wrapper" title="Icon">
            <i className="fas fa-info-circle" aria-hidden="true"></i>
          </div>
        );
      }
    } else if (entry.faicon) {
      // Check if the icon exists in ALL_ICONS
      if (ALL_ICONS[entry.faicon]) {
        const iconType = ALL_ICONS[entry.faicon].type;
        const iconClass = iconType === "fab" ? "fab" : "fas";
        
        return (
          <div className="icon-wrapper" title={ALL_ICONS[entry.faicon].text}>
            <i className={`${iconClass} fa-${entry.faicon}`} aria-hidden="true"></i>
          </div>
        );
      } else {
        // Fallback for icons that don't exist in ALL_ICONS
        return (
          <div className="icon-wrapper" title="Icon">
            <i className={`fas fa-${entry.faicon}`} aria-hidden="true"></i>
          </div>
        );
      }
    }
    return null;
  };

  const renderLinkIcon = () => {
    if (isBrowserRendering) {
      return (
        <li>
          {showCopiedPopup && <div className="permalink-popup">Copied</div>}
          <button
            onClick={() => permalink(entry.readableId)}
            title="Permalink"
            data-url={`${window.location.origin}/?id=${entry.readableId}`}
          >
            <i className="fas fa-link" aria-hidden={true} />
          </button>
        </li>
      );
    } else {
      // No JS
      return (
        <Link
          href={noJsPermalink}
          data-url={`https://www.web3isgoinggreat.com/?id=${entry.readableId}`}
        >
          <i className="fas fa-link" title="Permalink" />
        </Link>
      );
    }
  };

  const maybeRenderStar = () => {
    if (entry.starred) {
      const star = (
        <>
          <i className="fas fa-star starred-entry" title="Starred entry"></i>
        </>
      );
      if (setStarred) {
        return <button onClick={() => setStarred(true)}>{star}</button>;
      }
      // Don't make the star clickable in the web1 view
      return star;
    }
  };

  const renderTimestampAndLinkIcons = () => {
    return (
      <div className="timestamp-and-link-icons">
        <span className="timestamp">
          <Link href={`/single/${entry.readableId}`}>
            <time dateTime={entry.date}>{humanizeDate(entry.date)}</time>
          </Link>
        </span>
        <ul className="entry-link-icons">
          {maybeRenderStar()}
          {renderLinkIcon()}
          {"socialPostIds" in entry && "twitter" in entry.socialPostIds && (
            <li>
              <a
                href={`https://twitter.com/web3isgreat/status/${entry.socialPostIds.twitter}`}
                target="_blank"
                rel="noopener"
                title="Tweet link"
              >
                <i className="fa-brands fa-twitter" aria-hidden={true} />
              </a>
            </li>
          )}
        </ul>
      </div>
    );
  };

  const renderImageElement = ({ onClick, isLightbox } = {}) => {
    if (!entry.image) {
      return null;
    }

    const { alt, isLogo } = entry.image;
    const imageProps = isLightbox
      ? getLightboxImageProps(entry.image)
      : getEntryImageProps(entry.image);
    return (
      <img
        {...imageProps}
        alt={alt}
        onClick={!isLogo && onClick ? onClick : null}
        className={clsx([
          {
            clickable: !isLogo && !!onClick,
          },
          entry.image.class,
        ])}
      />
    );
  };

  const renderImageCaption = () => {
    if (entry.image) {
      return (
        <>
          {!entry.image.isLogo && entry.image.caption && (
            <>
              <span
                className="caption"
                dangerouslySetInnerHTML={{ __html: entry.image.caption }}
              />{" "}
            </>
          )}
          <span className="attribution-link">
            <Link href="/attribution">(attribution)</Link>
          </span>
        </>
      );
    }
    return null;
  };

  const renderImage = () => {
    if (
      entry.image &&
      entry.image.src &&
      (windowWidth !== "xs" || !entry.image.isLogo)
    ) {
      return (
        <div
          className={clsx(
            "captioned-image",
            "image-right",
            entry.image.isLogo && "is-logo"
          )}
        >
          {renderImageElement({ onClick: () => setShowLightbox(true) })}
          {renderImageCaption()}
        </div>
      );
    }
    return null;
  };

  const renderLightbox = () => {
    if (entry.image && showLightbox) {
      return (
        <div className="lightbox-container">
          <button onClick={() => setShowLightbox(false)}>
            <i className="fas fa-xmark" aria-hidden={true}></i>
            <span className="sr-only">Close lightbox</span>
          </button>
          <div className="image-wrapper">
            {renderImageElement({ isLightbox: true })}
          </div>
          <div className="caption-wrapper">{renderImageCaption()}</div>
        </div>
      );
    }
  };

  const renderArchiveLink = (link) => {
    if (!link.archiveHref && !link.archiveTweetPath) {
      return null;
    }
    let linkEl;
    if (link.archiveHref) {
      linkEl = (
        <a
          className="archive-link"
          href={link.archiveHref}
          target="_blank"
          rel="noreferrer"
        >
          [archive]
        </a>
      );
    } else if (link.archiveTweetPath) {
      linkEl = (
        <Link
          className="archive-link"
          href={`/archive/${link.archiveTweetPath}`}
          target="_blank"
        >
          [archive]
        </Link>
      );
    }
    return <span> {linkEl}</span>;
  };

  const renderLinks = () => {
    if (entry.links && entry.links.length) {
      return (
        <ul>
          {entry.links.map((link) => (
            <li key={link.href}>
              <a href={link.href} target="_blank" rel="noreferrer">
                <span dangerouslySetInnerHTML={{ __html: link.linkText }} />
              </a>
              {link.extraText && (
                <span dangerouslySetInnerHTML={{ __html: ` ${link.extraText}` }} />
              )}
              {renderArchiveLink(link)}
            </li>
          ))}
        </ul>
      );
    }
    return null;
  };

  const renderTags = () => {
    const theme = getTagString("theme");
    const blockchainTagString = getTagString("blockchain");
    const blockchain = blockchainTagString
      ? `Blockchain: ${blockchainTagString}`
      : null;
    const tech = getTagString("tech");
    return (
      <div className="tags">
        <div className="tag-list theme">
          <span className="sr-only">Theme tags: </span>
          <i className="fas fa-hashtag" aria-hidden="true"></i>
          {theme}
        </div>
        <div className="tag-group-right">
          {blockchain && (
            <div className="tag-list">
              <span className="sr-only">Blockchain tags: </span>
              <span>{blockchain}</span>
            </div>
          )}
          {tech && (
            <div className="tag-list">
              <span className="sr-only">Tech tags: </span>
              <span>{tech}</span>
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderTagsWithSentinel = () => {
    return renderTags();
  };

  const renderCollectionList = (collections) => {
    return collections.map((coll) => {
      const collectionName = getCollectionName(coll, allCollections);
      if (setCollection && typeof setCollection === "function") {
        return (
          <button key={coll} onClick={() => setCollection(coll)}>
            {collectionName}
          </button>
        );
      } else {
        return (
          <Link key={coll} href={`/?collection=${coll}`}>
            {collectionName}
          </Link>
        );
      }
    });
  };

  const renderCollection = () => {
    if (
      isBrowserRendering &&
      collectionsToRender &&
      collectionsToRender.length > 0 &&
      allCollections
    ) {
      return (
        <div className="collection-row">
          <span>
            Other entries related to{" "}
            {humanizeList(renderCollectionList(collectionsToRender), {
              exclusive: true,
            })}
          </span>
        </div>
      );
    }
    return null;
  };

  const renderFooterContent = () => {
    return (
      <div className="entry-footer">
        {renderCollection()}
        {renderTagsWithSentinel()}
      </div>
    );
  };

  return (
    <div
      className={`timeline-entry ${className}`}
      ref={shouldScrollToElement ? ref : null}
    >
      <div className={clsx("timeline-icon", entry.color || "purple")}>
        {renderIcon()}
      </div>

      <div
        className={clsx("timeline-description", {
          highlighted: isEntryHighlighted,
        })}
      >
        <div className="entry-wrapper">
          {renderTimestampAndLinkIcons()}
          <h2>
            <a id={entry.readableId}>
              <span dangerouslySetInnerHTML={{ __html: entry.title }} />
            </a>
          </h2>
          {renderImage(true)}
          <TimelineEntryContent glossary={glossary}>
            {entry.body}
          </TimelineEntryContent>
          {renderLinks()}
        </div>
        {renderFooterContent()}
      </div>
      {renderLightbox()}
    </div>
  );
}

Entry.propTypes = {
  className: PropTypes.string,
  entry: EntryPropType,
  windowWidth: WindowWidthPropType,
  collection: PropTypes.string,
  glossary: PropTypes.object, // Not defined in web1
  allCollections: PropTypes.object, // Not defined in web1
  setCollection: PropTypes.func, // Not defined in web1
  setStarred: PropTypes.func, // Not defined in web1
  shouldScrollToElement: PropTypes.bool,
};
