const express = require('express');
const mongoose = require('mongoose')
require('dotenv').config();
const cors = require('cors');

const urlRoutes = require('./routes/urlRoutes');

const app = express();

app.use(express.json());
app.use(cors())
const PORT = process.env.PORT || 3000;

main().catch(err => console.log(err));

async function main() {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('db connected')
}

app.use('/api', urlRoutes)

app.listen(PORT, ()=> console.log(`server is running at port ${PORT}`))