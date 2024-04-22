const { MongoClient } = require('mongodb');

// URI de conexión con la contraseña reemplazada por una variable
const uri = "mongodb+srv://yeibenito:Benito9109@cluster0.jfp4kwj.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

// Crea un cliente MongoClient
const client = new MongoClient(uri);

async function main() {
  try {
    // Conecta el cliente al servidor
    await client.connect();

    console.log("Conexión a MongoDB exitosa");

    // Realiza operaciones con la base de datos
    // Ejemplo: Insertar un documento en una colección
    const database = client.db("mi_base_de_datos");
    const collection = database.collection("mi_coleccion");
    await collection.insertOne({ nombre: "Ejemplo" });

    console.log("Documento insertado correctamente");
  } catch (e) {
    console.error("Error al conectar a MongoDB:", e);
  } finally {
    // Asegura que el cliente se cierre cuando termines o haya un error
    await client.close();
  }
}

main().catch(console.error);
