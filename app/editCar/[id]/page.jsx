/* eslint-disable react/no-unescaped-entities */
/* eslint-disable react/prop-types */
"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const EditCar = ({ params }) => {
  const router = useRouter();
  const { id } = params;
  const [car, setCar] = useState(null);
  const [formData, setFormData] = useState({
    brand: "",
    model: "",
    color: "",
    engineType: "",
    nbrDoor: "",
    photo: null,
    description: "", // Added description field
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token"); // Suppose que le token est stocké dans localStorage
    const fetchUser = async () => {
      try {
        if (!token) {
          setError(
            "Vous devez être connecté pour accéder aux modification de l'annonce."
          );
          return;
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
          setFormData({
            brand: data.brand,
            model: data.model,
            color: data.color,
            engineType: data.engineType,
            nbrDoor: data.nbrDoor,
            photo: data.photo,
            description: data.description,
          });
        } else {
          setError(data.error || "An error occurred");
        }
      } catch (err) {
        console.error(err);
        setError("An error occurred");
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
    fetchCarDetails();
  }, [id]);

  useEffect(() => {
    if (user && car) {
      if (user.id !== car.createdBy) {
        setError("Vous n'êtes pas le propriétaire de cette annonce.");
      }
    }
  }, [user, car]);

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    setFormData({
      ...formData,
      [name]: type === "file" ? files[0] : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = new FormData();
    for (const key in formData) {
      form.append(key, formData[key]);
    }
    const token = localStorage.getItem("token"); // Suppose que le token est stocké dans localStorage
    try {
      const response = await fetch(`/api/cars/${id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`, // Include the token in the request headers
        },
        body: form,
      });
      if (response.ok) {
        alert("Car updated successfully");
        router.push(`/carList/${car._id}`);
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
    router.push(`/carList/${id}`);
  };

  if (loading) return <p className="text-center">Loading...</p>;

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

  return (
    <div className="mx-auto mt-10 max-w-lg rounded-lg bg-white p-6 shadow-md">
      <div className="flex justify-between">
        <h2 className="mb-4 text-2xl font-bold">Modifier un véhicule</h2>
        <button
          type="button"
          onClick={handleBack}
          className="rounded-lg bg-gray-500 px-4 py-2 text-white shadow transition-colors hover:bg-gray-600"
        >
          ↩️
        </button>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="brand" className="block font-medium text-gray-700">
            Marque
          </label>
          <input
            type="text"
            id="brand"
            name="brand"
            value={formData.brand}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border border-gray-300 p-2"
          />
        </div>

        <div>
          <label htmlFor="model" className="block font-medium text-gray-700">
            Modèle
          </label>
          <input
            type="text"
            id="model"
            name="model"
            value={formData.model}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border border-gray-300 p-2"
          />
        </div>

        <div>
          <label htmlFor="color" className="block font-medium text-gray-700">
            Couleur
          </label>
          <input
            type="text"
            id="color"
            name="color"
            value={formData.color}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border border-gray-300 p-2"
          />
        </div>

        <div>
          <label className="block font-medium text-gray-700">
            Type de moteur
          </label>

          <div className="flex space-x-4">
            <label className=" inline-flex items-center">
              <span className="mr-2">Essence</span>
              <input
                type="radio"
                name="engineType"
                value="Essence"
                onChange={handleChange}
                checked={formData.engineType === "Essence"}
              />
            </label>
            <label className=" inline-flex items-center">
              <span className="mr-2">Diesel</span>
              <input
                type="radio"
                name="engineType"
                value="Diesel"
                onChange={handleChange}
                checked={formData.engineType === "Diesel"}
              />
            </label>
            <label className=" inline-flex items-center">
              <span className="mr-2">Hybrid</span>
              <input
                type="radio"
                name="engineType"
                value="Hybrid"
                onChange={handleChange}
                checked={formData.engineType === "Hybrid"}
              />
            </label>
          </div>
        </div>

        <div>
          <label className="block font-medium text-gray-700">
            Nombre de portes
          </label>

          <div className="flex space-x-4">
            <label className=" inline-flex items-center">
              <span className="mr-2">5</span>
              <input
                type="radio"
                name="nbrDoor"
                value="5"
                onChange={handleChange}
                checked={formData.nbrDoor === "5"}
              />
            </label>
            <label className=" inline-flex items-center">
              <span className="mr-2">3</span>
              <input
                type="radio"
                name="nbrDoor"
                value="3"
                onChange={handleChange}
                checked={formData.nbrDoor === "3"}
              />
            </label>
          </div>
        </div>

        <div>
          <label
            htmlFor="description"
            className="block font-medium text-gray-700"
          >
            Description
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border border-gray-300 p-2"
            rows="4"
          />
        </div>

        <div>
          <label className="block font-medium text-gray-700">
            Photo
            <input
              type="file"
              name="photo"
              accept="image/*"
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border border-gray-300 p-2"
            />
          </label>
        </div>

        <button
          type="submit"
          className="w-full rounded-md bg-blue-500 py-2 font-semibold text-white hover:bg-blue-600"
        >
          Sauvegarder les modifications
        </button>
      </form>
    </div>
  );
};

export default EditCar;
