const urlMongo = require("../models/url");
const isUrl = require("is-url")

const starter = (req, res) => {
    res.sendFile(process.cwd() + '/views/index.html');
  }

const getter = (req,res) => {
    let redir = ""
    console.log(req.params['data'])
    urlMongo.findOne({numer: req.params['data']}, (err,finded)=>{
      if (err) {return console.error(err)}
      redir = finded["adres"]
    console.log(redir)  
    res.redirect(redir)
    })
  }

const poster = (req,res) => {
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
  }

module.exports = {getter, poster, starter}