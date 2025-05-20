import { BrowserRouter, Routes, Route } from "react-router-dom";
import Users from "./pages/Users";
import Projects from "./pages/Projects";
import DashboardLayout from "./layouts/Dashboard";

export default function App() {
    return (
      <BrowserRouter>
        <Routes>
          <Route element={<DashboardLayout />}>
            <Route path="/" element={<Users />} />
            <Route path="/users" element={<Users />} />
            <Route path="/projects" element={<Projects />} />
          </Route>
        </Routes>
      </BrowserRouter>
    );
  }