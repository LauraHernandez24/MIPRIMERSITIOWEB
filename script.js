const formulario = document.getElementById('formulario');

formulario.addEventListener('submit', async (event) => {
  event.preventDefault();

  const formData = new FormData(formulario);
  const datosUsuario = Object.fromEntries(formData.entries());

  try {
    const respuesta = await fetch('/submit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(datosUsuario)
    });

    if (respuesta.ok) {
      alert('Datos almacenados correctamente en la base de datos');
      formulario.reset(); // Opcional: Limpiar el formulario después de enviar los datos
    } else {
      console.error('Error al almacenar datos en la base de datos:', respuesta.statusText);
      alert('Error al almacenar datos en la base de datos');
    }
  } catch (error) {
    console.error('Error al almacenar datos en la base de datos:', error);
    alert('Error al almacenar datos en la base de datos');
  }
});
