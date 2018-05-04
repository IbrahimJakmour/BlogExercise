const express = require('express');
const bodyParser = require('body-parser')
const app = express();

app.set('view engine', 'ejs')

app.use(bodyParser.urlencoded({
    extended: true
}))

var db

const MongoClient = require('mongodb').MongoClient
const ObjectId = require('mongodb').ObjectId


// MongoClient.connect('mongodb://user1:user1@ds111410.mlab.com:11410/exercisedatabase', (err, database) => {
//     if (err) {
//         return err
//     }
//     db = database
//     app.listen(3000, () => {
//         console.log('listening on 3000')
//     })
// })

MongoClient.connect('mongodb://blog-exercice:123456@ds115420.mlab.com:15420/blog-exercice', (err, client) => {
  if (err) return console.log(err)
  db = client.db('blog-exercice') 
  app.listen(3000, () => {
    console.log('listening on 3000')
  })
})


app.get('/', (req, res) =>{
    db.collection('posts').find().toArray(function(err, results) {
        res.render('index.ejs', {
            posts: results
        })  
    })
})
//sorting//
app.get('/default', (req, res) =>{
    db.collection('posts').find().sort({'_id': 1}).toArray(function(err, results) {
        res.render('index.ejs', {
            posts: results
        })  
    })
})

app.get('/title', (req, res) =>{
    db.collection('posts').find().sort({'title': 1}).toArray(function(err, results) {
        res.render('index.ejs', {
            posts: results
        })  
    })
})

app.get('/date', (req, res) =>{
    db.collection('posts').find().sort({'date': 1}).toArray(function(err, results) {
        res.render('index.ejs', {
            posts: results
        })  
    })
})
//end of sorting

app.post('/add', (req, res) => {
    db.collection('posts').save(req.body, (err, result) => {
        if (err) 
            return console.log(err)
        res.redirect('/')
    })
})

app.all('/edit/:id', (req, res) => {
    const {
        id
    } = req.params
    
    const _id = ObjectId(decodeURI(id))

    db.collection('posts').findOne({
        _id
    }, function (err, result) {
        if (err)
            return err
        res.render('update.ejs', {
            posts: result
        })
    })
})

app.post('/update/:id', (req, res) => {
    const {
        id
    } = req.params
    
    const _id = ObjectId(decodeURI(id))

    db.collection('posts').findOneAndUpdate({
        _id : _id
    },
    {
        $set: {
            title: req.body.title,
            text: req.body.text
        }    
    }, function (err, result) {
        if (err)
            return err
        res.redirect('/')
    })
})

app.all('/delete/:id', (req, res) => {
    const {
        id
    } = req.params
    
    const _id = ObjectId(decodeURI(id))
    
    db.collection('posts').remove({
        _id
    }, function (err, result) {
        if (err)
            return err
        res.redirect('/')
    })
})