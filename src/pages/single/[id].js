import PropTypes from "prop-types";
import useGA from "../../hooks/useGA";
import useIsBrowserRendering from "../../hooks/useIsBrowserRendering";
import useWindowWidth from "../../hooks/useWindowWidth";

import { getGlossaryEntries } from "../../db/glossary";
import { getEntry } from "../../db/singleEntry-supabase";

import BackBar from "../../components/BackBar";
import CustomEntryHead from "../../components/CustomEntryHead";
import Error from "../../components/Error";
import Footer from "../../components/Footer";
import Entry from "../../components/timeline/Entry";
import Header from "../../components/timeline/Header";
import { getMetadata } from "../../db/metadata";
import { EntryPropType } from "../../js/entry";
import { onAuthStateChange } from "../../js/supabase-auth";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { supabase } from "../../db/supabase"; // Correct import path

export async function getServerSideProps(context) {
  console.log(`[DEBUG] getServerSideProps starting for id: ${context.params.id}`);
  
  const props = { entry: null };
  try {
    console.log(`[DEBUG] Attempting to get entry for id: ${context.params.id}`);
    props.entry = await getEntry(context.params.id);
    console.log(`[DEBUG] Successfully got entry: ${JSON.stringify(props.entry)}`);
  } catch (err) {
    console.error(`[ERROR] Error getting entry: ${err.message}`, err);
    if (err.message === "not-found" || err.message === "invalid-argument") {
      props.error = 404;
    } else {
      props.error = 500;
    }
  }

  try {
    console.log(`[DEBUG] Getting glossary entries`);
    const glossary = await getGlossaryEntries();
    console.log(`[DEBUG] Successfully got glossary entries`);
    props.glossary = glossary;
  } catch (err) {
    console.error(`[ERROR] Error getting glossary: ${err.message}`, err);
    props.glossary = { entries: {} };
  }

  try {
    console.log(`[DEBUG] Getting metadata`);
    const metadata = await getMetadata();
    console.log(`[DEBUG] Successfully got metadata`);
    props.allCollections = metadata.collections || {};
  } catch (err) {
    console.error(`[ERROR] Error getting metadata: ${err.message}`, err);
    props.allCollections = {};
  }

  console.log(`[DEBUG] getServerSideProps completed for id: ${context.params.id}`);
  return { props };
}

export default function SingleEntry({
  entry,
  allCollections,
  glossary,
  error = null,
}) {
  useGA();

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const windowWidth = useWindowWidth();
  const isBrowserRendering = useIsBrowserRendering();
  const router = useRouter();

  useEffect(() => {
    // Simple check for authentication without subscription
    const checkAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        setIsLoggedIn(!!session?.user);
      } catch (error) {
        console.error('Auth check error:', error);
        setIsLoggedIn(false);
      }
    };
    
    checkAuth();
  }, []);

  const renderEntry = () => {
    if (!entry) return null;
    
    console.log("Entry data in single page:", entry);
    console.log("Entry ID:", entry.id);
    console.log("Entry _key:", entry._key);
    console.log("Entry readableId:", entry.readableId);
    return (
      <article className="single-timeline-wrapper">
        <div style={{ marginBottom: 10 }}>
          {isLoggedIn && entry && (
            <button
              style={{
                backgroundColor: "#5948a4",
                color: "white",
                padding: "5px 15px",
                marginBottom: "10px",
                cursor: "pointer",
                border: "none",
              }}
              onClick={() => {
                console.log("Entry data:", entry);
                console.log("Using ID for edit:", entry._key);
                router.push(`/admin?id=${entry._key}`);
              }}
            >
              Edit Entry
            </button>
          )}
        </div>
        <Entry
          className="single even"
          key={entry.id}
          entry={entry}
          windowWidth={windowWidth}
          allCollections={allCollections}
          glossary={glossary}
        />
      </article>
    );
  };

  const renderBody = () => {
    if (!entry) {
      let message;
      if (error === 404) {
        message = "No entry with this ID.";
      } else {
        message = "Something went wrong.";
      }
      return <Error customMessage={message} />;
    }
    return renderEntry();
  };

  return (
    <>
      <CustomEntryHead entry={entry} />
      <Header
        windowWidth={windowWidth}
        isBrowserRendering={isBrowserRendering}
      />
      <BackBar customText="Go to full timeline" />
      <div className="timeline-page content-wrapper">{renderBody()}</div>
      <Footer />
    </>
  );
}

SingleEntry.propTypes = {
  entry: EntryPropType,
  error: PropTypes.oneOf([404, 500]),
  allCollections: PropTypes.object.isRequired,
  glossary: PropTypes.any,
};