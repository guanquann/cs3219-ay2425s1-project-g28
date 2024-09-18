import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import NewQuestion from "./pages/NewQuestion";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/question" element={<>question page list</>} />
        <Route path="/question/new" element={<NewQuestion />} />
      </Routes>
    </Router>
  );
}

export default App;
