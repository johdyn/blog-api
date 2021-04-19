require("dotenv").config();
const express = require("express");
const db = require("./lib/db");
const cors = require("cors");
const mongoose = require("mongoose");
const Post = require("./models/post");

/*
  We create an express app calling
  the express function.
*/
const app = express();

/*
  We setup middleware to:
  - parse the body of the request to json for us
  https://expressjs.com/en/guide/using-middleware.html
*/
app.use(express.json());
app.use(cors());
app.use((req, res, next) => {
const { method, url} = req;
console.log("My custom middleware");
  console.log(`${method} ${url}`);
  next();
});
/*
  Endpoint to handle GET requests to the root URI "/"
*/
app.get("/", (req, res) => {
  res.json({
    "/posts": "read and create new posts",
    "/posts/:id": "read, update and delete an individual post",
  });
});

app.get("/posts", (req, res) => {
  Post.find().then(posts => {
  res.status(200);
  res.json(posts);
  }).catch(error => {
    res.status(500);
    res.json({
      error: `Internal ServerError: ${error}`,
    
  })
});
});

app.post("/posts", (req, res) => {
Post.create(req.body)
.then(newPost => {
  res.status(200);
  res.json(newPost);
})
.catch((error) => {
  res.status(500);
  res.json({
    error: "Internal server error",
  });
});
 
});

app.get("/posts/:id", (req, res) => {
 let { id } = req.params;
  // db.findById(id)
  Post.findById(id).then(foundPost => {
    res.json(foundPost);
    res.status(200);
    })
    .catch((error) => {
  res.status(500);
  res.json({
    error: "Internal server error",
  });      
    });
});

app.patch("/posts/:id", (req, res) => {
  let { id } = req.params;
  Post.findByIdAndUpdate(id, req.body, { new: true }).then(updatePost => {
    res.json(updatePost);
    res.status(200);
    }).catch((error) => {
      res.status(500);
      res.json({
        error: "Internal server error",
      });   
});
});

app.delete("/posts/:id", (req, res) => {
  const { id } = req.params;
  Post.findByIdAndDelete(id)
  .then((post) => {
    res.status(204);
    res.json(post);

    console.log(`Deleted post number ${idVar} `);
  }).catch((error) => {
    res.status(500);
    res.json({
      error: "Internal server error",
    });   
});
});
  



/*


We have to start the server. We make it listen on the port 4000

*/

const { PORT, MONGO_URL } = process.env;

/*
With process.env we can access all environmental variables set in the system
The envrionment where the code runs, so e.g. local machine or Heroku
Underneath we are connecting to the env var MONGO_URL
*/

mongoose.connect(MONGO_URL, {useNewUrlParser: true, useUnifiedTopology: true});

const mongodb = mongoose.connection;

mongodb.on("open", () => {
app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
});