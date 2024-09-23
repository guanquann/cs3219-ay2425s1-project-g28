import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import NewQuestion from "./pages/NewQuestion";
import QuestionDetail from "./pages/QuestionDetail";
import QuestionEdit from "./pages/QuestionEdit";
import PageNotFound from "./pages/PageNotFound";
import ProfilePage from "./pages/Profile";
import AuthProvider from "./contexts/AuthContext";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route path="questions">
              <Route index element={<>question page list</>} />
              <Route path="new" element={<NewQuestion />} />
              <Route path=":questionId" element={<QuestionDetail />} />
              <Route path=":questionId/edit" element={<QuestionEdit />} />
            </Route>
            <Route path="profile/:username" element={<ProfilePage />} />
            <Route path="*" element={<PageNotFound />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
