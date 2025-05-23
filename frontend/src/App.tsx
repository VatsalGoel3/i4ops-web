import { Routes, Route } from "react-router-dom";
import { SignIn, SignUp } from "@clerk/clerk-react";
import Users from "./pages/Users";
import Projects from "./pages/Projects";
import DashboardLayout from "./layouts/Dashboard";
import { ProtectedRoute } from "./clerk";

export default function App() {
  return (
    <Routes>
      <Route path="/sign-in/*" element={<SignIn />} />
      <Route path="/sign-up/*" element={<SignUp />} />

      <Route
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Users />} />
        <Route path="users" element={<Users />} />
        <Route path="projects" element={<Projects />} />
      </Route>
    </Routes>
  );
}