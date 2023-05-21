const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

require("dotenv").config();
const app = express();

app.use(cors());
app.use(express.json());
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  next();
});

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster1.jwgax72.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    const toyCollections = client.db("toyDB").collection("toys");

    app.get("/toys", async (req, res) => {
      const query = req.query.email ? { email: req.query.email } : {};

      let sort = {};
      if (req.query.sort === "price") {
        sort = { price: req.query.order === "desc" ? -1 : 1 };
      }

      const result = await toyCollections
        .find(query)
        .limit(20)
        .sort(sort)
        .toArray();

      res.send(result);
    });

    app.post("/toys", async (req, res) => {
      const addToy = req.body;
      const result = await toyCollections.insertOne(addToy);
      res.send(result);
    });

    app.put("/toys/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const update = { $set: req.body };
      const result = await toyCollections.updateOne(query, update);
      res.send(result);
    });

    app.delete("/toys/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await toyCollections.deleteOne(query);
      res.send(result);
    });

    console.log(
      "Connected to MongoDB! Server is listening on port " +
        (process.env.PORT || 5000)
    );
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }
}

run().catch(console.error);

app.get("/", (req, res) => {
  res.send("App is running");
});

app.listen(process.env.PORT || 5000);
