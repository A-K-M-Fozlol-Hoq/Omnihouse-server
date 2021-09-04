const express = require('express')
const cors = require("cors");
const bodyParser = require("body-parser");
const fileUpload = require("express-fileupload");
const { MongoClient } = require("mongodb");

const port = process.env.PORT || 5000
const app = express();
require("dotenv").config();

//middleWars
app.use(cors());
app.use(bodyParser.json());
app.use(fileUpload());

//database connection
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.nlclv.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true, 
  useUnifiedTopology: true
});

app.get('/', (req, res) => {
  res.send('Hello World!')
})

client.connect((err) => {
    const eventsCollection = client.db("omniHouse").collection("events");

    
    
    console.log("database connected successfully");
      // client.close();
  });

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})