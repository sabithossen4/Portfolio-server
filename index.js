const express = require('express');
const cors = require('cors');
require('dotenv').config()
const { MongoClient, ServerApiVersion } = require('mongodb');

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.o1uqrsp.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;


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

    const contactCollection = client.db('portfolioDB').collection('contacts');

    // 🔥 POST endpoint to save contact form data
    app.post('/contact/email', async (req, res) => {
      const { name, email, subject, message } = req.body;

      // 🔒 Validate fields
      if (!name || !email || !subject || !message) {
        return res.status(400).json({ message: "All fields are required." });
      }

      const contactDoc = {
        name,
        email,
        subject,
        message,
        createdAt: new Date()
      };

      const result = await contactCollection.insertOne(contactDoc);
      res.status(200).json({ message: "Message sent successfully", insertedId: result.insertedId });
    });


    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });
    // console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get('/', (req, res) => {
  res.send('Wellcome Portfolio')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})