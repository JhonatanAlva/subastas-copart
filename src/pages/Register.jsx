import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";

export const Register = () => {
    const { register } = useAuth();
    const navigate = useNavigate();
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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

        if (formData.password.length < 6) {
            return setError("La contraseña debe tener al menos 6 caracteres.");
        }

        if (formData.password !== formData.confirmPassword) {
            return setError("Las contraseñas no coinciden. Verifícalas e intenta de nuevo.");
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
            if (err.code === "auth/email-already-in-use") {
                setError("Este correo electrónico ya está registrado. Intenta iniciar sesión.");
            } else if (err.code === "auth/invalid-email") {
                setError("El formato del correo electrónico no es válido.");
            } else {
                setError("Error al registrar la cuenta: " + err.message);
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-md mx-auto my-10 p-6 bg-white rounded-xl shadow-md border border-gray-100">
            <h2 className="text-2xl font-bold text-center text-slate-800 mb-6">Crear Cuenta en AutoSubastas</h2>

            {error && (
                <div className="bg-red-100 border border-red-200 text-red-700 p-3 rounded-lg mb-4 text-sm font-medium">
                    {error}
                </div>
            )}

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
                    <label className="block text-xs font-semibold text-gray-600 uppercase">Contraseña (Mínimo 6 caracteres)</label>
                    <div className="relative mt-1">
                        <input
                            name="password"
                            type={showPassword ? "text" : "password"}
                            required
                            onChange={handleChange}
                            className="w-full p-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none pr-10"
                            placeholder="******"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-2.5 text-gray-500 hover:text-gray-700"
                        >
                            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                    </div>
                </div>

                <div>
                    <label className="block text-xs font-semibold text-gray-600 uppercase">Confirmar Contraseña</label>
                    <div className="relative mt-1">
                        <input
                            name="confirmPassword"
                            type={showConfirmPassword ? "text" : "password"}
                            required
                            onChange={handleChange}
                            className="w-full p-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none pr-10"
                            placeholder="******"
                        />
                        <button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="absolute right-3 top-2.5 text-gray-500 hover:text-gray-700"
                        >
                            {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                    </div>
                </div>

                <button disabled={loading} type="submit" className="w-full bg-blue-600 text-white font-semibold py-2.5 rounded-lg hover:bg-blue-700 transition duration-200 disabled:opacity-50">
                    {loading ? "Creando cuenta y guardando datos..." : "Registrarse"}
                </button>
            </form>

            <p className="text-center text-sm text-gray-500 mt-4">
                ¿Ya tienes cuenta? <Link to="/login" className="text-blue-600 font-semibold hover:underline">Ingresa aquí</Link>
            </p>
        </div>
    );
};