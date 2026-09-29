import React, { useEffect, useState } from "react";
import { db } from "../firebase/config";
import { collection, getDocs } from "firebase/firestore";
import { VehiculeCard } from "../components/VehiculeCard";
import { FilterBar } from "../components/FilterBar";

export const Home = () => {
  const [vehicles, setVehicles] = useState([]);
  const [filteredVehicles, setFilteredVehicles] = useState([]);
  const [loading, setLoading] = useState(true);

  const [filters, setFilters] = useState({
    search: "",
    estadoDano: "todos",
    tipoArticulo: "todos"
  });

  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "vehicles"));
        const docs = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data()
        }));
        setVehicles(docs);
        setFilteredVehicles(docs);
      } catch (err) {
        console.error("Error al cargar el inventario:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchVehicles();
  }, []);

  // Filtrado dinamico
  useEffect(() => {
    let result = vehicles;

    // Filtro por texto (Marca / Modelo)
    if (filters.search.trim() !== "") {
      const queryText = filters.search.toLowerCase();
      result = result.filter(
        (v) =>
          v.fichaTecnica?.marca?.toLowerCase().includes(queryText) ||
          v.fichaTecnica?.modelo?.toLowerCase().includes(queryText)
      );
    }

    // Filtro por estado de daño
    if (filters.estadoDano !== "todos") {
      result = result.filter((v) => v.estadoDano === filters.estadoDano);
    }

    // Filtro por tipo de artículo
    if (filters.tipoArticulo !== "todos") {
      result = result.filter((v) => v.fichaTecnica?.tipoArticulo === filters.tipoArticulo);
    }

    setFilteredVehicles(result);
  }, [filters, vehicles]);

  if (loading) return <div className="text-center my-12 text-slate-600">Cargando inventario de subastas...</div>;

  return (
    <div className="max-w-7xl mx-auto my-10 px-4">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-extrabold text-slate-800">Inventario de Subastas Activas</h1>
        <p className="text-gray-500 mt-1">Explora los vehículos disponibles y realiza tus ofertas en tiempo real.</p>
      </div>

      {/* Componente de Filtros */}
      <FilterBar filters={filters} setFilters={setFilters} />

      {filteredVehicles.length === 0 ? (
        <div className="bg-white p-8 rounded-xl shadow-sm text-center border border-gray-200 max-w-lg mx-auto">
          <p className="text-gray-500">No se encontraron vehículos que coincidan con los filtros seleccionados.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {filteredVehicles.map((vehicle) => (
            <VehiculeCard key={vehicle.id} vehicle={vehicle} />
          ))}
        </div>
      )}
    </div>
  );
};