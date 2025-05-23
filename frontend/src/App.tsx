import { Routes, Route, Navigate } from "react-router-dom";
import { SignIn, SignUp } from "@clerk/clerk-react";
import Users from "./pages/Users";
import Projects from "./pages/Projects";
import DashboardLayout from "./layouts/Dashboard";
import { ProtectedRoute } from "./clerk";

// Simple 404 Not Found Component
const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen text-gray-700 dark:text-gray-300">
      <h1 className="text-4xl font-bold mb-4">404</h1>
      <p className="text-xl mb-8">Page Not Found</p>
      <p>The page you are looking for does not exist.</p>
      <Navigate to="/" replace /> {/* Optional: automatically redirect to home */}
    </div>
  );
};

export default function App() {
  return (
    <Routes>
      {/*
        ProtectedRoute Loading/Unauthorized Note: Ensure the ProtectedRoute
        component provides clear feedback (e.g., a loading spinner) while
        checking authentication and a smooth redirection/message for
        unauthorized access.
      */}
      <Route path="/sign-in/*" element={<SignIn />} />
      <Route path="/sign-up/*" element={<SignUp />} />

      <Route
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        {/* Set the index route to redirect to users */}
        <Route index element={<Navigate to="/users" replace />} />
        <Route path="users" element={<Users />} />
        <Route path="projects" element={<Projects />} />
      </Route>

      {/* Add a catch-all route for 404 */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}