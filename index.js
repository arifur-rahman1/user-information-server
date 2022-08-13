const express = require('express')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const cors = require('cors')
const app = express()
const port = process.env.PORT || 5000

app.use(cors());
app.use(express.json());

const nodemailer = require("nodemailer");


// passowrd : 42k64CUedBp24XjE




const uri = "mongodb+srv://admin1:42k64CUedBp24XjE@cluster0.uk2cuoh.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


function informationSent(mailInfo) {

  const {name,phoneNumber,email,hobbies}=mailInfo
  console.log(mailInfo);

        // sending mail via nodemailer

        const msg = {
          from: 'testingdeveloper431@gmail.com', // sender address
          to: "info@redpositive.in", // list of receivers
          subject: `sending information`, // Subject line
          text: "hey you got a info", // plain text body
          html: `
          <h1>Name: ${name}</h1>
          <p>Email: ${email}</p>
          <p>Phone Number: ${phoneNumber}</p>
          <p>Hobies: ${hobbies}</p>
          `
          
           ,
          
        }
        
        nodemailer.createTransport({
          service:'gmail',
      auth: {
        user: "testingdeveloper431@gmail.com",
        pass: "yvpridhsifmgohzm", 
      },
      port: 587,
      host: "smtp.ethereal.email",
    
        })
        .sendMail(msg,(err)=>{
          if (err) {
            return console.log('Error occures',err);
          }
          else{
            return console.log("email sent");
          }
        })

}

async function run() {
    try{
        await client.connect();
        const informationCollection = client.db('informationlist').collection('information');
        const sendingMailCollection = client.db('informationlist').collection('mailsender');

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

            // delete a info
            app.delete('/information/:id', async (req, res) => {
              const id = req.params.id;
              const query = { _id: ObjectId(id) };
              const result = await informationCollection.deleteOne(query);
              res.send(result);
          })

           //Update information
        app.put('/information/:id', async (req, res) => {
          const id = req.params.id;
          const data = req.body;
          const filter = { _id: ObjectId(id) };
          const options = { upsert: true };
          const updatedDoc = {
              $set: {
                  name:data.name,
                  phoneNumber:data.phoneNumber,
                  email:data.email,
                  hobbies:data.hobbies

              }
          };
          const result = await informationCollection.updateOne(filter, updatedDoc, options);
          res.send(result);

      })


        app.get('/findingid',async(req,res)=>{
          const id = req.query._id;
          const query={id:id}
          const findinfo= await informationCollection.find(query).toArray()
          res.send(findinfo)
        })

      // post to mail sending collection
      app.post('/mailsender', async (req, res) => {
        const mailInfo = req.body;
        console.log(mailInfo);
        informationSent(mailInfo);
        const result = await sendingMailCollection.insertOne(mailInfo)
        res.send(result);
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