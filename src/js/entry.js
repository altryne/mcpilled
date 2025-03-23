import PropTypes from "prop-types";
import { EMPTY_FILTERS } from "../constants/filters";

export const EMPTY_ENTRY = {
  body: "",
  date: "",
  faicon: "",
  icon: "",
  filters: { ...EMPTY_FILTERS, sort: "Descending" },
  links: [{ linkText: "", href: "", extraText: "" }],
  title: "",
  shortTitle: "",
  readableId: "",
  image: { src: "", alt: "", caption: "", isLogo: false },
  scamAmountDetails: {
    total: 0,
    hasScamAmount: false,
    preRecoveryAmount: 0,
  },
  collection: [],
};

export const LinkFieldPropType = PropTypes.shape({
  linkText: PropTypes.string.isRequired,
  href: PropTypes.string.isRequired,
  extraText: PropTypes.string,

  archiveHref: PropTypes.string,
  archiveTweetPath: PropTypes.string,
  archiveTweetAlt: PropTypes.string,
  archiveTweetAssets: PropTypes.object,
});

export const EntryPropType = PropTypes.shape({
  id: PropTypes.string,
  readableId: PropTypes.string.isRequired,
  filters: PropTypes.shape({
    theme: PropTypes.arrayOf(PropTypes.string).isRequired,
    category: PropTypes.arrayOf(PropTypes.string).isRequired,
    server: PropTypes.arrayOf(PropTypes.string).isRequired,
    sort: PropTypes.oneOf(["Descending", "Ascending"]).isRequired,
  }),
  color: PropTypes.string,
  collection: PropTypes.array,
  faicon: PropTypes.string,
  icon: PropTypes.string,
  date: PropTypes.string,
  title: PropTypes.string.isRequired,
  shortTitle: PropTypes.string.isRequired,
  image: PropTypes.shape({
    src: PropTypes.string.isRequired,
    alt: PropTypes.string.isRequired,
    caption: PropTypes.string,
    isLogo: PropTypes.bool,
  }),
  body: PropTypes.string.isRequired,
  links: PropTypes.arrayOf(LinkFieldPropType).isRequired,
  scamAmountDetails: PropTypes.shape({
    total: PropTypes.number.isRequired,
    hasScamAmount: PropTypes.bool.isRequired,
    preRecoveryAmount: PropTypes.number.isRequired,
  }),
});

const isEntryEmpty = (entry) =>
  JSON.stringify(entry) === JSON.stringify(EMPTY_ENTRY);

const hasValue = (obj, key) => {
  return key in obj && obj[key] !== undefined && obj[key] !== null;
};

export const trimEmptyFields = (entry, imageAttribution, entryAttribution) => {
  const trimmed = {};
  if (!isEntryEmpty(entry)) {
    const newEntry = JSON.parse(JSON.stringify(entry));

    if (!entry.faicon) {
      delete newEntry.faicon;
    }
    if (!entry.icon) {
      delete newEntry.icon;
    }
    if (!entry.image.src) {
      delete newEntry.image;
    } else if (!entry.image.caption) {
      delete newEntry.image.caption;
    }
    if (
      "lowerBound" in entry.scamAmountDetails &&
      entry.scamAmountDetails.lowerBound === 0 &&
      (!hasValue(entry.scamAmountDetails, "upperBound") ||
        entry.scamAmountDetails.upperBound === 0)
    ) {
      delete newEntry.scamAmountDetails.lowerBound;
    }
    if (
      "upperBound" in entry.scamAmountDetails &&
      entry.scamAmountDetails.upperBound === 0 &&
      (!hasValue(entry.scamAmountDetails, "lowerBound") ||
        entry.scamAmountDetails.lowerBound === 0)
    ) {
      delete newEntry.scamAmountDetails.upperBound;
    }
    if (
      "recovered" in entry.scamAmountDetails &&
      entry.scamAmountDetails.recovered === 0
    ) {
      delete newEntry.scamAmountDetails.recovered;
    }
    if (
      "textOverride" in entry.scamAmountDetails &&
      entry.scamAmountDetails.textOverride === ""
    ) {
      delete newEntry.scamAmountDetails.textOverride;
    }
    if (!entry.collection.length) {
      delete newEntry.collection;
    } else {
      newEntry.collection = entry.collection.filter(
        (entry) => entry.length > 0
      );
      if (!newEntry.collection.length) {
        delete newEntry.collection;
      }
    }
    const filteredLinks = entry.links
      .filter((link) => link.linkText && link.href)
      .map((link) => {
        if (link.extraText) {
          return link;
        } else {
          return { linkText: link.linkText, href: link.href };
        }
      });

    newEntry.links = filteredLinks;
    trimmed.entry = newEntry;
  }
  if (imageAttribution.text && imageAttribution.href) {
    trimmed.imageAttribution = imageAttribution;
  }
  if (entryAttribution.text) {
    trimmed.entryAttribution = entryAttribution;
  }
  return trimmed;
};

export const isValidEntry = (entry, imageAttribution, entryAttribution) => {
  if (!isEntryEmpty(entry)) {
    // Entry is defined, so validate everything necessary is there
    if (!entry.title || !entry.body || !entry.date) {
      return false;
    }
    if (
      Object.keys(entry.image).some((key) => !!entry.image[key]) &&
      (!entry.image.src || !entry.image.alt)
    ) {
      return false;
    }
    if (entry.date && !entry.date.match(/^\d{4}-\d{2}-\d{2}$/)) {
      return false;
    }
    if (!entry.faicon && !entry.icon) {
      return false;
    }
    if (
      (hasValue(entry.scamAmountDetails, "lowerBound") &&
        !hasValue(entry.scamAmountDetails, "upperBound")) ||
      (!hasValue(entry.scamAmountDetails, "lowerBound") &&
        hasValue(entry.scamAmountDetails, "upperBound"))
    ) {
      return false;
    }
  }
  if (
    (imageAttribution.text && !imageAttribution.href) ||
    (!imageAttribution.text && imageAttribution.href)
  ) {
    return false;
  }
  if (!entryAttribution.text && entryAttribution.href) {
    return false;
  }
  return true;
};
