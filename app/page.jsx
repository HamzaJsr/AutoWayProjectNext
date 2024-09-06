// "use client";
// import React, { useEffect, useState } from "react";
// import { Link } from "@nextui-org/react";
// import { Spinner } from "@nextui-org/react";

// export default function Home() {
//   const [name, setName] = useState("");
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const res = await fetch("http://192.168.1.213:3000/api/name");
//         const data = await res.json();
//         setName(data.name); // Assurez-vous que "name" est bien la clé dans l'objet JSON retourné
//       } catch (error) {
//         console.error("Failed to fetch name:", error);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchData();
//   }, []);

//   return (
//     <main className="flex h-screen w-full flex-col items-center justify-center bg-zinc-100">
//       <div className="flex w-full max-w-sm flex-col justify-start gap-6 rounded-2xl border border-zinc-300 bg-zinc-50 p-9 text-zinc-950 shadow-lg transition-transform duration-300 ease-linear hover:animate-wiggle lg:max-w-md">
//         <div>
//           <h1 className=" text-2xl font-bold">
//             Hello {loading ? <Spinner size="sm" /> : name}
//           </h1>

//           <p className=" text-sm/6 text-zinc-800">
//             Lorem, ipsum dolor sit amet consectetur adipisicing elit. Quam
//             inventore sequi veritatis ducimus corrupti delectus tempore tempora
//             minima officiis suscipit dolor molestias, eveniet vel voluptates,
//             laborum rem nostrum voluptatibus? Eius!
//           </p>
//         </div>
//         <ul className="grid grid-cols-1 gap-2 md:grid-cols-2">
//           <li className="  group flex justify-between rounded-md bg-zinc-200 px-4 py-2 shadow transition-transform hover:scale-105">
//             Oeuf
//             <div className=" opacity-0 transition-opacity group-hover:opacity-100 ">
//               ➡️
//             </div>
//           </li>
//           <li className=" group flex justify-between rounded-md bg-zinc-200 px-4 py-2 shadow transition-transform hover:scale-105">
//             Fromage
//             <div className=" opacity-0 transition-opacity group-hover:opacity-100 ">
//               ➡️
//             </div>
//           </li>
//           <li className=" group flex justify-between rounded-md bg-zinc-200 px-4 py-2 shadow transition-transform hover:scale-105">
//             Pain
//             <div className=" opacity-0 transition-opacity group-hover:opacity-100 ">
//               ➡️
//             </div>
//           </li>
//           <li className=" group flex justify-between rounded-md bg-zinc-200 px-4 py-2 shadow transition-transform hover:scale-105">
//             Beurre
//             <div className=" opacity-0 transition-opacity group-hover:opacity-100 ">
//               ➡️
//             </div>
//           </li>
//         </ul>

//         <div className="flex flex-col justify-center gap-2 lg:flex-row">
//           <button className=" rounded-md bg-sky-500 px-4 py-2 font-bold uppercase text-zinc-100 shadow-sm ring-sky-300 ring-offset-2 transition-all hover:bg-sky-600 focus:outline-none focus:ring-4 active:bg-sky-600/90">
//             Click me
//           </button>
//           <button className=" rounded-md bg-emerald-500 px-4 py-2 font-bold uppercase text-zinc-100 shadow-sm ring-emerald-300 ring-offset-2 transition-all hover:bg-emerald-600 focus:outline-none focus:ring-4 active:bg-emerald-600/90">
//             Click me
//           </button>
//           <Link
//             href="/carList"
//             className="m-5 rounded-lg bg-blue-500 px-4 py-2 text-white shadow transition-colors hover:bg-blue-600"
//           >
//             Liste des voitures
//           </Link>
//         </div>
//       </div>
//     </main>
//   );
// }

// "use client";

// import Link from "next/link";
// import React, { useEffect, useState } from "react";
// import { Spinner } from "@nextui-org/react";

// export default function CarList() {
//   const [cars, setCars] = useState([]);
//   const [error, setError] = useState("");
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     async function fetchCars() {
//       try {
//         const response = await fetch("/api/cars");
//         if (!response.ok) {
//           throw new Error("Failed to fetch cars");
//         }
//         const data = await response.json();
//         setCars(data);
//       } catch (err) {
//         setError(err.message);
//       } finally {
//         setLoading(false);
//       }
//     }

//     fetchCars();
//   }, []);

//   return (
//     <div className="p-6">
//       <div className="flex justify-between">
//         <h2 className="mb-4 text-3xl font-bold">Car List</h2>
//         <Link
//           href="/addCar"
//           className="m-5 rounded-lg bg-blue-500 px-4 py-2 text-white shadow transition-colors hover:bg-blue-600"
//         >
//           Ajouter voiture
//         </Link>
//       </div>

//       {error && <p className="mb-4 text-red-500">{error}</p>}

//       <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
//         {loading ? (
//           <Spinner />
//         ) : cars.length === 0 ? (
//           <p className="text-gray-500">No cars available.</p>
//         ) : (
//           cars.map((car) => (
//             <Link
//               className="rounded border bg-white p-4 shadow-md hover:bg-gray-100"
//               key={car._id}
//               href={`/carList/${car._id}`}
//             >
//               <img
//                 src={car.photo}
//                 alt={car.model}
//                 className="mb-4 h-40 w-full rounded object-cover"
//               />
//               <h3 className="text-xl font-semibold">
//                 {car.brand} {car.model}
//               </h3>
//               <p className="text-gray-600">Color: {car.color}</p>
//               <p className="text-gray-600">Engine: {car.engineType}</p>
//               <p className="text-gray-600">Doors: {car.nbrDoor}</p>
//             </Link>
//           ))
//         )}
//         {}
//       </div>
//     </div>
//   );
// }
/* eslint-disable react/no-unescaped-entities */
"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

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
        router.push("/");
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
        <h2 className="text-center text-3xl font-bold">Connexion</h2>
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
            Consulter la liste des vehicules sans vous inscription
          </Link>
        </div>
      </div>
    </div>
  );
}
