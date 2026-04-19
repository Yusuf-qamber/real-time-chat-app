import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import {BrowserRouter} from "react-router-dom"
import { useThemeStore } from "./store/useThemeStore.js";

const Root = () => {
  const { theme } = useThemeStore();  // ✅ hook inside a component
  return (
    <div data-theme={theme}>
      <App />
    </div>
  );
};

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <Root />
    </BrowserRouter>
  </StrictMode>
);
