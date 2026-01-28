import { useEffect, StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { useNavigate } from "react-router-dom";
import { App } from "./App";

const container = document.getElementById('root') as HTMLElement;
const root = createRoot(container);

function IPCNavigator() {
  const navigate = useNavigate();
  useEffect(() => {
    if (window.electronAPI) {
      window.electronAPI.onNavigate((path:string) => {
        navigate(path);
      });
    }
  }, [navigate]);

  return <App />;
}

root.render(
  <StrictMode>
    <IPCNavigator />
  </StrictMode>,
);