import clsx from "clsx";
import PropTypes from "prop-types";
import { Fragment, useCallback, useMemo, useRef, useState } from "react";

import useIsBrowserRendering from "../../hooks/useIsBrowserRendering";
import useWindowWidth from "../../hooks/useWindowWidth";

import { FiltersPropType } from "../../constants/filters";
import {
  getCollectionName,
  removeQueryParamsFromUrl,
  stripHtml,
} from "../../js/utilities";

import Link from "next/link";
import { InView, useInView } from "react-intersection-observer";

import BackBar from "../BackBar";
import CustomEntryHead from "../CustomEntryHead";
import Error from "../Error";
import Loader from "../Loader";
import Entry from "./Entry";
import Filters from "./Filters";
import FixedAtBottom from "./FixedAtBottom";
import Header from "./Header";

export default function Timeline({
  queryResult,
  collection,
  filters,
  starred,
  glossary,
  allCollections,
  selectedEntryFromSearch,
  startAtId,
  setCollection,
  setFilters,
  setStarred,
  setSelectedEntryFromSearch,
  clearAllFiltering,
}) {
  const isBrowserRendering = useIsBrowserRendering();
  const windowWidth = useWindowWidth();

  // Add state for search mode
  const [searchMode, setSearchMode] = useState('hybrid');
  // Add state for sort order
  const [sortOrder, setSortOrder] = useState(filters.sort || 'Descending');

  const [headerInViewRef, headerInView] = useInView();
  const headerFocusRef = useRef();

  const scrollToTop = useCallback(() => {
    window.scrollTo(0, 0);
    headerFocusRef.current.focus();
  }, [headerFocusRef]);

  const {
    data,
    hasNextPage,
    fetchNextPage,
    isFetching,
    isLoading,
    isError,
    isSuccess,
  } = queryResult;

  const hasPreviousEntries = useMemo(
    () =>
      isSuccess &&
      data &&
      data.pages &&
      data.pages.length &&
      data.pages[0] &&
      !!data.pages[0].hasPrev,
    [data, isSuccess]
  );

  const shouldRenderGoToTop = useMemo(() => {
    return (!!startAtId && hasPreviousEntries) || !!selectedEntryFromSearch;
  }, [startAtId, hasPreviousEntries, selectedEntryFromSearch]);

  const shouldRenderFilterBar = useMemo(
    () => !collection && (!startAtId || !hasPreviousEntries),
    [collection, hasPreviousEntries, startAtId]
  );

  const collectionDescription = useMemo(
    () =>
      collection
        ? `Entries related to ${getCollectionName(collection, allCollections)}`
        : null,
    [collection, allCollections]
  );

  const renderHead = () => {
    if (startAtId || collection) {
      return (
        <CustomEntryHead
          entry={data.pages[0].entries[0]}
          collectionDescription={collectionDescription}
        />
      );
    }
    return null;
  };

  const renderScrollSentinel = () => {
    return (
      <InView
        threshold={0}
        onChange={(inView) => {
          if (inView && !isFetching) {
            fetchNextPage();
          }
        }}
      >
        <div className="scroll-sentinel"></div>
      </InView>
    );
  };

  const renderGoToTop = () => {
    if (!isBrowserRendering) {
      return (
        <>
          <div className="load-top">
            {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
            <a className="button" href="/">
              <span>Start from the top</span>
            </a>
          </div>
          <div className="timeline dots" />
        </>
      );
    }
    return (
      <>
        <div className="load-top">
          <button onClick={() => clearAllFiltering(true)}>
            <span>Start from the top</span>
          </button>
        </div>
        <div className="timeline dots" />
      </>
    );
  };

  const renderNoJs = () => {
    if (!isBrowserRendering && data && data.pages && data.pages.length > 0 && 
        data.pages[0].entries && data.pages[0].entries.length > 0) {
      const cursor = data.pages[0].entries[data.pages[0].entries.length - 1].id;
      return (
        <p id="noscript">
          No JavaScript? That's cool too! Check out the{" "}
          <Link href={`/web1?cursor=${cursor}&direction=next`}>
            Web&nbsp;1.0
          </Link>{" "}
          version.
        </p>
      );
    }
    return null;
  };

  const renderEntries = () => {
    return (
      <>
        {shouldRenderGoToTop && renderGoToTop()}
        {renderHead()}
        <article
          id="timeline"
          className={clsx("timeline", {
            "small-top-margin": shouldRenderGoToTop,
          })}
        >
          {data.pages.map((page, pageInd) => {
            const isLastPage = pageInd === data.pages.length - 1;
            return (
              <Fragment key={`page-${pageInd}`}>
                {page.entries.map((entry, entryInd) => {
                  const isLastEntry = entryInd === page.entries.length - 1;
                  let className = entryInd % 2 === 0 ? "even" : "odd";
                  if (pageInd === 0 && entryInd === 0) {
                    className += " first";
                  } else if (stripHtml(entry.body).length < 400) {
                    // Don't want to include the short class on the very first entry or it overlaps
                    className += " short";
                  }

                  const entryElement = (
                    <Entry
                      key={entry.id}
                      entry={entry}
                      className={className}
                      windowWidth={windowWidth}
                    />
                  );

                  // Render the scroll sentinel above the last entry in the last page of results so we can begin loading
                  // the next page when it comes into view.
                  if (isLastPage && isLastEntry) {
                    return (
                      <Fragment key={`${entry.id}-withSentinel`}>
                        {renderScrollSentinel()}
                        {entryElement}
                      </Fragment>
                    );
                  }
                  return entryElement;
                })}
              </Fragment>
            );
          })}
          {hasNextPage && isBrowserRendering && <Loader />}
        </article>
        {renderNoJs()}
      </>
    );
  };

  const renderBody = () => {
    if (isLoading) {
      return <Loader />;
    } else if (isError) {
      return <Error />;
    }
    return renderEntries();
  };

  return (
    <>
      <Header
        isBrowserRendering={isBrowserRendering}
        windowWidth={windowWidth}
        clearAllFiltering={clearAllFiltering}
        ref={{ focusRef: headerFocusRef, inViewRef: headerInViewRef }}
      />
      {isBrowserRendering && collection && (
        <BackBar
          customText="All entries"
          backFunction={() => {
            setCollection(null);
            removeQueryParamsFromUrl();
          }}
          titleText={collectionDescription}
        />
      )}
      {isBrowserRendering && shouldRenderFilterBar && (
        <Filters
          filters={filters}
          setFilters={setFilters}
          starred={starred}
          setStarred={setStarred}
          setSelectedEntryFromSearch={setSelectedEntryFromSearch}
          windowWidth={windowWidth}
        />
      )}
      <div
        className="timeline-page content-wrapper"
        aria-busy={isLoading}
        aria-live="polite"
      >
        {renderBody()}
      </div>
      <FixedAtBottom
        headerInView={headerInView}
        scrollToTop={scrollToTop}
        searchMode={searchMode}
        setSearchMode={setSearchMode}
        sortOrder={sortOrder}
        setSortOrder={(order) => {
          setSortOrder(order);
          setFilters({...filters, sort: order});
        }}
      />
    </>
  );
}

Timeline.propTypes = {
  queryResult: PropTypes.shape({
    data: PropTypes.object,
    hasNextPage: PropTypes.bool,
    fetchNextPage: PropTypes.func.isRequired,
    isFetching: PropTypes.bool.isRequired,
    isLoading: PropTypes.bool.isRequired,
    isError: PropTypes.bool.isRequired,
    isSuccess: PropTypes.bool.isRequired,
  }),
  filters: FiltersPropType.isRequired,
  collection: PropTypes.string,
  starred: PropTypes.bool.isRequired,
  glossary: PropTypes.object.isRequired,
  allCollections: PropTypes.object.isRequired,
  selectedEntryFromSearch: PropTypes.string,
  startAtId: PropTypes.string,
  setCollection: PropTypes.func.isRequired,
  setFilters: PropTypes.func.isRequired,
  setStarred: PropTypes.func.isRequired,
  setSelectedEntryFromSearch: PropTypes.func.isRequired,
  clearAllFiltering: PropTypes.func.isRequired,
};
