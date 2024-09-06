import clientPromise from "../lib/mongodb"; // Importe la fonction `clientPromise` qui gère la connexion à la base de données MongoDB.
import { verifyToken } from "../lib/auth"; // Importe la fonction `verifyToken` qui vérifie la validité du token JWT.
import { NextResponse } from "next/server"; // Importe `NextResponse`, un utilitaire de Next.js pour créer des réponses HTTP.

// GET Route to retrieve all cars
export async function GET() {
  const client = await clientPromise; // Attends la résolution de la promesse pour se connecter à MongoDB.
  const db = client.db("MyFirstDBForLearn"); // Accède à la base de données `MyFirstDBForLearn`.
  const collection = db.collection("cars"); // Accède à la collection `cars` dans la base de données.

  const cars = await collection.find({}).toArray(); // Récupère tous les documents (voitures) dans la collection `cars` sous forme de tableau.

  return NextResponse.json(cars, { status: 200 }); // Retourne une réponse JSON contenant toutes les voitures avec un statut HTTP 200 (succès).
}

// POST Route to add a new car
export async function POST(request) {
  const token = request.headers.get("Authorization")?.split(" ")[1];
  // Récupère le header `Authorization` de la requête et extrait le token JWT, s'il existe.

  const user = verifyToken(token);
  // Vérifie le token pour extraire les informations de l'utilisateur. Si le token est invalide, `user` sera `null`.

  if (!user) {
    // Si l'utilisateur n'est pas authentifié (token invalide ou absent), retourne une réponse `401 Unauthorized`.
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { brand, model, color, engineType, nbrDoor, photo } =
    await request.json();
  // Extrait et désérialise les données envoyées dans la requête POST (la marque, le modèle, la couleur, le type de moteur, le nombre de portes, et la photo de la voiture).

  const client = await clientPromise;
  // Se connecte à MongoDB.
  const db = client.db("MyFirstDBForLearn");
  // Accède à la base de données `MyFirstDBForLearn`.
  const collection = db.collection("cars");
  // Accède à la collection `cars` dans la base de données.

  const newCar = {
    brand,
    model,
    color,
    engineType,
    nbrDoor,
    photo,
    createdBy: user.id,
  };
  // Crée un nouvel objet voiture avec les informations fournies par l'utilisateur, et associe cet objet à l'utilisateur connecté via `createdBy`.

  await collection.insertOne(newCar);
  // Insère la nouvelle voiture dans la collection `cars`.

  return NextResponse.json(
    { message: "Car added successfully" },
    { status: 201 }
  );
  // Retourne une réponse JSON confirmant que la voiture a été ajoutée, avec un statut HTTP 201 (créé).
}
