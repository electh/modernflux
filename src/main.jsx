import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";

import { NextUIProvider } from "@nextui-org/react";

createRoot(document.getElementById("root")).render(
  <NextUIProvider>
    <App />
  </NextUIProvider>,
);
