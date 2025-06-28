import express from "express"
import dotenv from "dotenv"
import cors from "cors"

dotenv.config();

const app = express();

app.use(cors({
    origin : "http://localhost:3000",
    credentials:true,
    methods: ['GET', 'POST', 'DELETE', 'OPTIONS'],
    allowedHeaders : ['Content-Type', 'Authorization']
}));

const port = process.env.PORT || 3000

app.get("/", (req, res) => {
    res.send("Hello world")
})

app.get("/ankit", (req, res) => {
    res.send("Hey Ankit")
})

app.get("/indu", (req, res) => {
    res.send("Hey Mumma!")
})



app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})