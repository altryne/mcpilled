import { useState } from "react";
import Link from "next/link";
import { signIn } from "../../js/admin-supabase";

export default function Admin() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const login = () => {
    signIn(password).catch((error) => {
      if (error.message === "INVALID_PASSWORD") {
        setError("Incorrect password.");
      } else {
        setError("Unknown error.");
      }
    });
  };

  return <>
    <span>
      This page is for Alex use only. If you've found yourself here and
      you're not Alex, you can go{" "}
      <Link href="/contribute">
        here
      </Link>{" "}
      to learn how to suggest a new entry.
    </span>
    <div className="login-form">
      <label htmlFor="password" type="password">
        Password:
      </label>
      <input
        type="password"
        onChange={({ target: { value } }) => setPassword(value)}
      ></input>
      <button onClick={login}>Log in</button>
      {error && <span>{error}</span>}
    </div>
  </>;
}
