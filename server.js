const express = require('express');
const { MongoClient, ObjectId } = require('mongodb');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 4000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public')); // Carpeta donde se encuentran tus archivos HTML

const uri = "mongodb+srv://yeibenito:Benito9109@cluster0.jfp4kwj.mongodb.net/";
const client = new MongoClient(uri);

async function connectToMongoDB() {
  try {
    await client.connect();
    console.log("Conexión a MongoDB exitosa");
  } catch (error) {
    console.error("Error al conectar a MongoDB:", error);
    throw error;
  }
}

async function checkCredentials(email, password) {
  const database = client.db("mi_base_de_datos");
  const collection = database.collection("Accesos");

  console.log("Verificando credenciales para el correo:", email);
  console.log("Contraseña proporcionada:", password);

  try {
    const user = await collection.findOne({ "E-mail": email, "Password": password });

    console.log("Usuario encontrado:", user);

    return user;
  } catch (error) {
    console.error("Error al verificar credenciales:", error);
    throw error;
  }
}

async function saveFormData(formData) {
  console.log("Datos recibidos en el servidor:", formData); // Agrega este mensaje de registro

  const database = client.db("mi_base_de_datos");

  try {
    const usuariosCollection = database.collection("Usuarios");
    const resultUsuarios = await usuariosCollection.insertOne(formData);
    if (!resultUsuarios || !resultUsuarios.ops) {
      throw new Error("Error al guardar datos en Usuarios");
    }
    console.log("Datos almacenados correctamente en Usuarios:", resultUsuarios.ops);

    const usuarioId = resultUsuarios.insertedId;

    const accesosCollection = database.collection("Accesos");
    const resultAccesos = await accesosCollection.insertOne({
      "_id": usuarioId,
      "E-mail": formData.E-mail,
      "Num_Documento": formData.Num_Documento,
      "Password": formData.Password,
      "Perfil": formData.Perfil
    });
    if (!resultAccesos || !resultAccesos.ops) {
      throw new Error("Error al guardar datos en Accesos");
    }
    console.log("Datos almacenados correctamente en Accesos:", resultAccesos.ops);

    return { resultUsuarios, resultAccesos };
  } catch (error) {
    console.error("Error al almacenar los datos:", error.message);
    throw error;
  }
}

async function editUserInDatabase(userId, updatedData) {
  const database = client.db("mi_base_de_datos");

  try {
    const usuariosCollection = database.collection("Usuarios");
    const accesosCollection = database.collection("Accesos");

    const resultUsuarios = await usuariosCollection.updateOne(
      { _id: ObjectId(userId) },
      { $set: updatedData }
    );
    const resultAccesos = await accesosCollection.updateOne(
      { _id: ObjectId(userId) },
      { $set: updatedData }
    );

    console.log("Usuario actualizado correctamente en la base de datos");
    return { resultUsuarios, resultAccesos };
  } catch (error) {
    console.error("Error al editar usuario en la base de datos:", error.message);
    throw error;
  }
}

app.post('/submit', async (req, res) => {
  const formData = req.body;
  try {
    console.log("Datos recibidos:", formData); // Agrega este mensaje de registro
    const result = await saveFormData(formData);
    res.status(200).json({ message: "Datos almacenados correctamente" });
  } catch (error) {
    console.error("Error al almacenar los datos:", error);
    res.status(500).json({ message: "Error al almacenar los datos" });
  }
});

app.put('/usuarios/:id', async (req, res) => {
  const { id } = req.params;
  const updatedData = req.body;
  try {
    const result = await editUserInDatabase(id, updatedData);
    res.status(200).json({ message: "Usuario actualizado correctamente" });
  } catch (error) {
    console.error("Error al actualizar usuario:", error);
    res.status(500).json({ message: "Error al actualizar usuario" });
  }
});

app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await checkCredentials(email, password);
    console.log("Información del usuario:", user); // Agrega este mensaje de registro
    if (user) {
      let redirectTo = 'index.html';
      if (user.Perfil === 'Admin') {
        redirectTo = 'Administrador.html';
      }
      console.log("Redirigiendo a:", redirectTo); // Agrega este mensaje de registro
      res.status(200).json({ redirectTo });
    } else {
      res.status(401).send('Credenciales incorrectas');
    }
  } catch (error) {
    console.error("Error al verificar credenciales:", error);
    res.status(500).send('Error al verificar credenciales');
  }
});

async function startServer() {
  await connectToMongoDB();
  app.listen(PORT, () => {
    console.log(`Servidor en ejecución en el puerto ${PORT}`);
  });
}

startServer().catch(console.error);
