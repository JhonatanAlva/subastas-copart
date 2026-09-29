import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Car, LogIn, UserPlus, LogOut, PlusCircle, ListFilter } from "lucide-react";

export const Navbar = () => {
    const { currentUser, userData, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await logout();
            navigate("/");
        } catch (error) {
            console.error("Error al cerrar sesión", error);
        }
    };

    return (
        <nav className="bg-slate-900 text-white shadow-md sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
                {/* Logo estilo Copart */}
                <Link to="/" className="flex items-center space-x-2 text-xl font-bold text-blue-400">
                    <Car className="w-7 h-7 text-yellow-400" />
                    <span>AutoSubastas <span className="text-yellow-400">GT</span></span>
                </Link>

                {/* Links de Navegación */}
                <div className="flex items-center space-x-4">
                    <Link to="/" className="flex items-center space-x-1 hover:text-blue-300 transition text-sm">
                        <ListFilter className="w-4 h-4" />
                        <span>Inventario</span>
                    </Link>

                    {currentUser ? (
                        <>
                            <Link
                                to="/publicar"
                                className="bg-blue-600 hover:bg-blue-700 px-3 py-1.5 rounded-lg flex items-center space-x-1 font-medium text-sm transition"
                            >
                                <PlusCircle className="w-4 h-4" />
                                <span>Publicar Vehículo</span>
                            </Link>

                            <Link to="/mis-publicaciones" className="hover:text-blue-300 transition text-sm">
                                Mis Publicaciones
                            </Link>

                            <span className="text-gray-400 text-sm hidden md:inline">
                                Hola, <strong className="text-white">{userData?.nombre || currentUser.email}</strong>
                            </span>

                            <button
                                onClick={handleLogout}
                                className="bg-red-600/80 hover:bg-red-600 px-3 py-1.5 rounded-lg flex items-center space-x-1 text-sm transition"
                            >
                                <LogOut className="w-4 h-4" />
                                <span>Salir</span>
                            </button>
                        </>
                    ) : (
                        <>
                            <Link to="/login" className="flex items-center space-x-1 hover:text-blue-300 text-sm transition">
                                <LogIn className="w-4 h-4" />
                                <span>Ingresar</span>
                            </Link>

                            <Link
                                to="/registro"
                                className="bg-yellow-500 hover:bg-yellow-600 text-slate-900 font-semibold px-3 py-1.5 rounded-lg flex items-center space-x-1 text-sm transition"
                            >
                                <UserPlus className="w-4 h-4" />
                                <span>Registrarse</span>
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
};