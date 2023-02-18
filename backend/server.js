require('dotenv').config();
const Mongoclient = require('mongodb').MongoClient;
const express = require('express');
const app = express();
const bodyParser = require('body-parser');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));

app.use(function (req, res, next) {
  
  res.setHeader('Access-Control-Allow-Origin', 'https://jfig00.github.io');
  //res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
  res.setHeader('Access-Control-Allow-Credentials', true);
  next();
});
/**
 * This function will create a new question
 * 
 * @param {string} coll collection name string
 * @param {object} req  request to the server
 * @param {object} res  response from server
 */
app.post('/request/:coll', function (req, res) {
  var _id = new Date().getTime();
  var obj = {};
  var coll = req.params.coll;
  coll = coll[0].toUpperCase() + coll.substring(1).toLowerCase();

  obj._id = _id;
  if (!req.body.question) {
    obj.question = req.query.question;
    obj.options = req.query.options.split(',');
    obj.answer = req.query.answer.split(',');
    obj.type = req.query.type;
  } else {
    obj.question = req.body.question;
    obj.options = req.body.options.split(',');
    obj.answer = req.body.answer.split(',');
    obj.type = req.body.type;
  }
  //Connect to the mongoclient using the specified uri
  Mongoclient.connect(process.env.MONGO_URI, {
    useUnifiedTopology: true
  }, function (err, client) {
    if (err) throw err;
    //create one question using req params
    client.db("FAU_PALMACOLOGY").collection(coll).insertOne(obj, function (err) {
      if (err) throw err;
      console.log('Question created');
      client.close();
    });
    //force return status of 201 as well as the created question
    return res.status(201).send(obj);
  });
});
/**
 * This function will retrieve all collections in the database
 * 
 * @param {object} req  request to the server
 * @param {object} res  response from server
 */
app.get('/request', function (req, res) {
  //Connect to the mongoclient using the specified uri
  Mongoclient.connect(process.env.MONGO_URI).then((client) => {
    //show all collections in the database
    client.db("FAU_PALMACOLOGY").listCollections().toArray(function (err, data) {
      if (!err) {
        var allColl = [];
        for (let i = 0; i < data.length; i++) {
          allColl.push(data[i].name);
        }
        //force return status of 200 as well as all of the collections in the database
        return res.status(200).send(allColl);
      }
    });
    //Catch any error from connection and display it to the console
  }).catch((err) => {
    console.log(err);
  })
})
/**
 * This function will retrieve every question within the collection passed from the coll parameter
 * 
 * @param {string} coll collection name string
 * @param {object} req  request to the server
 * @param {object} res  response from server
 */
app.get('/request/:coll', function (req, res) {
  var coll = req.params.coll;
  coll = coll[0].toUpperCase() + coll.substring(1).toLowerCase();
  //Connect to the mongoclient using the specified uri
  Mongoclient.connect(process.env.MONGO_URI, {
    useUnifiedTopology: true
  }, (err, client) => {
    if (err) throw err;
    //show all questions in the specified collection
    client.db("FAU_PALMACOLOGY").collection(coll).find().toArray(function (err, data) {
      if (err) throw err;
      for (var i = 0; i < data.length; i++) {
        console.log(data[i].question + ' ' + data[i].options + ' ' + data[i].answer + ' ' + data[i].type);
      }
      //force return status of 200 as well as all question data in the collection
      return res.status(200).send(data);
    });
  });
});
/**
 * This function will retrieve whichever question is passed via the _id parameter
 * 
 * @param {string} coll collection name string
 * @param {number} _id  question id number
 * @param {object} req  request to the server
 * @param {object} res  response from server
 */
app.get('/request/:coll/:_id', function (req, res) {
  var _id = req.params._id;
  var coll = req.params.coll;
  coll = coll[0].toUpperCase() + coll.substring(1).toLowerCase();
  //Connect to the mongoclient using the specified uri
  Mongoclient.connect(process.env.MONGO_URI, {
    useUnifiedTopology: true
  }, (err, client) => {
    if (err) throw err;
    //show a specific question using the _id parameter from the collection passed
    client.db("FAU_PALMACOLOGY").collection(coll).find({
      "_id": Number(_id)
    }).toArray(function (err, data) {
      if (err) throw err;
      console.log(data[0].question + ' ' + data[0].options + ' ' + data[0].answer + ' ' + data[0].type);
      //force return status of 200 and all data from the question
      return res.status(200).send(data[0]);
    });
  });
});
/**
 * This function will edit the question passed to it via the _id parameter
 * 
 * @param {string} coll collection name string
 * @param {number} _id  question id number
 * @param {object} req  request to the server
 * @param {object} res  response from server
 */
app.put('/request/:coll/:_id', function (req, res) {
  var obj = {};
  var coll = req.params.coll;
  coll = coll[0].toUpperCase() + coll.substring(1).toLowerCase();

  obj._id = req.params._id;
  if (!req.body.question) {
    obj.question = req.query.question;
    obj.options = req.query.options;
    obj.answer = req.query.answer;
    obj.type = req.query.type;
  } else {
    obj.question = req.body.question;
    obj.options = req.body.options;
    obj.answer = req.body.answer;
    obj.type = req.body.type;
  }
  //Connect to the mongoclient using the specified uri
  Mongoclient.connect(process.env.MONGO_URI, {
    useUnifiedTopology: true
  }, (err, client) => {
    if (err) throw err;
    //update one question using _id parameter from the collection passed
    client.db("FAU_PALMACOLOGY").collection(coll).updateOne({
      "_id": Number(req.params._id)
    }, {
      $set: {
        "_id": Number(obj._id),
        "question": obj.question,
        "options": obj.options,
        "answer": obj.answer,
        "type": obj.type
      }
    }, function (err) {
      if (err) throw err;
      console.log("Question has been successfully updated");
      client.close();
    });
    //force return status of 201 as well as the updated data
    return res.status(201).send(obj);
  });
});
/**
 * This function will delete whichever question is passed via the _id parameter
 * 
 * @param {string} coll collection name string
 * @param {number} _id  question id number
 * @param {object} req  request to the server
 * @param {object} res  response from server
 */
app.delete("/request/:coll/:_id", function (req, res) {
  var _id = req.params._id;
  var coll = req.params.coll;
  coll = coll[0].toUpperCase() + coll.substring(1).toLowerCase();
  //Connect to the mongoclient using the specified uri
  Mongoclient.connect(process.env.MONGO_URI, {
    useUnifiedTopology: true
  }, (err, client) => {
    if (err) throw err;
    //delete one question using _id parameter from the collection passed
    client.db("FAU_PALMACOLOGY").collection(coll).deleteOne({
      "_id": Number(_id)
    }, function (err, data) {
      if (err) throw err;
      console.log(JSON.stringify(data, null, 4));
      //force return status of 200
      return res.status(200).send('Question deleted');
    });
  });
});

/*
  Collection CRUD functions
*/
app.post('/request', function (req, res) {
  //Connect to the mongoclient using the specified uri
  var obj = req.body.collectionName;


  Mongoclient.connect(process.env.MONGO_URI, {
    useUnifiedTopology: true
  }, function (err, client) {
    if (err) throw err;
    client.db("FAU_PALMACOLOGY").createCollection(obj, function(err, result) {
      if (err) {
        console.log("Exists Already")
        client.close();
        return res.status(201).send("Already Exists");
      }
      else{
        console.log('Created Collection');
        client.close();
        return res.status(201).send(obj);
      }
    });
    
   
  });
});

app.delete('/request/:coll', function (req, res) {
  //Connect to the mongoclient using the specified uri
  var coll = req.params.coll;


  Mongoclient.connect(process.env.MONGO_URI, {
    useUnifiedTopology: true
  }, function (err, client) {
    if (err) throw err;
    client.db("FAU_PALMACOLOGY").collection(coll).drop(function(err, result) {
      if (err) throw err
      
      console.log('Collection Dropped');
      client.close();
      return res.status(201).send(coll);
    });
    
   
  });
});

/*
  Profile functions
  Gets UID, points, and courses

*/
app.post('/user', function (req, res) {
  var _id = new Date().getTime();
  var obj = {};
  var obj2 = {};
  
  obj._id = _id;
  obj.points = parseInt(req.body.points);
  obj.userID = req.body.userID;
  obj.displayName = req.body.displayName;
  obj.userCourses = req.body.userCourses;
  obj.profilePicture = req.body.profilePicture;
  obj.badges = req.body.badges;
  obj.owner = req.body.owner;
  obj.admin = req.body.admin;
  /*
    Checks for duplicates
  */
    const filterByUserID = {
      userID: obj.userID,
    };

  Mongoclient.connect(process.env.MONGO_URI, {
    useUnifiedTopology: true
  }, function (err, client) {
    if (err) throw err;
    client.db("PALM_POINTS").collection("firebase").find(filterByUserID).toArray(function(err,result){
      if (err) throw err;
        if(result.length == 0){
          Mongoclient.connect(process.env.MONGO_URI).then(function(client){
            client.db("PALM_POINTS").collection("firebase").insertOne(obj);
            console.log('User profile created');    
          });
        }
        else{
          console.log("Profile already exists")
        }
    client.close();
    return res.status(201).send(obj);
    });
  });
});

app.get('/user/:userID', function (req, res) {
  var userID = req.params.userID;
  
  Mongoclient.connect(process.env.MONGO_URI, {
    useUnifiedTopology: true
  }, (err, client) => {
    if (err) throw err;
    //show a specific question using the _id parameter from the collection passed
    client.db("PALM_POINTS").collection("firebase").find({
      "userID": String(userID)
    }).toArray(function (err, data) {
      if (err) throw err;
      
      //force return status of 200 and all data from the question
      return res.status(200).send(data[0]);
    });
  });
});

app.get('/user', function (req, res) {
  Mongoclient.connect(process.env.MONGO_URI).then((client) => {
    //show all collections in the database
    client.db("PALM_POINTS").collection("firebase").find().toArray(function (err, data) {
      if (!err) {
        //force return status of 200 as well as all of the collections in the database
        return res.status(200).send(data);
      }
    });
    //Catch any error from connection and display it to the console
  }).catch((err) => {
    console.log(err);
  })
});

app.put('/user/:userID', function (req, res) {
  var userID = req.params.userID
  var obj = {};

  obj.userID = req.body.userID;
  obj.displayName = req.body.displayName;
  obj.points = req.body.points;
  obj.profilePicture = req.body.profilePicture
  obj.userCourses = req.body.userCourses;
  obj.badges = req.body.badges;
  obj.owner = req.body.owner;
  obj.admin = req.body.admin;

  console.log(obj.userCourses)
  var query = { "userID": userID };

  if(obj.userCourses){
    var newvals = { $set: { "userCourses": req.body.userCourses.split(',')} };
  }
  else if(obj.profilePicture){
    var newvals = { $set: { "profilePicture": req.body.profilePicture} };
  }
  else if(obj.badges && obj.points){
    var newvals = { $set: { "points": parseInt(req.body.points),"badges": req.body.badges} };
  }
  else if(obj.points){
    var newvals = { $set: { "points": parseInt(req.body.points)} };
  }
  else if(obj.badges){
    var newvals = { $set: { "badges": req.body.badges} };
  }
  else if(obj.owner || obj.admin){
    var newvals = { $set: { "admin": req.body.admin, "owner": req.body.owner} };
  }
  else if(obj.displayName){
    var newvals = { $set: { "displayName": req.body.displayName} };
  }
  else if(obj.profilePicture){
    var newvals = { $set: { "profilePicture": req.body.profilePicture}};
  }
  console.log(query)
  console.log(newvals)
  Mongoclient.connect(process.env.MONGO_URI, {
    useUnifiedTopology: true
  }, (err, client) => {
    if (err) throw err;
    client.db("PALM_POINTS").collection('firebase').updateOne(query,newvals, function (err, data) {

      if (err) throw err;
      console.log(data)
      return res.status(200).send(obj);
    });
  });
});
//force the app to listen at a secret port
app.listen(process.env.PORT, function () {
  console.log("Welcome to FAU Palmacology on port " + process.env.PORT + " with MONGODB " + process.env.MONGO_URI);
});

