const express = require('express');
const port = process.env.PORT || 5000;
const mongoose = require('mongoose');

// INIT APP
const app = express();

// Middelware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Connect To db
const { mongoURI } = require('./config/keys');

mongoose
  .connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to db'))
  .catch(err => console.log(err));

// use Routes
app.use('/api/users', require('./routes/api/users'));
app.use('/api/profile', require('./routes/api/profile'));
app.use('/api/posts', require('./routes/api/posts'));

app.listen(port, () => console.log(`Server running on port ${port}`));
