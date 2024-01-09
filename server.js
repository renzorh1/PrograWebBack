const express = require('express');
const bodyParser = require("body-parser")
const path = require('path');


const Libro = require('./api/libro')
const Usuario = require('./api/Usuario')
const Reserva = require('./api/reserva')



const app = express()
const port = 3080

/* Esta es la parte del Middleware */
app.use(express.static(path.join(__dirname, './static')));
app.use(bodyParser.json());


app.use('/api/Libro', Libro);
app.use('/api/Usuario', Usuario);
app.use('/api/Reserva', Reserva);


app.get('/', (req,res) => {
  res.sendFile(path.join(__dirname, './static/index.html'));
});

app.listen(port, () => {
    console.log(`Server escuchando en el port::${port}`);
});

