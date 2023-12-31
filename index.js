const express = require('express');
const cors = require('cors');
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()
const app = express();


// middlewares
app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_USER_PASS}@cluster0.gbdj4eh.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        // await client.connect();
        // Send a ping to confirm a successful connection

        const bistroBossDB = client.db("bistroBossDB");
        const menuCollection = bistroBossDB.collection("menuCollection");
        const reviewCollection = bistroBossDB.collection("reviewCollection");
        const cartCollection = bistroBossDB.collection("cartCollection");

        app.get("/menu", async (req, res) => {
            const query = {};
            const cursor = await menuCollection.find(query).toArray();
            res.send(cursor)
        });
        app.get("/reviews", async (req, res) => {
            const query = {};
            const cursor = await reviewCollection.find(query).toArray();
            res.send(cursor)
        });

        // cart collection 
        app.get("/carts", async (req, res) => {
            const email = req.query.email;
            const query = {email};
            const cursor = await cartCollection.find(query).toArray();
            res.send(cursor);
        });

        app.post("/carts", async (req, res) => {
            const cartItem = req.body;
            const result = await cartCollection.insertOne(cartItem);
            res.send(result);
        });

        app.delete("/carts/:id", async(req, res) => {
            const id = req.params.id;
           
            const query = { _id: new ObjectId(id) };
            const result = await cartCollection.deleteOne(query);
            res.send(result);
        });









        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);


app.get("/", (req, res) => {
    res.send("Bistro Boss server is okay!")
});

app.listen(port, () => {
    console.log(`Bistro Boss server in running on port : ${port}`);
});