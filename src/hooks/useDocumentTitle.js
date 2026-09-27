import { useEffect } from "react";
import { formatTitle, DEFAULT_DOCUMENT_TITLE } from "@/utils/routeTitles";

/**
 * Custom hook to dynamically set the browser document title.
 *
 * @param {string} title - The title to display (e.g. "About Us" or "Training Camp 84")
 * @param {boolean} [retainOnUnmount=false] - Whether to keep the title after unmounting
 *
 * @example
 * useDocumentTitle("About Us"); // Document title becomes: "About Us | WhistleWorks"
 * useDocumentTitle(camp.camp_name); // Sets dynamic camp name
 */
export default function useDocumentTitle(title, retainOnUnmount = false) {
  useEffect(() => {
    if (!title) return;

    const previousTitle = document.title;
    document.title = formatTitle(title);

    return () => {
      if (!retainOnUnmount) {
        document.title = previousTitle || DEFAULT_DOCUMENT_TITLE;
      }
    };
  }, [title, retainOnUnmount]);
}
