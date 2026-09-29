import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { db } from "../firebase/config";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { useAuth } from "../context/AuthContext";
import {
  CheckCircle,
  AlertCircle,
  Clock,
  Gavel,
  Edit,
  DollarSign,
} from "lucide-react";

export const VehicleDetail = () => {
  const { id } = useParams();
  const { currentUser } = useAuth();

  const [vehicle, setVehicle] = useState(null);
  const [selectedPhoto, setSelectedPhoto] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Módulo de pujas
  const [bidAmount, setBidAmount] = useState("");
  const [bidding, setBidding] = useState(false);

  // Módulo de edición del vendedor
  const [isEditing, setIsEditing] = useState(false);
  const [editPrice, setEditPrice] = useState(0);

  useEffect(() => {
    const fetchVehicle = async () => {
      try {
        const docRef = doc(db, "vehicles", id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setVehicle(data);
          setSelectedPhoto(data.fotos?.[0] || "");
          setEditPrice(data.parametrosSubasta?.precioBase || 0);
          setBidAmount((data.ofertaActual + 500).toString());
        } else {
          setError("El vehículo solicitado no existe.");
        }
      } catch (err) {
        setError("Error al cargar los detalles: " + err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchVehicle();
  }, [id]);

  const isOwner =
    currentUser && vehicle && currentUser.uid === vehicle.publisherUid;

  // Realizar Puja
  const handleBidSubmit = async (e) => {
    e.preventDefault();
    if (!currentUser)
      return setError("Debes iniciar sesión para realizar una oferta.");
    if (isOwner)
      return setError("No puedes realizar ofertas en tu propio vehículo.");

    const numericBid = Number(bidAmount);
    if (numericBid <= vehicle.ofertaActual) {
      return setError(
        `La oferta debe ser superior a Q. ${vehicle.ofertaActual.toLocaleString()}`,
      );
    }

    try {
      setBidding(true);
      setError("");

      const docRef = doc(db, "vehicles", id);
      const newTotalBids = (vehicle.totalPujas || 0) + 1;

      await updateDoc(docRef, {
        ofertaActual: numericBid,
        ultimoPostorUid: currentUser.uid,
        totalPujas: newTotalBids,
      });

      setVehicle((prev) => ({
        ...prev,
        ofertaActual: numericBid,
        totalPujas: newTotalBids,
        ultimoPostorUid: currentUser.uid,
      }));

      setSuccess("¡Oferta registrada con éxito!");
      setBidAmount((numericBid + 500).toString());
    } catch (err) {
      setError("Error al registrar la puja: " + err.message);
    } finally {
      setBidding(false);
    }
  };

  // Guardar Edición (Dueño)
  const handleSaveEdit = async () => {
    try {
      setLoading(true);
      const docRef = doc(db, "vehicles", id);
      await updateDoc(docRef, {
        "parametrosSubasta.precioBase": Number(editPrice),
        ofertaActual:
          vehicle.totalPujas === 0 ? Number(editPrice) : vehicle.ofertaActual,
      });

      setVehicle((prev) => ({
        ...prev,
        parametrosSubasta: {
          ...prev.parametrosSubasta,
          precioBase: Number(editPrice),
        },
        ofertaActual:
          prev.totalPujas === 0 ? Number(editPrice) : prev.ofertaActual,
      }));

      setIsEditing(false);
      setSuccess("Publicación actualizada correctamente.");
    } catch (err) {
      setError("Error al actualizar la publicación: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading)
    return (
      <div className="text-center my-12 text-slate-600">
        Cargando detalles del vehículo...
      </div>
    );
  if (!vehicle)
    return (
      <div className="text-center my-12 text-red-600">
        {error || "Vehículo no encontrado."}
      </div>
    );

  return (
    <div className="max-w-6xl mx-auto my-10 px-4">
      {error && (
        <div className="bg-red-100 text-red-700 p-3 rounded-lg mb-6 text-sm flex items-center gap-2">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="bg-emerald-100 text-emerald-800 p-3 rounded-lg mb-6 text-sm flex items-center gap-2">
          <CheckCircle className="w-5 h-5 flex-shrink-0" />
          <span>{success}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Galería de Fotos */}
        <div>
          <div className="h-80 bg-slate-100 rounded-2xl overflow-hidden border border-gray-200">
            <img
              src={selectedPhoto}
              alt="Vehículo"
              className="w-full h-full object-cover"
            />
          </div>

          <div className="grid grid-cols-5 gap-2 mt-4">
            {vehicle.fotos?.map((photo, index) => (
              <button
                key={index}
                onClick={() => setSelectedPhoto(photo)}
                className={`h-16 rounded-lg overflow-hidden border-2 transition ${
                  selectedPhoto === photo
                    ? "border-blue-600"
                    : "border-gray-200 opacity-70"
                }`}
              >
                <img
                  src={photo}
                  alt={`Miniatura ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        </div>

        {/* Información y Panel de Control */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-md flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-2xl font-bold text-slate-800">
                  {vehicle.fichaTecnica?.marca} {vehicle.fichaTecnica?.modelo}{" "}
                  {vehicle.fichaTecnica?.anio}
                </h1>
                <p className="text-xs font-medium text-gray-400 uppercase mt-1">
                  {vehicle.fichaTecnica?.tipoArticulo}
                </p>
              </div>

              {isOwner && (
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className="flex items-center gap-1 text-xs bg-slate-100 text-slate-700 px-3 py-1.5 rounded-lg font-semibold hover:bg-slate-200"
                >
                  <Edit className="w-3.5 h-3.5" />
                  {isEditing ? "Cancelar" : "Editar"}
                </button>
              )}
            </div>

            {/* Estado de Edición del Vendedor */}
            {isEditing ? (
              <div className="mt-4 p-4 bg-slate-50 rounded-xl border border-gray-200 space-y-3">
                <h4 className="text-xs font-bold uppercase text-slate-700">
                  Editar Precio Base
                </h4>
                <div>
                  <label className="text-xs text-gray-500">
                    Monto Base (Q.)
                  </label>
                  <input
                    type="number"
                    value={editPrice}
                    onChange={(e) => setEditPrice(e.target.value)}
                    className="w-full mt-1 p-2 border rounded-lg text-sm"
                  />
                </div>
                <button
                  onClick={handleSaveEdit}
                  className="w-full bg-blue-600 text-white font-bold py-2 rounded-lg text-sm hover:bg-blue-700"
                >
                  Guardar Cambios
                </button>
              </div>
            ) : (
              <div className="mt-6 p-4 bg-slate-50 rounded-xl flex justify-between items-center">
                <div>
                  <span className="text-xs text-gray-400 uppercase block">
                    Oferta Actual
                  </span>
                  <span className="text-2xl font-black text-blue-600">
                    Q. {vehicle.ofertaActual?.toLocaleString()}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-xs text-gray-400 uppercase block">
                    Total Pujas
                  </span>
                  <span className="text-sm font-bold text-slate-700">
                    {vehicle.totalPujas || 0} pujas
                  </span>
                </div>
              </div>
            )}

            {/* Panel de Ofertas para Compradores */}
            {!isOwner && (
              <form onSubmit={handleBidSubmit} className="mt-6 border-t pt-4">
                <label className="block text-xs font-semibold text-slate-700 uppercase mb-2">
                  Ingresa tu Oferta (Q.)
                </label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    value={bidAmount}
                    onChange={(e) => setBidAmount(e.target.value)}
                    required
                    className="w-full p-2.5 border rounded-xl text-sm font-semibold text-slate-800 outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    disabled={bidding}
                    type="submit"
                    className="bg-emerald-600 text-white font-bold px-6 py-2.5 rounded-xl hover:bg-emerald-700 transition flex items-center gap-1.5"
                  >
                    <Gavel className="w-4 h-4" />
                    Pujar
                  </button>
                </div>
              </form>
            )}

            {/* Ficha Técnica Detallada */}
            <div className="mt-6 border-t pt-4">
              <h3 className="text-xs font-bold text-slate-700 uppercase mb-3">
                Ficha Técnica
              </h3>
              <div className="grid grid-cols-2 gap-3 text-xs text-gray-600">
                <div>
                  <span className="font-semibold text-gray-400">Motor:</span>{" "}
                  {vehicle.fichaTecnica?.motor}
                </div>
                <div>
                  <span className="font-semibold text-gray-400">
                    Transmisión:
                  </span>{" "}
                  {vehicle.fichaTecnica?.transmision}
                </div>
                <div>
                  <span className="font-semibold text-gray-400">
                    Combustible:
                  </span>{" "}
                  {vehicle.fichaTecnica?.combustible}
                </div>
                <div>
                  <span className="font-semibold text-gray-400">
                    Tren de Manejo:
                  </span>{" "}
                  {vehicle.fichaTecnica?.trenManejo}
                </div>
                <div>
                  <span className="font-semibold text-gray-400">
                    Cilindros:
                  </span>{" "}
                  {vehicle.fichaTecnica?.cilindros}
                </div>
                <div>
                  <span className="font-semibold text-gray-400">Vendedor:</span>{" "}
                  {vehicle.publisherEmail}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
