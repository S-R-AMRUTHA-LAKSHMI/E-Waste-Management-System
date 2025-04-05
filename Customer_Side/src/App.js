import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./pages/Layout";
//import Bulk from "./pages/Bulk";
import BulkOrderForm from "./pages/Bulk";
import Home from "./pages/Home";
import Blogs from "./pages/Blogs";
import Contact from "./pages/Contact";
import Services from "./pages/Services";
import Items from "./pages/Items";
import NoPage from "./pages/NoPage";
import "./App.css"; // Global styling
import JoinForm from "./pages/JoinForm";
export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="blogs" element={<Blogs />} />
          <Route path="contact" element={<Contact />} />
          <Route path="add" element={<Services />} />
          <Route path="items" element={<Items />} />
          <Route path="join" element={<JoinForm />} />
          <Route path="bulk" element={<BulkOrderForm/>}/>
          <Route path="*" element={<NoPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
