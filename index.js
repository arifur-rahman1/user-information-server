const express = require('express')
const { MongoClient, ServerApiVersion } = require('mongodb');
const cors = require('cors')
const app = express()
const port = process.env.PORT || 5000

app.use(cors());
app.use(express.json());


// passowrd : 42k64CUedBp24XjE




const uri = "mongodb+srv://admin1:42k64CUedBp24XjE@cluster0.uk2cuoh.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try{
        await client.connect();
        const informationCollection = client.db('informationlist').collection('information');

                //post
        app.post('/information', async (req, res) => {
            const newInformation = req.body;
            const result = await informationCollection.insertOne(newInformation)
            res.send(result);
        })

          // get all data 
          app.get('/information', async (req, res) => {
            const query = {};
            const cursor = informationCollection.find(query);
            const info = await cursor.toArray();
            res.send(info);
        })




    }
    finally{

    }
}

run().catch(console.dir);

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})