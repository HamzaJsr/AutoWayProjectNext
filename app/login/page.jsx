/* eslint-disable react/no-unescaped-entities */
"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem("token", data.token);
        router.push("/carList");
      } else {
        const data = await response.json();
        setError(data.error || "Login failed");
      }
    } catch (err) {
      setError("Login failed");
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-lg space-y-6 rounded-lg bg-white p-8 shadow-md sm:max-w-md ">
        <div className="flex items-center justify-center">
          <Image
            src="/icons8-voiture-96.png"
            width={50}
            height={50}
            alt="logo"
          ></Image>
          <h2 className="ml-3 text-center text-3xl font-bold">Connexion</h2>
        </div>

        {error && <p className="text-red-500">{error}</p>}

        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded border border-gray-300 p-2"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded border border-gray-300 p-2"
            required
          />
          {error && <p className="text-red-500">{error}</p>}
          <button
            type="submit"
            className="w-full rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-500"
          >
            Login
          </button>
        </form>

        <p className="text-center text-sm text-gray-600">
          Vous n'avez pas de compte ?{" "}
          <Link href="/signup" className="text-blue-600 hover:text-blue-500">
            Inscrivez-vous ici
          </Link>
        </p>
        <div className="flex justify-center">
          <Link
            href="/carList"
            className="m-5 rounded-lg bg-sky-500 px-4 py-2 text-center text-white shadow transition-colors hover:bg-sky-600"
          >
            Consulter la liste des vehicules sans vous inscrire
          </Link>
        </div>
      </div>
    </div>
  );
}
