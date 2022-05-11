const express = require('express');
const { read } = require('fs');
const https = require('https');
const bodyparser = require("body-parser");
const mongoose = require('mongoose');
const app = express()
app.set('view engine', 'ejs');
app.use(express.static('./public'));
app.use(bodyparser.urlencoded({
  extended: true
}));


mongoose.connect("mongodb://localhost:27017/log",
  { useNewUrlParser: true, useUnifiedTopology: true });
const logSchema = new mongoose.Schema({
  id: Number,
  likes: Number,
  dislikes: Number
});
const poklogsModel = mongoose.model("poklogs", logSchema);

app.get('/log/poklogs', function (req, res) {
  poklogsModel.find({}, { _id: 0, id: 1, likes: 1, dislikes: 1 }, function (err, logs) {
    if (err) {
      console.log("Error " + err);
    } else {
      res.json(logs);
    }

  });
})

app.get('/log/poklogs/:id', function (req, res) {
  poklogsModel.find({ "id": req.params.id }, { _id: 0, id: 1, likes: 1, dislikes: 1 }, function (err, logs) {
    if (err) {
      console.log("Error " + err);
    } else {
      res.json(logs);
    }

  });
})


app.put('/log/insert', function (req, res) {
  poklogsModel.create({
    "id": req.query.id,
    "likes": req.query.likes,
    "dislikes": req.query.dislikes

  }, function (err, data) {
    if (err) {
      console.log("Error " + err);
    } else {
      res.send(`inserted ${req.query.id}, ${req.query.likes}, ${req.query.dislikes}`);
    }

  });
})


app.get('/log/like/:id', function (req, res) {
  poklogsModel.updateOne({
    "id": req.params.id
  }, {
    $inc: { "likes": 1 }
  }, function (err, data) {
    if (err) {
      console.log("Error " + err);
    } else {
      poklogsModel.find({ 'id': req.params.id }, { _id: 0, id: 1, likes: 1 }, function (err, logs) {
        if (err) {
          console.log("Error " + err);
        } else {
          res.send(logs);
        }

      });
    }
  });
})


app.get('/log/dislike/:id', function (req, res) {
  poklogsModel.updateOne({
    "id": req.params.id
  }, {
    $inc: { "dislikes": 1 }
  }, function (err, data) {
    if (err) {
      console.log("Error " + err);
    } else {
      poklogsModel.find({ 'id': req.params.id }, { _id: 0, id: 1, dislikes: 1 }, function (err, logs) {
        if (err) {
          console.log("Error " + err);
        } else {
          res.send(logs);
        }

      });
    }
  });
})


app.get('/log/remove/:id', function (req, res) {
  poklogsModel.remove({
    "id": req.params.id
  }, function (err, data) {
    if (err) {
      console.log("Error " + err);
    } else {

      res.send(`Remove id= ${req.params.id} log record`);
    }

  });
})



const pokSchema = new mongoose.Schema({
  "id": Number,
  "name": String,
  "weight": Number,
  "height": Number,
  "species": String
});
const poksModel = mongoose.model("poks", pokSchema);

app.get('/pok/:id', function (req, res) {
  poksModel.find({ id: req.params.id }, { _id: 0, id: 1, name: 1, weight: 1, height: 1, species: 1 }, function (err, poks) {
    if (err) {
      console.log("Error " + err);
    } else {
      res.json(poks);
    }
  });
})


app.get('/profile/:id', function (req, res) {

  poksModel.find({ "id": req.params.id }, { _id: 0, id: 1, name: 1, weight: 1, height: 1, species: 1 }, function (err, properties) {
    if (err) {
      console.log("Error " + err);
    } else {
      res.render("profile.ejs", {
        "id": properties[0].id,
        "name": properties[0].name,
        "weight": properties[0].weight,
        "height": properties[0].height,
        "species": properties[0].species
      });
    }
  });
});










// app.get('/profile/:id', function (req, res) {


//   https.get(`https://pokeapi.co/api/v2/pokemon/${req.params.id}`, (resp) => {
//     let data = '';

//     // A chunk of data has been received.
//     resp.on('data', (chunk) => {
//       data += chunk;
//     });

//     // The whole response has been received. Print out the result.
//     resp.on('end', () => {
//       // console.log(JSON.parse(data).explanation);
//       let properties = JSON.parse(data);

//       res.render("profile.ejs", {
//         "id": properties.id,
//         "name": properties.name,
//         "weight": properties.weight,
//         "height": properties.height,
//         "species": properties.species.name
//       });

//     });

//   }).on("error", (err) => {
//     console.log("Error: " + err.message);
//   })

// });












app.listen(5000, function (err) {
  if (err)
    console.log(err);
});





