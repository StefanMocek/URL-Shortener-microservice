require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require("body-parser")
const mongoose = require("mongoose");
const urlRoute = require("./routes/urlRouter")
const {starter} = require("./controllers/urlController")

const app = express();
const uri = process.env.MONGO_URI;

app.use(cors());
app.use(bodyParser.urlencoded({extended:false}))
app.use('/public', express.static(`${process.cwd()}/public`));

mongoose.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})

const connection = mongoose.connection;
connection.once("open", ()=>{
    console.log("MongoDB database connection extablished");
})

app.get('/', starter);

app.use("/api/shorturl", urlRoute)

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
