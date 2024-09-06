// pages/api/auth/login.js

import clientPromise from "../../lib/mongodb"; // Utilisation de clientPromise pour se connecter à MongoDB
import { signToken } from "../../lib/auth";
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";

export async function POST(request) {
  const { email, password } = await request.json();

  const client = await clientPromise; // Utilisation de clientPromise pour obtenir la connexion MongoDB
  const db = client.db("MyFirstDBForLearn");
  const collection = db.collection("users");

  const user = await collection.findOne({ email });

  if (!user) {
    return NextResponse.json(
      { error: "Invalid email or password" },
      { status: 401 }
    );
  }

  // Comparaison du mot de passe fourni avec le mot de passe haché
  const passwordMatch = await bcrypt.compare(password, user.password);

  if (!passwordMatch) {
    return NextResponse.json(
      { error: "Invalid email or password" },
      { status: 401 }
    );
  }

  const token = signToken(user);

  return NextResponse.json({ token }, { status: 200 });
}
