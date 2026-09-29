import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";

export const Register = () => {
    const { register } = useAuth();
    const navigate = useNavigate();
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        nombre: "",
        apellido: "",
        email: "",
        telefono: "",
        password: "",
        confirmPassword: ""
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (formData.password !== formData.confirmPassword) {
            return setError("Las contraseñas no coinciden");
        }

        try {
            setError("");
            setLoading(true);
            await register(
                formData.email,
                formData.password,
                formData.nombre,
                formData.apellido,
                formData.telefono
            );
            navigate("/");
        } catch (err) {
            setError("Error al registrar la cuenta: " + err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-md mx-auto my-10 p-6 bg-white rounded-xl shadow-md border border-gray-100">
            <h2 className="text-2xl font-bold text-center text-slate-800 mb-6">Crear Cuenta en AutoSubastas</h2>

            {error && <div className="bg-red-100 text-red-700 p-3 rounded-lg mb-4 text-sm">{error}</div>}

            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-xs font-semibold text-gray-600 uppercase">Nombre</label>
                        <input name="nombre" type="text" required onChange={handleChange} className="w-full mt-1 p-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
                    </div>
                    <div>
                        <label className="block text-xs font-semibold text-gray-600 uppercase">Apellido</label>
                        <input name="apellido" type="text" required onChange={handleChange} className="w-full mt-1 p-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
                    </div>
                </div>

                <div>
                    <label className="block text-xs font-semibold text-gray-600 uppercase">Correo Electrónico</label>
                    <input name="email" type="email" required onChange={handleChange} className="w-full mt-1 p-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
                </div>

                <div>
                    <label className="block text-xs font-semibold text-gray-600 uppercase">Teléfono</label>
                    <input name="telefono" type="tel" required onChange={handleChange} className="w-full mt-1 p-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
                </div>

                <div>
                    <label className="block text-xs font-semibold text-gray-600 uppercase">Contraseña</label>
                    <input name="password" type="password" required onChange={handleChange} className="w-full mt-1 p-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
                </div>

                <div>
                    <label className="block text-xs font-semibold text-gray-600 uppercase">Confirmar Contraseña</label>
                    <input name="confirmPassword" type="password" required onChange={handleChange} className="w-full mt-1 p-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
                </div>

                <button disabled={loading} type="submit" className="w-full bg-blue-600 text-white font-semibold py-2.5 rounded-lg hover:bg-blue-700 transition duration-200">
                    {loading ? "Registrando..." : "Registrarse"}
                </button>
            </form>

            <p className="text-center text-sm text-gray-500 mt-4">
                ¿Ya tienes cuenta? <Link to="/login" className="text-blue-600 font-semibold hover:underline">Ingresa aquí</Link>
            </p>
        </div>
    );
};