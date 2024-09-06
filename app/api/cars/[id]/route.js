import clientPromise from "../../lib/mongodb";
import { ObjectId } from "mongodb"; // Importe `ObjectId` de MongoDB, utilisé pour manipuler les IDs des documents MongoDB.
import { NextResponse } from "next/server";
import { verifyToken } from "../../lib/auth";

// Recup une seul voiture avec son id
export async function GET(request, { params }) {
  const { id } = params; // Récupère l'ID de la voiture à partir des paramètres d'URL

  if (!ObjectId.isValid(id)) {
    // Vérifie si l'ID fourni est un ObjectId valide de MongoDB
    return NextResponse.json({ error: "Invalid car ID" }, { status: 400 });
  }

  const client = await clientPromise;
  const db = client.db("MyFirstDBForLearn");
  const collection = db.collection("cars");

  const car = await collection.findOne({ _id: new ObjectId(id) });
  // Cherche la voiture dans la collection avec l'ID correspondant

  if (!car) {
    // Si aucune voiture n'est trouvée avec cet ID, retourne une erreur 404
    return NextResponse.json({ error: "Car not found" }, { status: 404 });
  }

  return NextResponse.json(car, { status: 200 });
  // Retourne les détails de la voiture si elle est trouvée
}

// Supprime une seul voiture avec son id
export async function DELETE(request, { params }) {
  const { id } = params; // Récupère l'ID de la voiture à partir des paramètres d'URL
  console.log(id);

  const token = request.headers.get("Authorization")?.split(" ")[1];
  const user = verifyToken(token);

  if (!user) {
    return NextResponse.json(
      { error: "Vous n'êtes pas autorisé" },
      { status: 401 }
    );
  }

  if (!ObjectId.isValid(id)) {
    return NextResponse.json(
      { error: "ID de voiture invalide" },
      { status: 400 }
    );
  }

  const client = await clientPromise;
  const db = client.db("MyFirstDBForLearn");
  const collection = db.collection("cars");

  const car = await collection.findOne({ _id: new ObjectId(id) });

  if (!car) {
    return NextResponse.json({ error: "Voiture non trouvée" }, { status: 404 });
  }

  if (car.createdBy !== user.id) {
    return NextResponse.json(
      { error: "Vous n'êtes pas autorisé à supprimer cette voiture" },
      { status: 403 }
    );
  }

  await collection.deleteOne({ _id: new ObjectId(id) });

  return NextResponse.json(
    { message: "Voiture supprimée avec succès" },
    { status: 200 }
  );
}
