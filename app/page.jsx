"use client";

import Link from "next/link";
import React, { useEffect, useState } from "react";
import { Spinner } from "@nextui-org/react";
import Image from "next/image";

export default function CarList() {
  const [cars, setCars] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [searchTerm, setSearchTerm] = useState(""); // State pour la recherche

  useEffect(() => {
    async function fetchCars() {
      try {
        const response = await fetch("/api/cars");
        if (!response.ok) {
          throw new Error("Failed to fetch cars");
        }
        const data = await response.json();
        setCars(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");
        if (token) {
          setIsConnected(true);
        }

        const response = await fetch("/api/auth/me", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();

        if (response.ok) {
          setUser(data.user);
        }
      } catch (err) {
        console.error(err);
        setError("Failed to fetch user.");
      }
    };

    fetchCars();
    fetchUser();
  }, []);

  const handleLogout = () => {
    try {
      localStorage.removeItem("token");
      setUser(null);
      setIsConnected(false);
      window.location.href = "/login";
    } catch (err) {
      console.error(err);
      setError("Failed to logout.");
    }
  };

  // Filtrer les voitures en fonction de la recherche
  const filteredCars = cars.filter(
    (car) =>
      car.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
      car.model.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6">
      <div className="flex flex-wrap items-center justify-between">
        <div className="flex items-center justify-center ">
          <Image
            src="/icons8-voiture-96.png"
            width={50}
            height={50}
            alt="logo"
          />
          <h2 className="mb-4 text-3xl font-bold">Listes des véhicules</h2>
        </div>

        <div className="flex w-full items-center justify-end space-x-4 md:w-auto">
          {isConnected ? (
            <div className="flex items-center space-x-4">
              <span className="text-lg font-semibold text-gray-600">
                Bienvenue {user?.name}
              </span>
              <button onClick={handleLogout}>
                <img src="arrow-in.svg" alt="déconnexion" />
              </button>
            </div>
          ) : (
            <div>
              <a href="/login">
                <img
                  src="/connexion.png"
                  className="size-7 transition-transform duration-150 ease-in-out hover:scale-105 active:scale-95"
                  alt="connéxion"
                />
              </a>
            </div>
          )}

          <div className="flex justify-end p-5">
            <Link
              href="/addCar"
              className="flex w-full max-w-xs items-center justify-center rounded-lg bg-blue-500 px-4 py-2 text-center text-white shadow transition-colors hover:bg-blue-600 sm:max-w-md sm:px-6 sm:py-3"
            >
              <div className="flex flex-col text-center">
                <span className="text-xs font-medium sm:text-sm">Ajouter</span>
                <span className="text-xs font-light sm:text-xs">
                  un véhicule
                </span>
              </div>
            </Link>
          </div>
        </div>
      </div>

      {/* Champ de recherche */}
      <div className="mt-4">
        <input
          type="text"
          placeholder="Rechercher une voiture (Marque ou Modèle)"
          className="w-full rounded-md border border-gray-300 p-2"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {error && <p className="mb-4 text-red-500">{error}</p>}

      <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {loading ? (
          <Spinner />
        ) : filteredCars.length === 0 ? (
          <p className="text-gray-500">Aucun véhicule trouvé.</p>
        ) : (
          filteredCars.map((car) => (
            <Link
              className="rounded border bg-white p-4 shadow-md hover:bg-gray-100"
              key={car._id}
              href={`/carList/${car._id}`}
            >
              <img
                src={car.photo}
                alt={car.model}
                className="mb-4 h-40 w-full rounded object-cover"
              />
              <div className="flex justify-between">
                <div className="flex-1">
                  <h3 className="text-xl font-semibold">
                    {car.brand} {car.model}
                  </h3>
                  <p className="text-gray-600">Couleur: {car.color}</p>
                  <p className="text-gray-600">
                    Motorisation: {car.engineType}
                  </p>
                  <p className="text-gray-600">
                    Nombre de porte: {car.nbrDoor}
                  </p>
                </div>
                <div className="ml-4 flex-none">
                  <p className="text-xl font-semibold">{car.price}€</p>
                </div>
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}
