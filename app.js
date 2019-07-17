const express = require('express');
const app = express();
const morgan = require('morgan');
const dotenv = require('dotenv');
dotenv.config();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

// DB Connect
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true }, 
() => console.log('DB connected!'));
mongoose.connection.on('error', err => {
  console.log(`DB connection error : ${err.message}`);
})

// bring routes
const postRoutes = require('./routes/posts');

// middleware
app.use(morgan("dev"));
app.use(bodyParser.json());
// this routes will work as middleware
app.use('/', postRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {console.log(`Server up and running from port ${PORT}`)});