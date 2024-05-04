const express = require('express');
const { MongoClient, ObjectId } = require('mongodb');
const bodyParser = require('body-parser');
<<<<<<< HEAD
require('dotenv').config(); // Para cargar las variables de entorno desde .env

const app = express();
const PORT = process.env.PORT || 3000;
=======

const app = express();
const PORT = process.env.PORT || 4000;
>>>>>>> faa1cdb0cc1cfb5c14d7034c902b41b14916aa0c

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public')); // Carpeta donde se encuentran tus archivos HTML

<<<<<<< HEAD
const uri = process.env.MONGO_URI; // Obtener URI de conexión desde .env
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
=======
const uri = "mongodb+srv://yeibenito:Benito9109@cluster0.jfp4kwj.mongodb.net/";
const client = new MongoClient(uri);
>>>>>>> faa1cdb0cc1cfb5c14d7034c902b41b14916aa0c

async function connectToMongoDB() {
  try {
    await client.connect();
    console.log("Conexión a MongoDB exitosa");
  } catch (error) {
    console.error("Error al conectar a MongoDB:", error);
    throw error;
  }
}

<<<<<<< HEAD
// Función para verificar las credenciales en la colección Usuarios
async function checkCredentials(email, password) {
  const database = client.db("mi_base_de_datos");
  const collection = database.collection("Usuarios");
=======
async function checkCredentials(email, password) {
  const database = client.db("mi_base_de_datos");
  const collection = database.collection("Accesos");
>>>>>>> faa1cdb0cc1cfb5c14d7034c902b41b14916aa0c

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
<<<<<<< HEAD
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
=======
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
>>>>>>> faa1cdb0cc1cfb5c14d7034c902b41b14916aa0c
  } catch (error) {
    console.error("Error al almacenar los datos:", error.message);
    throw error;
  }
}
<<<<<<< HEAD
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
=======
>>>>>>> faa1cdb0cc1cfb5c14d7034c902b41b14916aa0c

async function editUserInDatabase(userId, updatedData) {
  const database = client.db("mi_base_de_datos");

  try {
    const usuariosCollection = database.collection("Usuarios");
<<<<<<< HEAD
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

=======
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
>>>>>>> faa1cdb0cc1cfb5c14d7034c902b41b14916aa0c

app.post('/submit', async (req, res) => {
  const formData = req.body;
  try {
<<<<<<< HEAD
    console.log("Datos recibidos en '/submit':", formData);

    // Llama a la función saveFormData para almacenar los datos
    const result = await saveFormData(formData);

    console.log("Datos almacenados correctamente en MongoDB:", result);

=======
    console.log("Datos recibidos:", formData); // Agrega este mensaje de registro
    const result = await saveFormData(formData);
>>>>>>> faa1cdb0cc1cfb5c14d7034c902b41b14916aa0c
    res.status(200).json({ message: "Datos almacenados correctamente" });
  } catch (error) {
    console.error("Error al almacenar los datos:", error);
    res.status(500).json({ message: "Error al almacenar los datos" });
  }
});

<<<<<<< HEAD

=======
>>>>>>> faa1cdb0cc1cfb5c14d7034c902b41b14916aa0c
app.put('/usuarios/:id', async (req, res) => {
  const { id } = req.params;
  const updatedData = req.body;
  try {
<<<<<<< HEAD
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
=======
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
>>>>>>> faa1cdb0cc1cfb5c14d7034c902b41b14916aa0c
  }
});

async function startServer() {
<<<<<<< HEAD
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
=======
  await connectToMongoDB();
  app.listen(PORT, () => {
    console.log(`Servidor en ejecución en el puerto ${PORT}`);
  });
}

startServer().catch(console.error);
>>>>>>> faa1cdb0cc1cfb5c14d7034c902b41b14916aa0c
