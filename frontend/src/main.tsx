import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { WithClerk } from "./clerk";
import { Toaster } from "./toast";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <WithClerk>
        <App />
        <Toaster />
      </WithClerk>
    </BrowserRouter>
  </StrictMode>
);