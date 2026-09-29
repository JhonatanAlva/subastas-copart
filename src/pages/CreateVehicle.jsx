import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { db } from "../firebase/config";
import { collection, addDoc } from "firebase/firestore";
import { useAuth } from "../context/AuthContext";
import { uploadToCloudinary } from "../utils/uploadImage";
import { UploadCloud, CheckCircle, AlertCircle } from "lucide-react";

export const CreateVehicle = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [selectedFiles, setSelectedFiles] = useState([]);

  const [formData, setFormData] = useState({
    anio: 2022,
    tipoArticulo: "Sedán",
    marca: "",
    modelo: "",
    motor: "",
    transmision: "Automática",
    combustible: "Gasolina",
    trenManejo: "FWD",
    cilindros: 4,
    estadoDano: "verde",
    precioBase: 20000,
    fechaInicio: "",
    fechaCierre: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length < 5) {
      setError("Debes seleccionar un mínimo de 5 fotografías.");
    } else {
      setError("");
    }
    setSelectedFiles(files);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!currentUser) return setError("Debes iniciar sesión para publicar.");
    if (selectedFiles.length < 5)
      return setError("Se requieren mínimo 5 fotografías.");

    try {
      setLoading(true);
      setError("");

      const photoUrls = [];
      for (const file of selectedFiles) {
        const url = await uploadToCloudinary(file);
        photoUrls.push(url);
      }

      await addDoc(collection(db, "vehicles"), {
        publisherUid: currentUser.uid,
        publisherEmail: currentUser.email,
        fichaTecnica: {
          anio: Number(formData.anio),
          tipoArticulo: formData.tipoArticulo,
          marca: formData.marca,
          modelo: formData.modelo,
          motor: formData.motor,
          transmision: formData.transmision,
          combustible: formData.combustible,
          trenManejo: formData.trenManejo,
          cilindros: Number(formData.cilindros),
        },
        estadoDano: formData.estadoDano,
        fotos: photoUrls,
        parametrosSubasta: {
          precioBase: Number(formData.precioBase),
          fechaInicio: formData.fechaInicio,
          fechaCierre: formData.fechaCierre,
        },
        ofertaActual: Number(formData.precioBase),
        ultimoPostorUid: null,
        totalPujas: 0,
        estadoSubasta: "activa",
        createdAt: new Date().toISOString(),
      });

      setSuccess("¡Vehículo publicado con éxito!");
      setTimeout(() => {
        navigate("/mis-publicaciones");
      }, 1500);
    } catch (err) {
      setError("Error al crear la publicación: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto my-10 p-8 bg-white rounded-2xl shadow-lg border border-gray-100">
      <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-2">
        <span>🚘 Publicar Vehículo para Subasta</span>
      </h2>

      {error && (
        <div className="bg-red-100 text-red-700 p-3 rounded-lg mb-6 text-sm flex items-center gap-2 font-medium">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="bg-emerald-100 border border-emerald-300 text-emerald-800 p-3 rounded-lg mb-6 text-sm flex items-center gap-2 font-medium">
          <CheckCircle className="w-5 h-5 flex-shrink-0 text-emerald-600" />
          <span>{success}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Ficha Técnica */}
        <div className="border-b pb-4">
          <h3 className="font-semibold text-slate-700 mb-4">
            1. Ficha Técnica
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-600 uppercase">
                Marca
              </label>
              <input
                name="marca"
                type="text"
                required
                placeholder="Ej. Toyota"
                onChange={handleChange}
                className="w-full mt-1 p-2 border rounded-lg text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 uppercase">
                Modelo
              </label>
              <input
                name="modelo"
                type="text"
                required
                placeholder="Ej. Corolla"
                onChange={handleChange}
                className="w-full mt-1 p-2 border rounded-lg text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 uppercase">
                Año
              </label>
              <input
                name="anio"
                type="number"
                required
                value={formData.anio}
                onChange={handleChange}
                className="w-full mt-1 p-2 border rounded-lg text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 uppercase">
                Tipo de Artículo
              </label>
              <select
                name="tipoArticulo"
                onChange={handleChange}
                className="w-full mt-1 p-2 border rounded-lg text-sm bg-white"
              >
                <option value="Sedán">Sedán</option>
                <option value="SUV">SUV</option>
                <option value="Pick-up">Pick-up</option>
                <option value="Hatchback">Hatchback</option>
                <option value="Coupe">Coupe</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 uppercase">
                Motor
              </label>
              <input
                name="motor"
                type="text"
                required
                placeholder="Ej. 2.0L 4Cyl"
                onChange={handleChange}
                className="w-full mt-1 p-2 border rounded-lg text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 uppercase">
                Transmisión
              </label>
              <select
                name="transmision"
                onChange={handleChange}
                className="w-full mt-1 p-2 border rounded-lg text-sm bg-white"
              >
                <option value="Automática">Automática</option>
                <option value="Mecánica">Mecánica</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 uppercase">
                Combustible
              </label>
              <select
                name="combustible"
                onChange={handleChange}
                className="w-full mt-1 p-2 border rounded-lg text-sm bg-white"
              >
                <option value="Gasolina">Gasolina</option>
                <option value="Diésel">Diésel</option>
                <option value="Híbrido">Híbrido</option>
                <option value="Eléctrico">Eléctrico</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 uppercase">
                Tren de Manejo
              </label>
              <select
                name="trenManejo"
                onChange={handleChange}
                className="w-full mt-1 p-2 border rounded-lg text-sm bg-white"
              >
                <option value="FWD">FWD (Delantera)</option>
                <option value="RWD">RWD (Trasera)</option>
                <option value="AWD">AWD (Integral)</option>
                <option value="4WD">4WD (4x4)</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 uppercase">
                Cilindros
              </label>
              <input
                name="cilindros"
                type="number"
                required
                value={formData.cilindros}
                onChange={handleChange}
                className="w-full mt-1 p-2 border rounded-lg text-sm"
              />
            </div>
          </div>
        </div>

        {/* Clasificación por Estado de Daño */}
        <div className="border-b pb-4">
          <h3 className="font-semibold text-slate-700 mb-2">
            2. Estado de Daño del Vehículo
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
            <label
              className={`border-2 p-3 rounded-xl flex items-center gap-2 cursor-pointer transition ${formData.estadoDano === "verde" ? "border-green-500 bg-green-50" : "border-gray-200"}`}
            >
              <input
                type="radio"
                name="estadoDano"
                value="verde"
                checked={formData.estadoDano === "verde"}
                onChange={handleChange}
              />
              <span className="text-sm font-semibold text-green-700">
                🟢 Verde (Menor)
              </span>
            </label>
            <label
              className={`border-2 p-3 rounded-xl flex items-center gap-2 cursor-pointer transition ${formData.estadoDano === "amarillo" ? "border-yellow-500 bg-yellow-50" : "border-gray-200"}`}
            >
              <input
                type="radio"
                name="estadoDano"
                value="amarillo"
                checked={formData.estadoDano === "amarillo"}
                onChange={handleChange}
              />
              <span className="text-sm font-semibold text-yellow-700">
                🟡 Amarillo (Medio)
              </span>
            </label>
            <label
              className={`border-2 p-3 rounded-xl flex items-center gap-2 cursor-pointer transition ${formData.estadoDano === "rojo" ? "border-red-500 bg-red-50" : "border-gray-200"}`}
            >
              <input
                type="radio"
                name="estadoDano"
                value="rojo"
                checked={formData.estadoDano === "rojo"}
                onChange={handleChange}
              />
              <span className="text-sm font-semibold text-red-700">
                🔴 Rojo (Severo)
              </span>
            </label>
          </div>
        </div>

        {/* Galería Fotográfica */}
        <div className="border-b pb-4">
          <h3 className="font-semibold text-slate-700 mb-2">
            3. Fotos del Vehículo (Mínimo 5)
          </h3>
          <div className="border-2 border-dashed border-gray-300 p-6 rounded-xl text-center bg-slate-50">
            <UploadCloud className="w-10 h-10 text-gray-400 mx-auto mb-2" />
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
              id="file-upload"
            />
            <label
              htmlFor="file-upload"
              className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium cursor-pointer hover:bg-blue-700"
            >
              Seleccionar Imágenes
            </label>
            {selectedFiles.length > 0 && (
              <p className="mt-3 text-sm font-medium text-emerald-600 flex items-center justify-center gap-1">
                <CheckCircle className="w-4 h-4" /> {selectedFiles.length}{" "}
                imágenes seleccionadas
              </p>
            )}
          </div>
        </div>

        {/* Parámetros de Subasta */}
        <div className="border-b pb-4">
          <h3 className="font-semibold text-slate-700 mb-4">
            4. Parámetros de Subasta
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-600 uppercase">
                Monto Base (Q.)
              </label>
              <input
                name="precioBase"
                type="number"
                required
                value={formData.precioBase}
                onChange={handleChange}
                className="w-full mt-1 p-2 border rounded-lg text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 uppercase">
                Fecha y Hora de Inicio
              </label>
              <input
                name="fechaInicio"
                type="datetime-local"
                required
                onChange={handleChange}
                className="w-full mt-1 p-2 border rounded-lg text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 uppercase">
                Fecha y Hora de Cierre
              </label>
              <input
                name="fechaCierre"
                type="datetime-local"
                required
                onChange={handleChange}
                className="w-full mt-1 p-2 border rounded-lg text-sm"
              />
            </div>
          </div>
        </div>

        <button
          disabled={loading}
          type="submit"
          className="w-full bg-emerald-600 text-white font-bold py-3 rounded-xl hover:bg-emerald-700 transition disabled:opacity-50"
        >
          {loading ? "Subiendo imágenes y publicando..." : "Publicar Vehículo"}
        </button>
      </form>
    </div>
  );
};
