const express = require('express');
const app = express();
const port = 3000; // Puerto en el que se ejecutará el servidor

// Ruta de inicio
app.get('/', (req, res) => {
  res.sendFile(__dirname+'/public/index.html');
 //   res.end('Hola mundo ewaewqeq');   
});
app.use('/src', express.static(__dirname + '/src'));
app.use('/node_modules', express.static(__dirname + '/node_modules'));

// Iniciar el servidor
app.listen(port, () => {
  console.log(`El servidor está escuchando en el puerto ${port}`);
});
