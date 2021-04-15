const express = require("express");
const db = require("./lib/db");
const cors = require("cors");

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
  db.findAll().then(posts => {
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
db.insert(req.body)
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
 let id = req.params.id;
//  res.json(idVariable);
//   console.log(idVariable);
  db.findById(id)
  .then(foundPost => {
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
  let idVar = req.params.id;
  db.updateById(idVar, req.body)
  .then(foundPost => {
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

app.delete("/posts/:id", (req, res) => {
  let idVar = req.params.id;
  db.deleteById(idVar).then((post) => {
    res.status(204);
    res.json(post);
    console.log(`Deleted post number ${idVar} `);
  }) .catch((error) => {
    res.status(500);
    res.json({
      error: "Internal server error",
    });   
});
});
  

//   // .then(newPost => {
    
    
//   //   })
//   //   .catch((error) => {
//   //     res.status(500);
//   //     res.json({
//   //       error: "Internal server error",
//   //     });  
// });

/*


We have to start the server. We make it listen on the port 4000

*/
app.listen(4000, () => {
  console.log("Listening on http://localhost:4000");
});
