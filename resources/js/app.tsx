import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router";
import { ThemeProvider } from "./lib/theme-provider";
import { router } from "./routes";
import "../css/styles/theme.css";
import "../css/app.css";
import "../css/styles/fonts.css";
import "../css/styles/index.css";
import "../css/styles/tailwind.css";


ReactDOM.createRoot(document.getElementById("root")!).render(
  <ThemeProvider>
    <RouterProvider router={router} />
  </ThemeProvider>
);
