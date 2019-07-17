const express = require('express');
const app = express();

app.get('/', (req, res) => {
  res.send("Hello World from node js")
})


const PORT = 3000;
app.listen(PORT, () => {console.log(`Server up and running from port ${PORT}`)});