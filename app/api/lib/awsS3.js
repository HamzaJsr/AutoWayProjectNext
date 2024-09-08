/* eslint-disable no-undef */

import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";

// Configuration du client S3
const s3 = new S3Client({
  region: process.env.AWS_REGION, // Remplacez par la région de votre bucket S3
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

// Fonction pour ajouter un fichier à S3
export const uploadFileToS3 = async (file, folder = "cars") => {
  try {
    // Lire le fichier photo
    const fileBuffer = Buffer.from(await file.arrayBuffer());
    // Générer un nom de fichier unique
    const fileName = `${folder}/${Date.now()}_${file.name}`;

    // Upload de l'image sur S3
    // Définir les paramètres pour l'upload dans S3
    const uploadParams = {
      Bucket: process.env.AWS_S3_BUCKET,
      Key: fileName,
      Body: fileBuffer,
      ContentType: file.type,
      ACL: "public-read",
    };
    // Créer une commande pour uploader l'objet
    const command = new PutObjectCommand(uploadParams);
    // Envoyer la commande à S3
    await s3.send(command);
    // Retourner l'URL du fichier uploadé dans la réponse
    return `https://${process.env.AWS_S3_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileName}`;
  } catch (error) {
    console.error("Erreur lors de l'upload vers S3:", error);
    throw new Error("Échec de l'upload du fichier");
  }
};

// Fonction pour supprimer un fichier de S3
export const deleteFileFromS3 = async (fileKey) => {
  try {
    const deleteParams = {
      Bucket: process.env.AWS_S3_BUCKET,
      Key: fileKey,
    };

    const command = new DeleteObjectCommand(deleteParams);
    await s3.send(command);

    console.log(`Fichier ${fileKey} supprimé de S3`);
  } catch (error) {
    console.error("Erreur lors de la suppression du fichier S3:", error);
    throw new Error("Échec de la suppression du fichier");
  }
};
