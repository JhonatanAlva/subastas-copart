import React from "react";
import { useNavigate } from "react-router-dom";
import { Fuel, Tag } from "lucide-react";

export const VehiculeCard = ({ vehicle }) => {
  const navigate = useNavigate();

  const getDamageBadge = (dano) => {
    if (dano === "verde") return <span className="bg-green-100 text-green-800 text-xs px-2.5 py-0.5 rounded-full font-semibold">🟢 Daño Menor</span>;
    if (dano === "amarillo") return <span className="bg-yellow-100 text-yellow-800 text-xs px-2.5 py-0.5 rounded-full font-semibold">🟡 Daño Medio</span>;
    return <span className="bg-red-100 text-red-800 text-xs px-2.5 py-0.5 rounded-full font-semibold">🔴 Daño Severo</span>;
  };

  return (
    <div 
      onClick={() => navigate(`/vehiculo/${vehicle.id}`)}
      className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden flex flex-col hover:shadow-xl transition duration-300 cursor-pointer"
    >
      <div className="relative h-48 bg-slate-100">
        <img
          src={vehicle.fotos?.[0] || "https://via.placeholder.com/400x250?text=Sin+Imagen"}
          alt={`${vehicle.fichaTecnica?.marca} ${vehicle.fichaTecnica?.modelo}`}
          className="w-full h-full object-cover"
        />
        <div className="absolute top-3 left-3">{getDamageBadge(vehicle.estadoDano)}</div>
      </div>

      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <h3 className="text-lg font-bold text-slate-800">
            {vehicle.fichaTecnica?.marca} {vehicle.fichaTecnica?.modelo} {vehicle.fichaTecnica?.anio}
          </h3>
          <p className="text-xs text-gray-500 uppercase mt-1 tracking-wider">{vehicle.fichaTecnica?.tipoArticulo}</p>

          <div className="grid grid-cols-2 gap-2 text-xs text-gray-600 mt-4">
            <span className="flex items-center gap-1"><Fuel className="w-3.5 h-3.5" /> {vehicle.fichaTecnica?.combustible}</span>
            <span className="flex items-center gap-1"><Tag className="w-3.5 h-3.5" /> {vehicle.fichaTecnica?.transmision}</span>
          </div>
        </div>

        <div className="mt-6 pt-4 border-t flex justify-between items-center">
          <div>
            <span className="text-xs text-gray-400 block">Oferta Actual</span>
            <span className="text-lg font-extrabold text-blue-600">Q. {vehicle.ofertaActual?.toLocaleString()}</span>
          </div>
          <span className="bg-slate-100 text-slate-700 text-xs px-2.5 py-1 rounded-lg font-medium">
            {vehicle.totalPujas || 0} pujas
          </span>
        </div>
      </div>
    </div>
  );
};