import { useState, useEffect } from "react";

export function useNavigation() {
  const [page, setPage] = useState(() => {
    const params = new URLSearchParams(window.location.search);
    return params.get("page") || "home";
  });

  const [selectedPostId, setSelectedPostId] = useState<string | null>(() => {
    const params = new URLSearchParams(window.location.search);
    return params.get("post");
  });

  // Update URL when page or post changes
  useEffect(() => {
    const params = new URLSearchParams();
    if (page !== "home") {
      params.set("page", page);
    }
    if (selectedPostId) {
      params.set("post", selectedPostId);
    }

    const newUrl = params.toString()
      ? `${window.location.pathname}?${params.toString()}`
      : window.location.pathname;

    window.history.pushState({}, "", newUrl);
  }, [page, selectedPostId]);

  // Handle browser back/forward buttons
  useEffect(() => {
    const handlePopState = () => {
      const params = new URLSearchParams(window.location.search);
      setPage(params.get("page") || "home");
      setSelectedPostId(params.get("post"));
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  return { page, setPage, selectedPostId, setSelectedPostId };
}
