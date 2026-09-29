import React, { createContext, useContext, useEffect, useState } from "react";
import { auth, db } from "../firebase/config";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Registro con token explícito
  const register = async (email, password, nombre, apellido, telefono) => {
    const res = await createUserWithEmailAndPassword(auth, email, password);
    const token = await res.user.getIdToken();
    localStorage.setItem("token", token);

    await setDoc(doc(db, "users", res.user.uid), {
      uid: res.user.uid,
      nombre,
      apellido,
      email,
      telefono,
      createdAt: new Date().toISOString(),
    });
  };

  // Login guardando token
  const login = async (email, password) => {
    const res = await signInWithEmailAndPassword(auth, email, password);
    const token = await res.user.getIdToken();
    localStorage.setItem("token", token);
    return res;
  };

  // Cierre de sesión con limpieza TOTAL de tokens
  const logout = async () => {
    localStorage.removeItem("token");
    localStorage.clear();
    await signOut(auth);
    setCurrentUser(null);
    setUserData(null);
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setCurrentUser(user);
        const token = await user.getIdToken();
        localStorage.setItem("token", token);

        // Cargar datos adicionales del usuario desde Firestore
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists()) {
          setUserData(userDoc.data());
        }
      } else {
        setCurrentUser(null);
        setUserData(null);
        localStorage.removeItem("token");
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    userData,
    register,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
