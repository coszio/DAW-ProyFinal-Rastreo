const express = require('express');
const path = require('path');

let PORT = process.env.PORT || 3000;

let app = express();

app.use(express.json());
app.set(express.static('public'))

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, "index.html"));
})

app.listen(PORT, () => {
    console.log('Listening on port: ' + PORT);
})