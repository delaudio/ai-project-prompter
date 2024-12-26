import React from 'react';
import { FileExplorer } from './components/FileExplorer';
import { Preview } from './components/Preview';
import { Header } from './components/Header';
import { PromptPanel } from './components/PromptPanel';

function App() {
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