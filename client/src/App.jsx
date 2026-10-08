import { useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useStudyStore } from "./store/useStudyStore.js";
import LandingPage from "./pages/LandingPage.jsx";
import PassifyDashboardLayout from "./components/PassifyDashboardLayout.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import FolderPage from "./pages/FolderPage.jsx";
import CreateSet from "./pages/CreateSet.jsx";
import SetOverview from "./pages/SetOverview.jsx";
import FlashcardsPage from "./pages/FlashcardsPage.jsx";
import QuizPage from "./pages/QuizPage.jsx";
import GuidePage from "./pages/GuidePage.jsx";

const RequireAuth = ({ children }) => {
  const authReady = useStudyStore((s) => s.authReady);
  const user = useStudyStore((s) => s.user);
  if (!authReady) return <p role="status" className="mx-auto max-w-5xl px-4 py-8 text-muted">Restoring your session...</p>;
  return user ? children : <Navigate to="/" replace />;
};

export default function App() {
  const theme = useStudyStore((s) => s.theme);
  const restoreSession = useStudyStore((s) => s.restoreSession);
  useEffect(() => { document.documentElement.dataset.theme = theme; }, [theme]);
  useEffect(() => { restoreSession(); }, [restoreSession]);

  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/app" element={<RequireAuth><PassifyDashboardLayout /></RequireAuth>}>
        <Route index element={<Dashboard />} />
        <Route path="folders" element={<FolderPage />} />
        <Route path="folders/:folderId" element={<FolderPage />} />
        <Route path="create" element={<CreateSet />} />
        <Route path="sets/:id" element={<SetOverview />} />
        <Route path="sets/:id/flashcards" element={<FlashcardsPage />} />
        <Route path="sets/:id/quiz" element={<QuizPage />} />
        <Route path="sets/:id/guide" element={<GuidePage />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
