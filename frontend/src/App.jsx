import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import UploadPage from "./pages/UploadPage";
import SharePage from "./pages/SharePage";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<UploadPage />} />
        <Route path="/share" element={<SharePage />} />
        <Route path="*" element={<div className='p-10 text-center'>404 - Not Found</div>} />
      </Routes>
    </Router>
  );
}
