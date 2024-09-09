"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";

export default function AddCarForm() {
  const [brand, setBrand] = useState("");
  const [model, setModel] = useState("");
  const [color, setColor] = useState("");
  const [engineType, setEngineType] = useState("");
  const [nbrDoor, setNbrDoor] = useState("");
  const [photoFile, setPhotoFile] = useState(null);
  const [description, setDescription] = useState(""); // Nouvel état pour la description
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false); // État pour gérer l'authentification

  // Utilisation correcte de useEffect pour vérifier l'authentification
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsAuthenticated(true); // Si un token existe, on considère l'utilisateur comme connecté
    } else {
      setIsAuthenticated(false); // Sinon, on considère l'utilisateur comme non connecté
    }
  }, []);

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
    if (
      !brand ||
      !model ||
      !color ||
      !engineType ||
      !nbrDoor ||
      !photoFile ||
      !description
    ) {
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
    formData.append("description", description); // Description

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
        setDescription(""); // Reset description
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
        <h2 className="mb-4 text-2xl font-bold">Ajouter un véhicule</h2>
        <Link
          href="/carList"
          className="m-5 rounded-lg bg-blue-500 px-4 py-2 text-white shadow transition-colors hover:bg-blue-600"
        >
          Liste des véhicules
        </Link>
      </div>

      {/* Afficher un message d'erreur si l'utilisateur n'est pas connecté */}
      {!isAuthenticated && (
        <div className="mb-4 text-center text-red-500">
          <p>{error || "Vous devez être connecté pour ajouter un véhicule."}</p>
          <Link
            href="/login"
            className="text-blue-500 underline hover:text-blue-700"
          >
            Se connecter
          </Link>
        </div>
      )}

      {/* Afficher un message d'erreur spécifique si tous les champs ne sont pas remplis */}
      {isAuthenticated && error && (
        <div className="mb-4 text-center text-red-500">
          <p>{error}</p>
        </div>
      )}

      {/* Afficher le message de succès */}
      {success && <p className="mb-4 text-green-500">{success}</p>}

      {/* Si l'utilisateur est connecté, afficher le formulaire */}
      {isAuthenticated && (
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
              Nombre de portes
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

          {/* Champ de description */}
          <div>
            <label
              htmlFor="description"
              className="block font-medium text-gray-700"
            >
              Description
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="mt-1 block w-full rounded-md border border-gray-300 p-2"
              rows="4"
            ></textarea>
          </div>

          <div>
            <label className="block font-medium text-gray-700">
              Photo
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setPhotoFile(e.target.files[0])}
                className="mt-1 block w-full rounded-md border border-gray-300 p-2"
              />
            </label>
          </div>

          <button
            type="submit"
            className="w-full rounded-md bg-blue-500 py-2 font-semibold text-white hover:bg-blue-600"
          >
            Déposez votre annonce
          </button>
        </form>
      )}
    </div>
  );
}
