import React, { useEffect, useState } from "react";
import { db } from "../firebase/config";
import { collection, query, where, getDocs } from "firebase/firestore";
import { useAuth } from "../context/AuthContext";
import { VehiculeCard } from "../components/VehiculeCard";

export const MyVehicles = () => {
  const { currentUser } = useAuth();
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMyVehicles = async () => {
      if (!currentUser) return;
      try {
        const q = query(
          collection(db, "vehicles"),
          where("publisherUid", "==", currentUser.uid)
        );
        const querySnapshot = await getDocs(q);
        const docs = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data()
        }));
        setVehicles(docs);
      } catch (err) {
        console.error("Error al obtener mis publicaciones:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchMyVehicles();
  }, [currentUser]);

  if (loading) return <div className="text-center my-12 text-slate-600">Cargando tus publicaciones...</div>;

  return (
    <div className="max-w-7xl mx-auto my-10 px-4">
      <h2 className="text-2xl font-bold text-slate-800 mb-6">🚘 Mis Publicaciones</h2>

      {vehicles.length === 0 ? (
        <div className="bg-white p-8 rounded-xl shadow-sm text-center border border-gray-200">
          <p className="text-gray-500">Aún no has publicado ningún vehículo para subasta.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {vehicles.map((vehicle) => (
            <VehiculeCard key={vehicle.id} vehicle={vehicle} />
          ))}
        </div>
      )}
    </div>
  );
};