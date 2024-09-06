/* eslint-disable react/no-unescaped-entities */
// app/auth/signup.js ou pages/auth/signup.js
"use client"; // si vous êtes en mode "app"

import React, { useState } from "react";
import { useRouter } from "next/navigation"; // ou 'next/router' si vous êtes en mode pages

export default function Signup() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (password !== confirmPassword) {
      setError("Les mots de passe ne correspondent pas.");
      return;
    }

    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, name, password }),
      });

      if (response.ok) {
        setSuccess(
          "Utilisateur créé avec succès. Vous serez redirigez dans quelque seconde sur la page de connexion"
        );
        setEmail("");
        setName("");
        setPassword("");
        setConfirmPassword("");

        // Rediriger vers la page de connexion
        setTimeout(() => {
          router.push("/login");
        }, 3000);
      } else {
        const data = await response.json();
        setError(data.error || "Une erreur s'est produite.");
      }
    } catch (err) {
      console.error(err);
      setError("Une erreur s'est produite.");
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-lg space-y-6 rounded-lg bg-white p-8 shadow-md sm:max-w-md">
        <h2 className="text-center text-3xl font-bold">Inscription</h2>
        {error && <p className="text-red-500">{error}</p>}
        {success && <p className="text-green-500">{success}</p>}
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 w-full rounded-md border p-2 focus:border-indigo-500 focus:ring-indigo-500"
              required
            />
          </div>

          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700"
            >
              Prénom
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 w-full rounded-md border p-2 focus:border-indigo-500 focus:ring-indigo-500"
              required
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Mot de passe
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 w-full rounded-md border p-2 focus:border-indigo-500 focus:ring-indigo-500"
              required
            />
          </div>
          <div>
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-medium text-gray-700"
            >
              Confirmer le mot de passe
            </label>
            <input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="mt-1 w-full rounded-md border p-2 focus:border-indigo-500 focus:ring-indigo-500"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            S'inscrire
          </button>
        </form>
        <p className="text-center text-sm text-gray-600">
          Déjà inscrit ?{" "}
          <a href="/login" className="text-blue-600 hover:text-blue-500">
            Connectez-vous
          </a>
        </p>
      </div>
    </div>
  );
}
