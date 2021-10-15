console.log('running')

const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const MongoClient = require('mongodb').MongoClient
const ObjectId = require('mongodb').ObjectID


const url = "mongodb+srv://yoda:babyyoda@cluster0.ca0uj.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
const dbName = "twitter";

app.set('view engine', 'ejs')
app.use(bodyParser.urlencoded({extended: true})) 
app.use(bodyParser.json())
app.use(express.static('public'))

app.listen(3000, () => {
    console.log('listening')
    MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true }, (error, client) => {
        if(error) {
            throw error;
        }
        db = client.db(dbName);
        console.log("Connected to `" + dbName + "`!");
    });
});

app.get('/', function(req, res) {
    db.collection('tweets').find().toArray((err, result) => {
        if (err) return console.log(err)
        res.render('index.ejs', {tweets: result})
        console.log(result)
      })
  })

  app.get('/search', function(req, res) {
    db.collection('tweets').find({name: req.query.user}).toArray((err, result) => {
        if (err) return console.log(err)
        res.render('index.ejs', {tweets: result})
        console.log(result)
      })
  })


app.post('/tweet', (req, res) => {
    let tweet = req.body.tweet
    let name = req.body.name
    // console.log(tweet)
    // console.log(name)

    db.collection('tweets').insertOne({ 
        tweet: req.body.tweet, 
        like: 0,
        name: req.body.name,
    }, (err, result) => {
        if (err) return console.log(err)
        console.log('saved to database')
        res.redirect('/')
    })
})

app.put('/tweet/like', (req, res) => {
    db.collection('tweets')
    .findOneAndUpdate({
        _id: ObjectId(req.body.id)
    }, {
      $inc: {
        like: 1,
      }
    }, {
      sort: {_id: -1},
      upsert: true 
    }, (err, result) => {
      if (err) return res.send(err)
      res.send(result)
    })
  })
   
  app.delete('/tweet', (req, res) => {
    db.collection('tweets').findOneAndDelete({
        _id:ObjectId(req.body.id)
    },  (err, result) => {
      if (err) return res.send(500, err)
      res.send('Message deleted!')
    })
  })



