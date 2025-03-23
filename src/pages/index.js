import { useCallback, useState, useEffect } from "react";
import PropTypes from "prop-types";
import { EntryPropType } from "../js/entry";

import { useRouter } from "next/router";
import { useInfiniteQuery } from "react-query";
import useGA from "../hooks/useGA";
import useWindowWidth from "../hooks/useWindowWidth";

import { copy } from "../js/utilities";
import { EMPTY_FILTERS, FILTER_CATEGORIES } from "../constants/filters";

import { getEntries } from "../db/entries-supabase";
import { getGlossaryEntries } from "../db/glossary-supabase";
import { getMetadata } from "../db/metadata-supabase";

import Timeline from "../components/timeline/Timeline";

export async function getServerSideProps(context) {
  let props = {
    initialFilters: copy(EMPTY_FILTERS),
    initialStarred: false,
  };

  if (context.query) {
    if (context.query.collection) {
      props.initialFilters.collection = context.query.collection;
    } else if (context.query.starred && context.query.starred === "true") {
      props.initialStarred = true;
    } else if (FILTER_CATEGORIES.some((filter) => filter in context.query)) {
      let hasFilterCategory = false;
      FILTER_CATEGORIES.forEach((filter) => {
        if (!hasFilterCategory && filter in context.query) {
          props.initialFilters[filter] = context.query[filter].split(",");
          hasFilterCategory = true;
        }
      });
    }

    if (context.query.id) {
      props.initialStartAtId = context.query.id;
    }
  }

  const [firstEntries, glossaryEntries, metadata] = await Promise.all([
    getEntries({
      ...props.initialFilters,
      starred: props.initialStarred,
      limit: 10,
    }),
    getGlossaryEntries(),
    getMetadata(),
  ]);

  // Convert arrays to objects with null values
  const glossary = {};
  const allCollections = {};

  return {
    props: {
      firstEntries,
      initialStartAtId: props.initialStartAtId || null,
      initialFilters: props.initialFilters,
      initialStarred: props.initialStarred,
      glossary,
      allCollections,
    },
  };
}

export default function IndexPage({
  firstEntries,
  initialStartAtId,
  initialFilters,
  initialStarred,
  glossary,
  allCollections,
}) {
  useGA();
  const router = useRouter();
  const windowWidth = useWindowWidth();

  const [collection, setCollectionState] = useState(initialFilters.collection);
  const [filters, setFilterState] = useState(initialFilters);
  const [starred, setStarredState] = useState(initialStarred);
  const [startAtId, setStartAtId] = useState(initialStartAtId);
  const [selectedEntryFromSearch, setSelectedEntryFromSearch] = useState(null);

  useEffect(() => {
    // Restore state when someone hits the back button
    router.beforePopState(({ url }) => {
      if (!url.match(/^\/[^?]/)) {
        const startOfQueryParams = url.indexOf("?");
        if (startOfQueryParams > -1) {
          // Filters
          const params = new URLSearchParams(url.slice(startOfQueryParams));
          const restoredFilters = copy(EMPTY_FILTERS);
          for (let category of FILTER_CATEGORIES) {
            if (params.has(category)) {
              restoredFilters[category] = params.get(category).split(",");
            }
          }
          setFilterState(restoredFilters);

          // Start at ID
          if (params.has("id")) {
            setSelectedEntryFromSearch(params.get("id"));
          } else {
            setSelectedEntryFromSearch(null);
          }

          // Collection
          if (params.has("collection")) {
            setCollectionState(params.get("collection"));
          } else {
            setCollectionState(null);
          }
        }
      }
      return true;
    });
  }, [router]);

  const setFilters = (filters) => {
    const query = {};
    for (let category of FILTER_CATEGORIES) {
      // Avoid setting a bunch of query params without values
      if (filters[category].length > 0) {
        query[category] = filters[category].join(",");
      }
    }

    // We can't filter by categories AND show the starred filter, but if the only filter
    // being applied is sorting, we can maintain the starred filter
    if (Object.keys(query).length) {
      router.push({ query }, null, { shallow: true });
      setStarredState(false);
    } else {
      if (starred) {
        query.starred = true;
      }
      router.push({ query }, null, { shallow: true });
    }

    setFilterState(filters);
  };

  const setStarred = (starred) => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    if (starred) {
      router.push({ query: { starred: true } }, null, {
        shallow: true,
      });
    } else {
      router.push({ query: {} }, null, { shallow: true });
    }
    setSelectedEntryFromSearch(null);
    setFilterState({ ...EMPTY_FILTERS, sort: filters.sort });
    setCollectionState(null);
    setStarredState(starred);
  };

  const setCollection = (coll) => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    if (coll) {
      router.push({ query: { collection: coll } }, null, {
        shallow: true,
      });
    } else {
      router.push({ query: {} }, null, { shallow: true });
    }
    setSelectedEntryFromSearch(null);
    setFilterState(EMPTY_FILTERS);
    setStarredState(false);
    setCollectionState(coll);
  };

  const clearAllFiltering = (scrollToTop = false) => {
    if (scrollToTop) {
      window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    }
    router.push({ query: {} }, null, { shallow: true });
    setSelectedEntryFromSearch(null);
    setFilterState(EMPTY_FILTERS);
    setStartAtId(null);
    setCollectionState(null);
  };

  const getFilteredEntries = useCallback(
    ({ pageParam = null }) => {
      if (selectedEntryFromSearch) {
        return getEntries({
          ...filters,
          collection,
          startAtId: selectedEntryFromSearch,
        });
      } else {
        return getEntries({
          ...filters,
          collection,
          starred,
          cursor: pageParam,
        });
      }
    },
    [collection, filters, starred, selectedEntryFromSearch]
  );

  const queryResult = useInfiniteQuery(
    [
      "entries",
      filters,
      selectedEntryFromSearch,
      collection,
      starred,
      startAtId,
    ],
    getFilteredEntries,
    {
      refetchOnMount: false,
      getNextPageParam: (lastPage) => {
        if (!lastPage) {
          // This is the first fetch, so we have no cursor
          return null;
        }
        if (!lastPage.hasNext) {
          // No entries remain, return undefined to signal this to react-query
          return undefined;
        }
        return lastPage.entries[lastPage.entries.length - 1]._key;
      },
      ...(!selectedEntryFromSearch && {
        initialData: {
          pages: [firstEntries],
          pageParams: [undefined],
        },
      }),
    }
  );

  return (
    <Timeline
      queryResult={queryResult}
      collection={collection}
      allCollections={allCollections}
      filters={filters}
      glossary={glossary}
      selectedEntryFromSearch={selectedEntryFromSearch}
      startAtId={startAtId}
      setCollection={setCollection}
      setFilters={setFilters}
      starred={starred}
      setStarred={setStarred}
      setSelectedEntryFromSearch={setSelectedEntryFromSearch}
      clearAllFiltering={clearAllFiltering}
      windowWidth={windowWidth}
    />
  );
}

IndexPage.propTypes = {
  firstEntries: PropTypes.shape({
    entries: PropTypes.arrayOf(EntryPropType).isRequired,
    hasNext: PropTypes.bool.isRequired,
    hasPrev: PropTypes.bool,
  }).isRequired,
  initialFilters: PropTypes.object.isRequired,
  initialCollection: PropTypes.string,
  initialStarred: PropTypes.bool.isRequired,
  initialStartAtId: PropTypes.string,
  glossary: PropTypes.object.isRequired,
  allCollections: PropTypes.object.isRequired,
};
