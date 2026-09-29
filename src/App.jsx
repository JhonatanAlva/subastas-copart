import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { Navbar } from "./components/Navbar";
import { Login } from "./pages/Login";
import { Register } from "./pages/Register";

// Página temporal de inicio para probar
const Home = () => (
    <div className="max-w-7xl mx-auto p-8 text-center">
        <h1 className="text-3xl font-bold text-slate-800">Bienvenido al Inventario de Subastas</h1>
        <p className="text-gray-600 mt-2">Usa el menú superior para probar el Registro e Inicio de Sesión.</p>
    </div>
);

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
                    </Routes>
                </div>
            </Router>
        </AuthProvider>
    );
}