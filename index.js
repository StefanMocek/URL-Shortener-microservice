require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require("body-parser")
const isUrl = require("is-url")
const mongoose = require("mongoose");
const urlMongo = require("./models/url");

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

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

app.post("/api/shorturl", (req,res)=>{
  let url = req.body.url;
  let licznik = 1;
  console.log(url);
  if (!isUrl(url)){
    return res.json({ error: 'invalid url' })
    }
  let odpowiedz = {}
  odpowiedz['original_url']= url

  urlMongo.findOne({})
    .sort({numer: 'desc'})
    .exec((error,result)=>{
      if (!error && result !=undefined){
        licznik = result.numer + 1
      }
      if (!error){
        urlMongo.findOneAndUpdate(
          {adres: url},
          {adres: url, numer:licznik},
          {new:true, upsert: true},
          (err, result)=>{
            if (!err){
              odpowiedz['short_url'] = result.numer
              res.json(odpowiedz) 
            }
          }
        )
      }
    })
})

app.get("/api/shorturl/:data", (req,res)=>{
  let redir = ""
  console.log(req.params['data'])
  urlMongo.findOne({numer: req.params['data']}, (err,finded)=>{
    if (err) {return console.error(err)}
    redir = finded["adres"]
  console.log(redir)  
  res.redirect(redir)
  })
})


const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
