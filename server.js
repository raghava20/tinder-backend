import express from "express"
import { MongoClient } from "mongodb";
import Cors from "cors"


//App Config
const app = express();
const PORT = process.env.PORT || 8001;

const MONGO_URL = process.env.MONGO_URL;


//Middlewares
app.use(express.json())
app.use(Cors())

//DB config
// mongoose.connect(MONGO_URL, {
//     useNewUrlParser: true,
//     useCreateIndex: true,
//     useUnifiedTopology: true,
// })

async function createConnect() {
    const client = new MongoClient(MONGO_URL);
    await client.connect();
    console.log("Mongodb connected!");
    return client;
}
export const client = await createConnect();


//API Endpoints
app.get('/', (req, res) => res.status(200).send("Hello World"))

app.post('/tinder/cards', async (req, res) => {
    const dbCard = req.body;

    await client.db("tinder").collection("cards").insertMany(dbCard, (error, data) => {
        if (error) {
            res.status(500).send(error)
        } else {
            res.status(201).send(data)
        }
    })

})

app.get('/tinder/cards', async (req, res) => {
    const dbCard = req.query;

    const result = await client.db("tinder").collection("cards").find(dbCard).toArray();

    res.send(result)
    // if (result) {
    //     res.status(201).send(result)
    // } else {
    //     res.status(500).send(error)
    // }


})

//Listener
app.listen(PORT, () => console.log(`App started on localhost: ${PORT}`));