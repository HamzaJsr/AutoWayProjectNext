/* eslint-disable no-undef */

import clientPromise from "../../lib/mongodb"; // Utilisation de clientPromise pour se connecter à MongoDB
import bcrypt from "bcrypt";
import { NextResponse } from "next/server";

export async function POST(request) {
  const { email, name, password } = await request.json();

  // Connectez-vous à MongoDB
  const client = await clientPromise; // Utilisation de clientPromise pour obtenir la connexion MongoDB
  const db = client.db("MyFirstDBForLearn");
  const collection = db.collection("users");

  // Vérifiez si l'utilisateur existe déjà
  const existingUser = await collection.findOne({ email });

  if (existingUser) {
    return NextResponse.json(
      { error: "Cet email est déjà utilisé." },
      { status: 400 }
    );
  }

  // Hachage du mot de passe
  const hashedPassword = await bcrypt.hash(password, 10);

  // Enregistrement de l'utilisateur
  await collection.insertOne({ email, name, password: hashedPassword });

  return NextResponse.json(
    { message: "Utilisateur créé avec succès" },
    { status: 201 }
  );
}
