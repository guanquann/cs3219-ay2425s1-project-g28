import { BrowserRouter, Routes, Route } from "react-router-dom";
import NewQuestion from "./pages/NewQuestion";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/question" element={<>question page list</>} />
        <Route path="/question/new" element={<NewQuestion />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
