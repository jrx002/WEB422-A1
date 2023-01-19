/*********************************************************************************
*  WEB422 – Assignment 1
*  I declare that this assignment is my own work in accordance with Seneca  Academic Policy.  
*  No part of this assignment has been copied manually or electronically from any other source
*  (including web sites) or distributed to other students.
* 
*  Name: Steven Jiang Student ID: 171437213 Date: January 15th, 2023
*  Cyclic Link: https://vast-pajamas-newt.cyclic.app
*
********************************************************************************/ 
//PACKAGE CONFIGURATIONS
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv').config();
const path = require('path');

//MIDDLEWARE CONFIGURATIONS
const app = express();
const HTTP_PORT = process.env.PORT || 8080;
const MoviesDB = require("./modules/moviesDB.js");
const db = new MoviesDB();
app.use(cors());
app.use(express.json());

/*ROUTINGS*/
//Default
app.get('/', (req,res)=>{
  res.json({message: 'API Listening'});
});

//GET movies based on page, perPage and title
app.get('/api/movies', (req,res)=>{
  if(req.query.page && req.query.perPage) {
    db.getAllMovies(req.query.page, req.query.perPage, req.query.title).then((data)=>{
      if(data.length > 0) res.status(200).json(data);
      else res.status(204).json({message: 'No Content!'});
    })
  }
  else res.status(404).json({message: 'Missing page or perPage parameter!'});
});

//GET; get movie by id
app.get('/api/movies/:_id',(req,res)=>{
  db.getMovieById(req.params._id).then((data)=>{
    res.status(200).json(data);
  }).catch((err)=>{
    res.status(500).json({error: err + ' :Movie cannot be found!'});
  })
});

//POST; add new movie using the request body data
app.post('/api/movies', (req,res)=>{
  db.addNewMovie(req.body).then((data)=>{
    res.status(201).json({message: `New movie with movie id: ${data._id} has been added!`});
  }).catch(()=>{
    res.status(500).json({error: err + ' :Movie cannot be created!'});
  })
});

//PUT; accept movie id and update the id
app.put('/api/movies/:_id',(req,res)=>{
  if(req.params._id.length > 0) {
    db.updateMovieById(req.body, req.params._id).then(()=>{
      res.status(200).json({message: `Movie id: ${req.params._id} updating success!`});
    }).catch((err)=>{
      res.status(404).json({error: err + ' :Movie cannot be found!'});
    })
  }
  else res.status(500).json({error: 'Empty movie id!'});
});

//DELETE; delete movie by id
app.delete('/api/movies/:_id',(req,res)=>{
  db.deleteMovieById(req.params._id).then(()=>{
    res.status(200).json({message: `Movie id: ${req.params._id} deletion success!`});
  }).catch((err)=>{
    res.status(404).json({error:err + ' :Movie cannot be found!'});
  })
})


db.initialize(process.env.MONGODB_CONN_STRING).then(()=>{
  app.listen(HTTP_PORT, ()=>{
      console.log(`Server Listening on: ${HTTP_PORT}`);
  });
}).catch((err)=>{
  console.log(err);
});
