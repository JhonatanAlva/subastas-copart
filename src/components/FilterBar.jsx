import React from "react";
import { Search, Filter } from "lucide-react";

export const FilterBar = ({ filters, setFilters }) => {
  const handleChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  return (
    <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 mb-8 grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
      {/* Buscador general */}
      <div className="relative">
        <Search className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
        <input
          type="text"
          name="search"
          value={filters.search}
          onChange={handleChange}
          placeholder="Buscar por marca o modelo..."
          className="w-full pl-9 pr-3 py-2 border rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none"
        />
      </div>

      {/* Filtro por Estado de Daño */}
      <div className="flex items-center gap-2">
        <Filter className="w-4 h-4 text-gray-400 hidden md:block" />
        <select
          name="estadoDano"
          value={filters.estadoDano}
          onChange={handleChange}
          className="w-full p-2 border rounded-xl text-sm bg-white outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="todos">Todos los Estados de Daño</option>
          <option value="verde">🟢 Daño Menor (Verde)</option>
          <option value="amarillo">🟡 Daño Medio (Amarillo)</option>
          <option value="rojo">🔴 Daño Severo (Rojo)</option>
        </select>
      </div>

      {/* Filtro por Tipo de Vehículo */}
      <div>
        <select
          name="tipoArticulo"
          value={filters.tipoArticulo}
          onChange={handleChange}
          className="w-full p-2 border rounded-xl text-sm bg-white outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="todos">Todos los Tipos</option>
          <option value="Sedán">Sedán</option>
          <option value="SUV">SUV</option>
          <option value="Pick-up">Pick-up</option>
          <option value="Hatchback">Hatchback</option>
          <option value="Coupe">Coupe</option>
        </select>
      </div>
    </div>
  );
};