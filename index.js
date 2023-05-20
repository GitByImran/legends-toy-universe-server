const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

require("dotenv").config();
const app = express();

app.use(cors());
app.use(express.json());

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

    // user toys

    app.get("/toys", async (req, res) => {
      let query = {};
      if (req.query?.email) {
        query = { email: req.query.email };
      }
      const result = await toyCollections.find(query).toArray();
      res.send(result);
    });

    // all toys

    app.get("/toys", async (req, res) => {
      const getAllToys = toyCollections.find({});
      const result = await getAllToys.toArray();
      res.send(result);
    });

    app.post("/toys", async (req, res) => {
      const addToy = req.body;
      const result = await toyCollections.insertOne(addToy);
      res.send(result);
    });

    app.patch("/toys/:id", async (req, res) => {
      const updatedetails = req.body;
      console.log(updatedetails);
    });

    app.delete("/toys/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await toyCollections.deleteOne(query);
      res.send(result);
    });

    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("app is running");
});

app.listen(process.env.PORT || 5000, () => {
  console.log(`app is listening from ${process.env.PORT || 5000}`);
});
