import React from "react";
import ReactDOM from "react-dom/client";

// Import Bootstrap CSS and JS if your modal (or other parts) rely on it:
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

// Import your custom styles
import "./assets/css/styles.css";

import App from "./App";
import { UserProvider } from "./context/UserContext";

// Helper function to extract token from URL query parameters
function extractTokenFromUrl(): string | null {
  const params = new URLSearchParams(window.location.search);
  const token = params.get('token');
  if (token) {
    // Remove token from URL after extraction (clean up)
    window.history.replaceState({}, document.title, window.location.pathname);
  }
  return token;
}

const tokenFromUrl = extractTokenFromUrl();
if (tokenFromUrl) {
  localStorage.setItem('token', tokenFromUrl);
}

const rootElement = document.getElementById("root");
if (!rootElement) {
  throw new Error("No 'root' element found in index.html");
}

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <UserProvider>
      <App />
    </UserProvider>
  </React.StrictMode>
);