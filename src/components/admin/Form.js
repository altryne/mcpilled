import { useState, useEffect, useMemo, useRef } from "react";
import { useRouter } from "next/router";
import { v4 as uuidv4 } from "uuid";
import { FILTER_CATEGORIES } from "../../constants/filters";
import { signOut, upload, deleteEntry } from "../../js/admin-supabase";
import { generateReadableId } from "../../js/utilities";

import { EMPTY_ENTRY, isValidEntry } from "../../js/entry";

import Entry from "../timeline/Entry";
import IconSelector from "./IconSelector";
import EntryTextArea from "./EntryTextArea";
import FilterSelector from "./FilterSelector";
import LinkField from "./LinkField.js";
import { supabase } from "../../db/supabase";

export default function Form() {
  const router = useRouter();
  const { id: editId } = router.query || {};
  
  console.log("Router query:", router.query);
  console.log("Edit ID from URL:", editId);

  // Default empty entry
  const [entry, setEntry] = useState({
    id: "",
    title: "",
    shortTitle: "",
    readableId: "",
    date: new Date().toISOString().split("T")[0],
    body: "",
    faicon: "",
    icon: "",
    image: { src: "", alt: "", caption: "", isLogo: false },
    collection: [],
    starred: false,
    filters: {
      theme: [],
      category: [],
      server: [],
      sort: "Descending"
    },
    links: [{ linkText: "", href: "", extraText: "" }]
  });
  const [imageAttribution, setImageAttribution] = useState({
    text: "",
    href: "",
  });
  const [entryAttribution, setEntryAttribution] = useState({
    text: "",
    href: "",
  });
  const generatedReadableId = useMemo(
    () => generateReadableId(entry.shortTitle || entry.title),
    [entry.shortTitle, entry.title]
  );
  const [isUploading, setIsUploading] = useState(false);
  const [isUploadComplete, setIsUploadComplete] = useState(false);
  const [entryId, setEntryId] = useState();
  const [saveMessage, setSaveMessage] = useState('');
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [isFloating, setIsFloating] = useState(false);
  const formEndRef = useRef(null);
  const saveContainerRef = useRef(null);
  
  // If we get an editId param, fetch that entry from Supabase
  useEffect(() => {
    async function fetchExisting() {
      if (!editId) return;
      console.log("Attempting to fetch entry with ID:", editId);
      try {
        // First try to fetch by id (which is the date-based format like 2024-11-04-0)
        let { data, error } = await supabase
          .from("entries")
          .select(`
            *,
            entry_filters(filter_type, filter_value),
            entry_links(*)
          `)
          .eq("id", editId)
          .single();
        
        console.log("Query result by id:", { data, error });
        
        // If no results, try by readable_id
        if (!data && error) {
          console.log("No results by id, trying by readable_id");
          const result = await supabase
            .from("entries")
            .select(`
              *,
              entry_filters(filter_type, filter_value),
              entry_links(*)
            `)
            .eq("readable_id", editId)
            .single();
            
          data = result.data;
          error = result.error;
          console.log("Query result by readable_id:", { data, error });
        }

        if (error) {
          console.error("Error fetching existing entry:", error);
          return;
        }
        if (data) {
          console.log("Raw data from Supabase:", data);
          
          // Create a safe transformation function to handle potentially missing fields
          const safeGet = (obj, path, defaultValue) => {
            if (!obj) return defaultValue;
            const parts = path.split('.');
            let current = obj;
            for (const part of parts) {
              if (current[part] === undefined) return defaultValue;
              current = current[part];
            }
            return current;
          };
          
          // transform data from supabase shape to something the form can handle
          const transformed = {
            id: safeGet(data, 'id', ''),
            title: safeGet(data, 'title', ''),
            shortTitle: safeGet(data, 'short_title', ''),
            readableId: safeGet(data, 'readable_id', ''),
            date: safeGet(data, 'date', ''),
            body: safeGet(data, 'body', ''),
            faicon: safeGet(data, 'faicon', ''),
            icon: safeGet(data, 'icon', ''),
            image: safeGet(data, 'image', { src: "", alt: "", caption: "", isLogo: false }),
            collection: safeGet(data, 'collection', []),
            starred: safeGet(data, 'starred', false),
            filters: {
              theme: [],
              category: [],
              server: [],
              sort: "Descending"
            },
            links: []
          };
          console.log("Transformed data:", transformed);
          
          // parse filters
          if (data.entry_filters && Array.isArray(data.entry_filters)) {
            data.entry_filters.forEach((f) => {
              if (f && f.filter_type && f.filter_value && transformed.filters[f.filter_type]) {
                transformed.filters[f.filter_type].push(f.filter_value);
              }
            });
          }
          
          // parse links
          if (data.entry_links && Array.isArray(data.entry_links)) {
            transformed.links = data.entry_links.map(link => ({
              linkText: link?.link_text || "",
              href: link?.href || "",
              extraText: link?.extra_text || "",
              archiveHref: link?.archive_href || "",
              archiveTweetPath: link?.archive_tweet_path || "",
              archiveTweetAlt: link?.archive_tweet_alt || "",
              archiveTweetAssets: link?.archive_tweet_assets || {},
            }));
          }
          
          setEntry(transformed);
        }
      } catch (err) {
        console.error("Unexpected error fetching existing entry:", err);
      }
    }
    fetchExisting();
  }, [editId]);

  const onWindowClose = (evt) => {
    if (entry !== EMPTY_ENTRY) {
      evt.preventDefault();
      evt.returnValue = "";
      return "";
    }
  };

  useEffect(() => {
    window.addEventListener("beforeunload", onWindowClose);
    return () => {
      window.removeEventListener("beforeunload", onWindowClose);
    };
  });

  const createFieldSetter = (field) => (val) => {
    let value;
    if (val && val.target && "value" in val.target) {
      value = val.target.value;
    } else {
      value = val;
    }
    setEntry({ ...entry, [field]: value });
  };
  const updateEntry = (toMerge) => {
    // Special handling for icon/faicon to ensure they don't both exist simultaneously
    if ('icon' in toMerge || 'faicon' in toMerge) {
      const updatedEntry = { ...entry };
      
      // Clear both fields first
      updatedEntry.icon = '';
      updatedEntry.faicon = '';
      
      // Then set the new value
      setEntry({ ...updatedEntry, ...toMerge });
    } else {
      // Normal update for other fields
      setEntry({ ...entry, ...toMerge });
    }
  };
  const setLinks = createFieldSetter("links");
  const setImage = createFieldSetter("image");
  
  const setCollection = createFieldSetter("collection");
  const setStarred = createFieldSetter("starred");

  const toggleImageClass =
    (className) =>
    ({ target: { checked } }) => {
      if (checked) {
        entry.image.class = className;
      } else {
        delete entry.image.class;
      }
    };

  const addLink = () => {
    const newLink = { linkText: "", href: "", extraText: "" };
    const links = JSON.parse(JSON.stringify(entry.links));
    links.push(newLink);
    setLinks(links);
  };

  const clear = () => {
    setEntry({
      id: "",
      title: "",
      shortTitle: "",
      readableId: "",
      date: new Date().toISOString().split("T")[0],
      body: "",
      faicon: "",
      icon: "",
      image: { src: "", alt: "", caption: "", isLogo: false },
      collection: [],
      starred: false,
      filters: {
        theme: [],
        category: [],
        server: [],
        sort: "Descending"
      },
      links: [{ linkText: "", href: "", extraText: "" }]
    });
    setImageAttribution({ text: "", href: "" });
    setEntryAttribution({ text: "", href: "" });
    setEntryId(undefined);
  };

  const save = () => {
    setShowConfirmation(true);
  };

  const confirmSave = () => {
    setShowConfirmation(false);
    setIsUploading(true);
    setSaveMessage('');
    
    // Create a copy of the entry with defaults
    const entryWithDefaults = JSON.parse(JSON.stringify(entry));
    
    if (!entryWithDefaults.readableId) {
      entryWithDefaults.readableId = generatedReadableId;
    }
    if (!entryWithDefaults.shortTitle) {
      entryWithDefaults.shortTitle = entryWithDefaults.title;
    }
    

    // This calls our "uploadEntry" which can detect if we should update or insert
    // depending on if we have "entry.id" that already exists in supabase
    upload(entryWithDefaults, imageAttribution, entryAttribution)
      .then((updatedOrNewId) => {
        setIsUploadComplete(true);
        setEntryId(updatedOrNewId);
        setSaveMessage('Entry saved successfully! Redirecting...');
        setIsUploading(false);
        
        // Redirect to the single entry page after a short delay
        setTimeout(() => {
          router.push(`/single/${entryWithDefaults.readableId || updatedOrNewId}`);
        }, 1500);
      })
      .catch((e) => {
        setIsUploading(false);
        setSaveMessage(`Error saving entry: ${e.message}`);
        console.error(e);
      });
  };

  const cancelSave = () => {
    setShowConfirmation(false);
  };

  const deleteEntryConfirm = () => {
    setShowDeleteConfirmation(true);
  };

  const confirmDelete = () => {
    setShowDeleteConfirmation(false);
    setIsUploading(true);
    setSaveMessage('');
    
    deleteEntry(entry.id)
      .then(() => {
        setIsUploadComplete(true);
        setSaveMessage('Entry deleted successfully! Redirecting...');
        setIsUploading(false);
        
        // Redirect to the timeline page after a short delay
        setTimeout(() => {
          router.push(`/timeline`);
        }, 1500);
      })
      .catch((e) => {
        setIsUploading(false);
        setSaveMessage(`Error deleting entry: ${e.message}`);
        console.error(e);
      });
  };

  const cancelDelete = () => {
    setShowDeleteConfirmation(false);
  };

  // Add scroll listener to determine when to float the save button
  useEffect(() => {
    const handleScroll = () => {
      if (formEndRef.current && saveContainerRef.current) {
        const formEndRect = formEndRef.current.getBoundingClientRect();
        const isEndVisible = formEndRect.top <= window.innerHeight;
        setIsFloating(!isEndVisible);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial check
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div className="form-wrapper">
      <div className="entry-form">
        <div className="row">
          <div className="group">
            <label htmlFor="title">Title: </label>
            <textarea
              rows={2}
              id="title"
              onChange={createFieldSetter("title")}
              value={entry.title}
            />
          </div>
        </div>
        <div className="row">
          <div className="group">
            <label htmlFor="shortTitle">Short title: </label>
            <textarea
              rows={1}
              id="shortTitle"
              onChange={createFieldSetter("shortTitle")}
              value={entry.shortTitle || entry.title}
            />
          </div>
        </div>
        <div className="row">
          <div className="group">
            <label htmlFor="readableId">Readable ID: </label>
            <textarea
              rows={1}
              id="readableId"
              onChange={createFieldSetter("readableId")}
              value={entry.readableId || generatedReadableId}
            />
          </div>
        </div>
        <div className="row">
          <div className="grow">
            <label htmlFor="date">Date: </label>
            <input
              id="date"
              placeholder="YYYY-MM-DD"
              onChange={createFieldSetter("date")}
              value={entry.date}
            ></input>
          </div>
          <div className="grow">
            <IconSelector
              updateEntry={updateEntry}
              value={entry.faicon || entry.icon}
            />
          </div>
          <div className="shrink row">
            <input
              id="starred"
              type="checkbox"
              checked={entry.starred || false}
              onChange={({ target: { checked } }) => setStarred(checked)}
            />
            <label htmlFor="starred">&nbsp;Starred</label>
          </div>
        </div>
        
        
        <EntryTextArea entry={entry} onBodyChange={createFieldSetter("body")} />
        <div className="row stretch">
          <FilterSelector filter="theme" entry={entry} setEntry={setEntry} />
          <FilterSelector filter="category" entry={entry} setEntry={setEntry} />
          <FilterSelector filter="server" entry={entry} setEntry={setEntry} />
        </div>
        <div className="row">
          <div className="group">
            <label htmlFor="collection">Collection: </label>
            <input
              id="collection"
              onChange={({ target: { value } }) => {
                const splitCollection = value.split(/, */);
                setCollection(splitCollection);
              }}
              value={entry.collection.join(", ")}
            />
          </div>
        </div>
        <hr />
        {entry.links.map((link, ind) => (
          <LinkField
            index={ind}
            entry={entry}
            setLinks={setLinks}
            key={`link-${ind}`}
          />
        ))}
        <div className="row">
          <button onClick={addLink}>Add link</button>
        </div>
        <hr />
        <div className="row">
          <div className="group">
            <div>
              <b>Image:</b>
            </div>
            <label htmlFor="src">Src: </label>
            <input
              id="src"
              value={entry.image.src}
              onChange={({ target: { value } }) => {
                setImage({ ...entry.image, src: value });
              }}
            />
          </div>
        </div>
        <div className="row">
          <div className="group">
            <label htmlFor="alt">Alt text: </label>
            <textarea
              rows={3}
              id="alt"
              value={entry.image.alt}
              onChange={({ target: { value } }) => {
                setImage({ ...entry.image, alt: value });
              }}
            />
          </div>
        </div>
        <div className="row">
          <div className="group">
            <label htmlFor="caption">Caption: </label>
            <input
              id="caption"
              value={entry.image.caption}
              onChange={({ target: { value } }) => {
                setImage({ ...entry.image, caption: value });
              }}
            />
          </div>
        </div>
        <div className="row">
          <div className="third">
            <div className="inline-checkbox">
              <input
                id="needs-dark"
                type="checkbox"
                checked={entry.image.class && entry.image.class === "on-dark"}
                onChange={toggleImageClass("on-dark")}
              />
              <label htmlFor="needs-dark">Needs dark bg</label>
            </div>
          </div>
          <div className="third">
            <div className="inline-checkbox">
              <input
                id="needs-light"
                type="checkbox"
                checked={entry.image.class && entry.image.class === "on-light"}
                onChange={toggleImageClass("on-light")}
              />
              <label htmlFor="needs-light">Needs light bg</label>
            </div>
          </div>
          <div className="third">
            <div className="inline-checkbox">
              <input
                id="is-logo"
                type="checkbox"
                checked={entry.image.isLogo}
                onChange={({ target: { checked } }) => {
                  setImage({ ...entry.image, isLogo: checked });
                }}
              />
              <label htmlFor="is-logo">Logo?</label>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="half">
            <label htmlFor="imageAttrText">Image attribution text: </label>
            <input
              id="imageAttrText"
              onChange={({ target: { value } }) =>
                setImageAttribution({ ...imageAttribution, text: value })
              }
              value={imageAttribution.text}
            ></input>
          </div>
          <div className="half">
            <label htmlFor="imageAttrHref">Image attribution href: </label>
            <input
              id="imageAttrHref"
              onChange={({ target: { value } }) =>
                setImageAttribution({ ...imageAttribution, href: value })
              }
              value={imageAttribution.href}
            ></input>
          </div>
        </div>
        <div className="row">
          <div className="group">
            <label htmlFor="caption">Source link: </label>
            <input
              id="source-link"
              value={entry.image.link || ""}
              onChange={({ target: { value } }) => {
                setImage({ ...entry.image, link: value });
              }}
            />
          </div>
        </div>
        <hr />
        <div className="row">
          <div className="half">
            <label htmlFor="entryAttrText">Entry attribution text: </label>
            <input
              id="entryAttrText"
              onChange={({ target: { value } }) =>
                setEntryAttribution({ ...entryAttribution, text: value })
              }
              value={entryAttribution.text}
            ></input>
          </div>
          <div className="half">
            <label htmlFor="entryAttrHref">Entry attribution href: </label>
            <input
              id="entryAttrHref"
              onChange={({ target: { value } }) =>
                setEntryAttribution({ ...entryAttribution, href: value })
              }
              value={entryAttribution.href}
            ></input>
          </div>
        </div>
        <div ref={formEndRef} className="form-end-marker"></div>
        <div 
          ref={saveContainerRef}
          className={`save-button-container ${isFloating ? 'floating' : ''}`}
        >
          {saveMessage && (
            <div className={`save-message ${saveMessage.includes('Error') ? 'error' : 'success'}`}>
              {saveMessage}
            </div>
          )}
          
          <div className="button-group">
            <button
              type="button"
              className="save-button"
              onClick={save}
              disabled={
                isUploading ||
                isUploadComplete ||
                !isValidEntry(entry, imageAttribution, entryAttribution)
              }
            >
              <i className="fas fa-save"></i>
              {isUploading ? "Saving..." : "Save"}
            </button>
            
            <button type="button" className="clear-button" onClick={clear}>
              <i className="fas fa-trash"></i> Clear
            </button>
            
            {entry.id && (
              <button type="button" className="delete-button" onClick={deleteEntryConfirm}>
                <i className="fas fa-trash-alt"></i> Delete
              </button>
            )}
            
            <button type="button" className="signout-button" onClick={signOut}>
              <i className="fas fa-sign-out-alt"></i> Sign Out
            </button>
          </div>
        </div>
        
        {/* Confirmation Dialog */}
        {showConfirmation && (
          <div className="confirmation-dialog">
            <div className="confirmation-content">
              <h3>Save MCP Timeline Entry</h3>
              <p>Are you sure you want to save this entry to the MCP timeline? This will make it visible to all users.</p>
              <div className="confirmation-buttons">
                <button type="button" onClick={confirmSave}>Yes, Save</button>
                <button type="button" onClick={() => setShowConfirmation(false)}>Cancel</button>
              </div>
            </div>
          </div>
        )}
        
        {/* Delete Confirmation Dialog */}
        {showDeleteConfirmation && (
          <div className="confirmation-dialog">
            <div className="confirmation-content">
              <h3>Delete MCP Timeline Entry</h3>
              <p>Are you sure you want to delete this entry from the MCP timeline? This action is permanent.</p>
              <div className="confirmation-buttons">
                <button type="button" onClick={confirmDelete}>Yes, Delete</button>
                <button type="button" onClick={() => setShowDeleteConfirmation(false)}>Cancel</button>
              </div>
            </div>
          </div>
        )}
      </div>
      <div className="entry">
        <Entry entry={entry} allCollections={{}} />
      </div>
    </div>
  );
}