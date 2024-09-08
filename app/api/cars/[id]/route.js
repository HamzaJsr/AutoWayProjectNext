import clientPromise from "../../lib/mongodb";
import { ObjectId } from "mongodb"; // Importe `ObjectId` de MongoDB, utilisé pour manipuler les IDs des documents MongoDB.
import { NextResponse } from "next/server";
import { verifyToken } from "../../lib/auth";
import { uploadFileToS3, deleteFileFromS3 } from "../../lib/awsS3";

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

  // Suppression de l'image dans S3
  const photoKey = car.photo.split(".com/")[1]; // Extraire la clé S3 depuis l'URL
  if (photoKey) {
    await deleteFileFromS3(photoKey);
  }

  return NextResponse.json(
    { message: "Voiture supprimée avec succès" },
    { status: 200 }
  );
}

export async function PUT(request, { params }) {
  const { id } = params;

  try {
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

    // 3. Récupérer la voiture pour vérifier si l'utilisateur est bien l'auteur
    const car = await collection.findOne({ _id: new ObjectId(id) });
    if (!car) {
      return new Response(JSON.stringify({ error: "Car not found" }), {
        status: 404,
      });
    }

    if (car.userId !== user.id) {
      // Comparer l'ID de l'utilisateur connecté avec celui qui a créé la voiture
      return new Response(JSON.stringify({ error: "Forbidden" }), {
        status: 403,
      });
    }
    //Recupérer données formulaire
    const formData = await request.formData();
    //Creation d'un objet vide pour y integrer les nouvelles data du nouveau formulaire de modification
    const updates = {};

    // Traiter les champs du formulaire
    for (const [key, value] of formData.entries()) {
      if (key === "photo") {
        const photoFile = formData.get("photo");

        if (photoFile) {
          // Récupérer les informations actuelles du véhicule
          const oldCar = await collection.findOne({ _id: new ObjectId(id) });

          // Supprimer l'ancienne photo de S3
          const oldPhotoKey = oldCar.photo.split(".com/")[1];
          if (oldPhotoKey) {
            await deleteFileFromS3(oldPhotoKey);
          }

          // Télécharger la nouvelle photo sur S3
          const newPhotoUrl = await uploadFileToS3(photoFile);
          updates.photo = newPhotoUrl;
        }
      } else if (value) {
        updates[key] = value;
      }
    }

    // Mettre à jour le document dans MongoDB
    await collection.updateOne({ _id: new ObjectId(id) }, { $set: updates });
    return new Response(
      JSON.stringify({ message: "Car updated successfully" }),
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: "Error updating car" }), {
      status: 500,
    });
  }
}
