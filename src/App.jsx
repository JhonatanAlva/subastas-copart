import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { Navbar } from "./components/Navbar";
import { Home } from "./pages/Home";
import { Login } from "./pages/Login";
import { Register } from "./pages/Register";
import { CreateVehicle } from "./pages/CreateVehicle";
import { MyVehicles } from "./pages/MyVehicles";
import { VehicleDetail } from "./pages/VehicleDetail";
import { ProtectedRoute } from "./components/ProtectedRoute.jsx";

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-slate-50 text-slate-800">
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/registro" element={<Register />} />
            <Route path="/vehiculo/:id" element={<VehicleDetail />} />

            {/* Rutas Protegidas por Middleware */}
            <Route
              path="/publicar"
              element={
                <ProtectedRoute>
                  <CreateVehicle />
                </ProtectedRoute>
              }
            />
            <Route
              path="/mis-publicaciones"
              element={
                <ProtectedRoute>
                  <MyVehicles />
                </ProtectedRoute>
              }
            />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}
