import { useEffect } from "react";
import { useFileStore } from "./store/useFileStore";
import { wsService } from "./services/fileSystem";
import { Header } from "./components/Header";
import { FileExplorer } from "./components/FileExplorer";
import { Preview } from "./components/Preview";
import { PromptPanel } from "./components/PromptPanel";

function App() {
  const { setFiles } = useFileStore();

  useEffect(() => {
    // Subscribe to file changes
    const unsubscribe = wsService.onFileChange((event, path) => {
      if (event === "change" || event === "add" || event === "unlink") {
        // Refresh file list
        fetch("/api/files")
          .then((res) => res.json())
          .then(setFiles)
          .catch(console.error);
      }
    });

    // Initial file load
    fetch("/api/files")
      .then((res) => res.json())
      .then(setFiles)
      .catch(console.error);

    return () => unsubscribe();
  }, [setFiles]);

  return (
    <div className="h-screen overflow-hidden">
      <Header />
      <main className="h-[calc(100vh-56px)] mt-14 relative">
        <FileExplorer />
      </main>
      <Preview />
      <PromptPanel />
    </div>
  );
}

export default App;
