import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import { ThemeProviderWrapper } from "../src/theme/ThemeContext.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProviderWrapper>
      <App />
      
    </ThemeProviderWrapper>
  </StrictMode>
);
