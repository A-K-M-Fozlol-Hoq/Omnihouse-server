const express = require('express')
const cors = require("cors");
const bodyParser = require("body-parser");
const fileUpload = require("express-fileupload");
const { MongoClient,ObjectId } = require("mongodb");

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
    const draftsCollection = client.db("omniHouse").collection("drafts");

    app.post("/createEvent", (req, res) => {
      const { type, title, location, people, startTime, endTime, description, color }= req.body;
      eventsCollection
        .insertOne({ type, title, location, people, startTime, endTime, description, color })
        .then((result) => {
          console.log(result);
          res.send(result);
        })
        .catch((err) => {
          console.log(err);
        });
    });

    app.post("/createDraftEvent", (req, res) => {
      const { type, title, location, people, startTime, endTime, description, color }= req.body;
      draftsCollection
        .insertOne({ type, title, location, people, startTime, endTime, description, color })
        .then((result) => {
          console.log(result);
          res.send(result);
        })
        .catch((err) => {
          console.log(err);
        });
    });
    
    app.get("/getActiveEvents", (req, res) => {
      let returnArray=[];
      let index=0;
      eventsCollection.find({ }).toArray((err, events) => {
        if (!err) {
          index = index + 1;
          if (events && events.length > 0) {
            // console.log(events)
            for (let i = 0; i < events.length; i++) {
              const event = events[i];
              const eventDate= new Date(event.startTime)
              const currentDate= new Date();
              if(eventDate>currentDate){
                returnArray.push(event)
              }
            }
            res.send(returnArray)
          }  else{
            res.send(returnArray)
          }
        }
      });
    });  

    app.get("/getOldEvents", (req, res) => {
      let returnArray=[];
      let index=0;
      eventsCollection.find({ }).toArray((err, events) => {
        if (!err) {
          index = index + 1;
          if (events && events.length > 0) {
            // console.log(events)
            for (let i = 0; i < events.length; i++) {
              const event = events[i];
              const eventDate= new Date(event.startTime)
              const currentDate= new Date();
              if(eventDate<currentDate){
                returnArray.push(event)
              }
            }
            res.send(returnArray)
          }  else{
            res.send(returnArray)
          }
        }
      });
    }); 
    
    app.get("/getAllEvents", (req, res) => {
      eventsCollection.find({ }).toArray((err, events) => {
        if (!err) {
          if (events && events.length > 0) {
            res.send(events)
          }  else{
            res.send([])
          }
        }
      });
    }); 

    app.get("/getDrafts", (req, res) => {
      draftsCollection.find({ }).toArray((err, events) => {
        if (!err) {
          res.send(events)
        }else{
          // Should handle error
          res.send([])
        }
      });
    });  

    app.delete("/deleteEventByID", (req, res) => {
      const { id }= req.body;
      console.log(id)
      eventsCollection
        .deleteOne({'_id': ObjectId(`${id}`)})
        .then((result) => {
          console.log(result);
          res.send(result);
        })
        .catch((err) => {
          console.log(err);
        });
    });

    app.delete("/deleteDraftByID", (req, res) => {
      const { id }= req.body;
      console.log(id)
      draftsCollection
        .deleteOne({'_id': ObjectId(`${id}`)})
        .then((result) => {
          console.log(result);
          res.send(result);
        })
        .catch((err) => {
          console.log(err);
        });
    });


    
    
    console.log("database connected successfully");
      // client.close();
  });

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})