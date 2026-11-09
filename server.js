const express = require('express');
const mongoose = require('mongoose');

const app = express();
const port = 3001;

app.use(express.json());

const connectarDB = async () => {
  try {
    await mongoose.connect('', {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });

    console.log('MongoDB connected');
  }
  catch (error) {
    console.log(error);
    process.exit(1);
  }
};
connectarDB();

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});