import { trimEmptyFields } from "./entry";
import {
  addImageAttribution,
  addEntryAttribution,
  uploadEntry,
  deleteEntry,
} from "../db/admin-supabase";
import { signIn as supabaseSignIn, signOut as supabaseSignOut, onAuthStateChange } from "./supabase-auth";

export const signIn = (password) => supabaseSignIn(password);

export const signOut = () => supabaseSignOut();

export const onAuthStateChanged = (callback) => {
  return onAuthStateChange(callback);
};

export const upload = async (
  rawEntry,
  rawImageAttribution,
  rawEntryAttribution
) => {
  const trimmed = trimEmptyFields(
    rawEntry,
    rawImageAttribution,
    rawEntryAttribution
  );
  const promises = [];
  if ("entry" in trimmed) {
    promises.push(uploadEntry(trimmed.entry));
  }
  if ("imageAttribution" in trimmed) {
    promises.push(addImageAttribution(trimmed.imageAttribution));
  }
  if ("entryAttribution" in trimmed) {
    promises.push(addEntryAttribution(trimmed.entryAttribution));
  }
  await Promise.all(promises);
  return promises[0];
};

export { deleteEntry };
