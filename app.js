const express = require('express');
const app = express();
const morgan = require('morgan');
const dotenv = require('dotenv');
dotenv.config();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const expressValidator = require('express-validator');

// DB Connect
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true }, 
() => console.log('DB connected!'));
mongoose.connection.on('error', err => {
  console.log(`DB connection error : ${err.message}`);
})

// bring routes
const postRoutes = require('./routes/posts');
const authRoutes = require('./routes/auth');

// middleware
app.use(morgan("dev"));
app.use(bodyParser.json());
app.use(expressValidator()); //hanya expressValidator versi 5.3.1 yg bisa menjadi function
// this routes will work as middleware
app.use('/', postRoutes);
app.use('/', authRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {console.log(`Server up and running from port ${PORT}`)});