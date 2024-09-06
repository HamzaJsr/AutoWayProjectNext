/* eslint-disable no-undef */
import clientPromise from "../lib/mongodb"; // Importe la fonction `clientPromise` qui gère la connexion à la base de données MongoDB.
import { verifyToken } from "../lib/auth"; // Importe la fonction `verifyToken` qui vérifie la validité du token JWT.
import { NextResponse } from "next/server"; // Importe `NextResponse`, un utilitaire de Next.js pour créer des réponses HTTP.
import AWS from "aws-sdk";
import { Readable } from "stream";

// GET Route to retrieve all cars
export async function GET() {
  const client = await clientPromise; // Attends la résolution de la promesse pour se connecter à MongoDB.
  const db = client.db("MyFirstDBForLearn"); // Accède à la base de données `MyFirstDBForLearn`.
  const collection = db.collection("cars"); // Accède à la collection `cars` dans la base de données.

  const cars = await collection.find({}).toArray(); // Récupère tous les documents (voitures) dans la collection `cars` sous forme de tableau.

  return NextResponse.json(cars, { status: 200 }); // Retourne une réponse JSON contenant toutes les voitures avec un statut HTTP 200 (succès).
}

// Configuration de AWS S3
const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

// Fonction utilitaire pour convertir un buffer en stream
const bufferToStream = (buffer) => {
  const stream = new Readable();
  stream.push(buffer);
  stream.push(null);
  return stream;
};
// POST Route to add a new car
export async function POST(request) {
  const client = await clientPromise;
  // Se connecte à MongoDB.
  try {
    const token = request.headers.get("Authorization")?.split(" ")[1];
    // Récupère le header `Authorization` de la requête et extrait le token JWT, s'il existe.

    const user = verifyToken(token);
    // Vérifie le token pour extraire les informations de l'utilisateur. Si le token est invalide, `user` sera `null`.

    if (!user) {
      // Si l'utilisateur n'est pas authentifié (token invalide ou absent), retourne une réponse `401 Unauthorized`.
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await request.formData();

    const brand = formData.get("brand");
    const model = formData.get("model");
    const color = formData.get("color");
    const engineType = formData.get("engineType");
    const nbrDoor = parseInt(formData.get("nbrDoor"), 10);
    const photo = formData.get("photo");

    if (!photo) {
      return NextResponse.json({ error: "Photo is required" }, { status: 400 });
    }

    ////////

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
      // Retourne une réponse JSON confirmant que la voiture a été ajoutée, avec un statut HTTP 201 (créé).
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Error uploading car" }, { status: 500 });
  } finally {
    // Assurer la fermeture de la connexion
    await client.close();
  }
}
