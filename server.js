const express = require('express');
const { MongoClient, ObjectId } = require('mongodb');
const bodyParser = require('body-parser');
require('dotenv').config(); // Para cargar las variables de entorno desde .env

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public')); // Carpeta donde se encuentran tus archivos HTML

const uri = process.env.MONGO_URI; // Obtener URI de conexión desde .env
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function connectToMongoDB() {
  try {
    await client.connect();
    console.log("Conexión a MongoDB exitosa");
  } catch (error) {
    console.error("Error al conectar a MongoDB:", error);
    throw error;
  }
}

// Función para verificar las credenciales en la colección Usuarios
async function checkCredentials(email, password) {
  const database = client.db("mi_base_de_datos");
  const collection = database.collection("Usuarios");

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
  console.log("Datos recibidos en el servidor:", formData);

  try {
    const database = client.db("mi_base_de_datos");
    const usuariosCollection = database.collection("Usuarios");

    const resultUsuarios = await usuariosCollection.insertOne(formData);
    const usuarioId = resultUsuarios.insertedId;

    if (!resultUsuarios || !resultUsuarios.ops) {
      throw new Error('Error al almacenar los datos en Usuarios');
    }

    console.log("Datos almacenados correctamente en Usuarios:", resultUsuarios.ops);
    console.log("ID del usuario insertado:", usuarioId);

    return { resultUsuarios };
  } catch (error) {
    console.error("Error al almacenar los datos:", error.message);
    throw error;
  }
}
async function editUserInDatabase(userId, updatedData) {
  const database = client.db("mi_base_de_datos");
  const usuariosCollection = database.collection("Usuarios");

  try {
    const result = await usuariosCollection.updateOne(
      { _id: new ObjectId(userId) },
      { $set: updatedData }
    );

    if (result.matchedCount === 1) {
      console.log("Usuario actualizado correctamente en la base de datos");
      return { success: true, message: "Usuario actualizado correctamente" };
    } else {
      console.error("Usuario no encontrado");
      throw new Error("Usuario no encontrado");
    }
  } catch (error) {
    console.error("Error al actualizar usuario en la base de datos:", error.message);
    throw error;
  }
}

app.get('/usuarios', async (req, res) => {
  const database = client.db("mi_base_de_datos");
  const usuariosCollection = database.collection("Usuarios");

  try {
    const users = await usuariosCollection.find().toArray();
    res.status(200).json(users);
  } catch (error) {
    console.error("Error al obtener usuarios:", error);
    res.status(500).json({ message: "Error al obtener usuarios" });
  }
});

async function editUserInDatabase(userId, updatedData) {
  const database = client.db("mi_base_de_datos");

  try {
    const usuariosCollection = database.collection("Usuarios");
    const user = await usuariosCollection.findOne({ _id: new ObjectId(userId) });

    if (!user) {
      const errorMessage = "Usuario no encontrado";
      console.error(errorMessage);
      throw new Error(errorMessage);
    }

    const result = await usuariosCollection.updateOne(
      { _id: new ObjectId(userId) },
      { $set: updatedData }
    );

    if (result.matchedCount === 1) {
      console.log("Usuario actualizado correctamente en la base de datos");
      return result;
    } else {
      const errorMessage = "Error al actualizar usuario en la base de datos";
      console.error(errorMessage);
      throw new Error(errorMessage);
    }
  } catch (error) {
    console.error("Error al editar usuario en la base de datos:", error.message);

    if (error.message === "Usuario no encontrado") {
      return { success: false, message: "Usuario no encontrado" };
    } else {
      return { success: false, message: "Error al actualizar usuario" };
    }
  }
}

async function deleteUserFromDatabase(userId) {
  const database = client.db("mi_base_de_datos");

  try {
    const usuariosCollection = database.collection("Usuarios");
    const result = await usuariosCollection.deleteOne({ _id: new ObjectId(userId) });
    if (result.deletedCount === 1) {
      console.log("Usuario eliminado correctamente de la base de datos");
      return result;
    } else {
      throw new Error("Usuario no encontrado");
    }
  } catch (error) {
    console.error("Error al eliminar usuario de la base de datos:", error.message);
    throw error;
  }
}
app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await checkCredentials(email, password);

    if (!user) {
      res.status(401).json({ message: "Credenciales inválidas" });
      return;
    }

    const { Perfil } = user;

    if (Perfil === 'Admin') {
      res.status(200).json({ redirectTo: '/Administrador.html' });
    } else {
      res.status(200).json({ redirectTo: '/pagina2.html' });
    }
  } catch (error) {
    console.error("Error al iniciar sesión:", error);
    res.status(500).json({ message: "Error al iniciar sesión" });
  }
});


app.post('/submit', async (req, res) => {
  const formData = req.body;
  try {
    console.log("Datos recibidos en '/submit':", formData);

    // Llama a la función saveFormData para almacenar los datos
    const result = await saveFormData(formData);

    console.log("Datos almacenados correctamente en MongoDB:", result);

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
    await editUserInDatabase(id, updatedData);
    res.status(200).json({ message: "Usuario actualizado correctamente" });
  } catch (error) {
    console.error("Error al actualizar usuario:", error);
    if (error.message === "Usuario no encontrado") {
      res.status(404).json({ message: "Usuario no encontrado" });
    } else {
      res.status(500).json({ message: "Error al actualizar usuario" });
    }
  }
});
app.get('/usuarios/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const user = await getUserById(id); // Llama a una función para obtener el usuario por su ID
    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }
    res.status(200).json(user);
  } catch (error) {
    console.error("Error al obtener usuario:", error);
    res.status(500).json({ message: "Error al obtener usuario" });
  }
});
async function getUserById(userId) {
  const database = client.db("mi_base_de_datos");
  const usuariosCollection = database.collection("Usuarios");

  try {
    const user = await usuariosCollection.findOne({ _id: new ObjectId(userId) });
    return user;
  } catch (error) {
    console.error("Error al obtener usuario por ID:", error);
    throw error;
  }
}

app.delete('/usuarios/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await deleteUserFromDatabase(id);
    res.status(200).json({ message: "Usuario eliminado correctamente" });
  } catch (error) {
    console.error("Error al eliminar usuario:", error);
    if (error.message === "Usuario no encontrado") {
      res.status(404).json({ message: "Usuario no encontrado" });
    } else {
      res.status(500).json({ message: "Error al eliminar usuario" });
    }
  }
});

async function startServer() {
  try {
    await connectToMongoDB();
    app.listen(PORT, () => {
      console.log(`Servidor en ejecución en el puerto ${PORT}`);
    });
  } catch (error) {
    console.error("Error al iniciar el servidor:", error);
  }
}

startServer();
