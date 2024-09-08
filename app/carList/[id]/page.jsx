"use client";
/* eslint-disable react/prop-types */
import React, { useState, useEffect, Fragment } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const CarDetails = ({ params }) => {
  const router = useRouter();
  const { id } = params; // Récupère l'ID de la voiture depuis l'URL
  const [token, setToken] = useState(null);
  const [car, setCar] = useState(null);
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const canDelete = user && user.id === car?.createdBy;

  useEffect(() => {
    const tokenFromStorage = localStorage.getItem("token"); // Suppose que le token est stocké dans localStorage
    setToken(tokenFromStorage);

    const fetchUser = async () => {
      try {
        if (!tokenFromStorage) {
          setError(
            "Vous devez être connecté pour accéder aux détails du véhicule."
          );
          return;
        }

        const response = await fetch("/api/auth/me", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${tokenFromStorage}`,
          },
        });

        const data = await response.json();

        if (response.ok) {
          setUser(data.user);
        } else {
          setError(data.error || "Failed to fetch user.");
        }
      } catch (err) {
        console.error(err);
        setError("Failed to fetch user.");
      }
    };

    const fetchCarDetails = async () => {
      try {
        const response = await fetch(`/api/cars/${id}`);
        const data = await response.json();

        if (response.ok) {
          setCar(data);
          console.log(data);
        } else {
          setError(data.error || "An error occurred");
        }
      } catch (err) {
        console.error(err);
        setError("An error occurred");
      }
    };

    fetchUser();
    fetchCarDetails();
  }, [id]);

  const handleDelete = async () => {
    try {
      const response = await fetch(`/api/cars/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
      });

      if (response.ok) {
        console.log(response);

        alert("Voiture supprimée avec succès");
        router.push("/carList"); // Redirige vers la liste des voitures après suppression
      } else {
        const data = await response.json();
        alert(data.error || "An error occurred");
      }
    } catch (err) {
      console.error(err);
      alert("An error occurred");
    }
  };

  const handleBack = () => {
    router.push("/carList"); // Retourne à la liste des voitures
  };

  if (error)
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-100">
        <div className="w-full max-w-sm rounded-lg bg-white p-6 shadow-lg">
          <p className="text-center text-red-500">{error}</p>
          <div className="mt-4 text-center">
            <Link
              href="/carList"
              className="rounded-lg bg-blue-500 px-4 py-2 text-white shadow transition-colors hover:bg-blue-600"
            >
              Liste des véhicules
            </Link>
          </div>
        </div>
      </div>
    );

  if (!car) return <p className="text-center">Loading...</p>;

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 p-4">
      <div className="flex w-full max-w-screen-lg flex-col rounded-lg bg-white p-6 shadow-lg">
        <div className="flex-1">
          <div className="mb-6 flex items-center justify-between">
            <button
              onClick={handleBack}
              className="rounded p-2 transition-transform duration-150 ease-in-out hover:bg-blue-100 focus:outline-none active:scale-90"
            >
              ↩️
            </button>
            <h1 className="flex-1 text-center text-2xl font-bold text-gray-800 md:text-4xl">
              {car.brand} {car.model}
            </h1>
          </div>

          <img
            src={car.photo}
            alt={car.model}
            className="mb-6 max-h-[500px] w-full rounded-lg object-cover object-center sm:max-h-[400px] md:max-h-[500px]"
          />

          <div className="text-center text-lg text-gray-700">
            <p className="mb-2">
              <strong>Couleur:</strong> {car.color}
            </p>
            <p className="mb-2">
              <strong>Motorisation:</strong> {car.engineType}
            </p>
            <p className="mb-4">
              <strong>Nombre de portes:</strong> {car.nbrDoor}
            </p>
            {canDelete && (
              <>
                <button
                  onClick={handleDelete}
                  className="mb-4 mr-4 rounded bg-red-500 px-4 py-2 text-white hover:bg-red-700"
                >
                  Supprimer la voiture
                </button>
                <Link
                  href={`/editCar/${car._id}`}
                  className="mb-4 mr-4 rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
                >
                  Modifier
                </Link>
              </>
            )}
          </div>
        </div>
        <div className="mt-6 flex-1 md:ml-6 md:mt-0">
          <h2 className="mb-4 text-2xl font-semibold text-gray-800">
            Description
          </h2>
          <p className="text-gray-700">
            {car.description ||
              "Aucune description disponible pour ce véhicule."}
          </p>
        </div>
      </div>
    </div>
  );
};

export default CarDetails;
