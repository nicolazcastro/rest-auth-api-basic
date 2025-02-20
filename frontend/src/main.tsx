import React from "react";
import ReactDOM from "react-dom/client";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import "./assets/css/styles.css";
import App from "./App";
import { UserProvider } from "./context/UserContext";

// Helper function to extract token from URL query parameters
function extractTokenFromUrl(): string | null {
  const params = new URLSearchParams(window.location.search);
  // Only extract token if not on /confirm-email or /reset-password pages.
  const pathname = window.location.pathname;
  if (pathname !== '/confirm-email' && pathname !== '/reset-password') {
    const token = params.get('token');
    if (token) {
      window.history.replaceState({}, document.title, window.location.pathname);
    }
    return token;
  }
  return null;
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