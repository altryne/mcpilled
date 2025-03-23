import { useEffect, useState } from "react";

import { onAuthStateChanged } from "../js/admin-supabase";

import SimpleHeader from "../components/SimpleHeader";
import BackBar from "../components/BackBar";
import Footer from "../components/Footer";
import Loader from "../components/Loader";
import Login from "../components/admin/Login";
import Form from "../components/admin/Form";

export default function Admin() {
  const [isLoggedIn, setIsLoggedIn] = useState(null);
  
  useEffect(() => {
    const { data: { subscription } } = onAuthStateChanged((user) => {
      if (!user) {
        setIsLoggedIn(false);
      } else {
        setIsLoggedIn(true);
      }
    });

    // Cleanup subscription when component unmounts
    return () => {
      subscription.unsubscribe();
    };
  }, []); // Empty dependency array since we only want this to run once

  return (
    <>
      <SimpleHeader>Admin</SimpleHeader>
      <BackBar />
      <div className="content-wrapper admin">
        <article className="generic-page">
          {isLoggedIn === null && <Loader />}
          {isLoggedIn === false && <Login />}
          {isLoggedIn && <Form />}
        </article>
      </div>
      <Footer />
    </>
  );
}
