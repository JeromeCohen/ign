const express = require('express');
var mysql = require('mysql');
const app = express();
const port = 3000 || process.env.PORT;

app.get('/', (req, res) => res.send('Hello World!'));
app.listen(port, () => console.log(`Example app listening on port ${port}!`));
