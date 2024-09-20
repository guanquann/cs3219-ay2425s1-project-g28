import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import NewQuestion from "./pages/NewQuestion";
import QuestionDetail from "./pages/QuestionDetail";
import PageNotFound from "./pages/Error";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route path="/questions" element={<>question page list</>} />
          <Route path="/questions/new" element={<NewQuestion />} />
          <Route path="/questions/:questionId" element={<QuestionDetail />} />
          <Route path="*" element={<PageNotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
