"use client";

import React, { useState } from "react";
import Link from "next/link";

export default function AddCarForm() {
  const [brand, setBrand] = useState("");
  const [model, setModel] = useState("");
  const [color, setColor] = useState("");
  const [engineType, setEngineType] = useState("");
  const [nbrDoor, setNbrDoor] = useState("");
  const [photoFile, setPhotoFile] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Reset error and success messages
    setError("");
    setSuccess("");

    // Retrieve the token from localStorage (or another method you're using)
    const token = localStorage.getItem("token");

    if (!token) {
      setError("Vous devez être connecté pour ajouter une voiture");
      return;
    }

    // Validate input
    if (!brand || !model || !color || !engineType || !nbrDoor || !photoFile) {
      setError("Tous les champs sont obligatoires");
      return;
    }

    const formData = new FormData(); // Using FormData for file upload
    formData.append("brand", brand);
    formData.append("model", model);
    formData.append("color", color);
    formData.append("engineType", engineType);
    formData.append("nbrDoor", nbrDoor);
    formData.append("photo", photoFile); // File

    try {
      const response = await fetch("/api/cars", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`, // Include the token in the request headers
        },
        body: formData,
      });

      if (response.ok) {
        setSuccess("Voiture ajoutée avec succès");
        // Reset form fields
        setBrand("");
        setModel("");
        setColor("");
        setEngineType("");
        setNbrDoor("");
        setPhotoFile(null);
      } else {
        const data = await response.json();
        setError(data.error || "Une erreur est survenue");
      }
    } catch (err) {
      console.error(err);
      setError("Une erreur est survenue");
    }
  };

  return (
    <div className="mx-auto mt-10 max-w-lg rounded-lg bg-white p-6 shadow-md">
      <div className="flex justify-between">
        <h2 className="mb-4 text-2xl font-bold">Ajouter un vehicule</h2>
        <Link
          href="/carList"
          className="m-5 rounded-lg bg-blue-500 px-4 py-2 text-white shadow transition-colors hover:bg-blue-600"
        >
          Liste des voitures
        </Link>
      </div>
      {error && (
        <div className="mb-4 text-center text-red-500">
          <p>{error}</p>
          <a
            href="/login"
            className="text-blue-500 underline hover:text-blue-700"
          >
            Se connecter
          </a>
        </div>
      )}

      {success && <p className="mb-4 text-green-500">{success}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="brand" className="block font-medium text-gray-700">
            Marque
          </label>
          <input
            type="text"
            id="brand"
            value={brand}
            onChange={(e) => setBrand(e.target.value)}
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
            value={model}
            onChange={(e) => setModel(e.target.value)}
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
            value={color}
            onChange={(e) => setColor(e.target.value)}
            className="mt-1 block w-full rounded-md border border-gray-300 p-2"
          />
        </div>

        <div>
          <label className="block font-medium text-gray-700">
            Type de moteur
          </label>

          <div className="flex space-x-4">
            <label className=" inline-flex items-center">
              <span className=" mr-2 ">Essence</span>
              <input
                type="radio"
                name="engineType"
                value="Essence"
                onChange={(e) => setEngineType(e.target.value)}
                checked={engineType === "Essence"}
              />
            </label>
            <label className=" inline-flex items-center">
              <span className=" mr-2">Diesel</span>
              <input
                type="radio"
                name="engineType"
                value="Diesel"
                onChange={(e) => setEngineType(e.target.value)}
                checked={engineType === "Diesel"}
              />
            </label>
            <label className=" inline-flex items-center">
              <span className=" mr-2">Hybrid</span>
              <input
                type="radio"
                name="engineType"
                value="Hybrid"
                onChange={(e) => setEngineType(e.target.value)}
                checked={engineType === "Hybrid"}
              />
            </label>
          </div>
        </div>

        <div>
          <label className="block font-medium text-gray-700">
            Nombre de porte
          </label>

          <div className="flex space-x-4">
            <label className=" inline-flex items-center">
              <span className=" mr-2">5</span>
              <input
                type="radio"
                name="nbrOfDoor"
                value="5"
                onChange={(e) => setNbrDoor(e.target.value)}
                checked={nbrDoor === "5"}
              />
            </label>
            <label className=" inline-flex items-center ">
              <span className=" mr-2">3</span>
              <input
                type="radio"
                name="nbrOfDoor"
                value="3"
                onChange={(e) => setNbrDoor(e.target.value)}
                checked={nbrDoor === "3"}
              />
            </label>
          </div>
        </div>

        <div>
          <label className="block font-medium text-gray-700">
            Photo
            <input
              type="file"
              accept="image/*"
              value={photoFile}
              onChange={(e) => setPhotoFile(e.target.files[0])}
              className="mt-1 block w-full rounded-md border border-gray-300 p-2"
            />
          </label>
        </div>

        <button
          type="submit"
          className="w-full rounded-md bg-blue-500 py-2 font-semibold text-white hover:bg-blue-600"
        >
          Add Car
        </button>
      </form>
    </div>
  );
}