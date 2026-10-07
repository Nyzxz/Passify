import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import CreateSet from "./pages/CreateSet.jsx";
import SetOverview from "./pages/SetOverview.jsx";
import FlashcardsPage from "./pages/FlashcardsPage.jsx";
import QuizPage from "./pages/QuizPage.jsx";
import GuidePage from "./pages/GuidePage.jsx";

export default function App() {
  return (
    <>
      <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:m-2 focus:rounded focus:bg-white focus:p-2">Skip to content</a>
      <Navbar />
      <main id="main" className="mx-auto max-w-5xl px-4 py-8">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/create" element={<CreateSet />} />
          <Route path="/sets/:id" element={<SetOverview />} />
          <Route path="/sets/:id/flashcards" element={<FlashcardsPage />} />
          <Route path="/sets/:id/quiz" element={<QuizPage />} />
          <Route path="/sets/:id/guide" element={<GuidePage />} />
          <Route path="*" element={<p>Page not found.</p>} />
        </Routes>
      </main>
    </>
  );
}
