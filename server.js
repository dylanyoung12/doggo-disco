// Express Setup
const express = require('express');
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.static('public'));

// Knex Setup
const env = process.env.NODE_ENV || 'development';
const config = require('./knexfile')[env];
const knex = require('knex')(config);

// bcrypt setup
let bcrypt = require('bcrypt');
const saltRounds = 10;

// jwt setup
const jwt = require('jsonwebtoken');
let jwtSecret = process.env.jwtSecret;
if (jwtSecret === undefined) {
  console.log("You need to define a jwtSecret environment variable to continue.");
  knex.destroy();
  process.exit();
}


// Verify token
const verifyToken = (req, res, next) => {
  const token = req.headers['authorization'];
  if (!token) return res.status(403).send({ error: 'No token provided.' });
  jwt.verify(token, jwtSecret, function(err, decoded) {
    if (err) return res.status(500).send({ error: 'Failed to authenticate token.' });
    // if everything good, save to request for use in other routes
    req.userID = decoded.id;
    next();
  });
}


// Get my account
app.get('/api/me', verifyToken, (req, res) => {
  knex('users').where('id', req.userID).first().select('username', 'name', 'id').then(user => {
    res.status(200).json({ user:user });
  }).catch(error => {
    res.status(500).json({ error });
  });
});

// Login
app.post('/api/login', (req, res) => {
  if (!req.body.username || !req.body.password) return res.status(400).send();
  knex('users').where('username',req.body.username).first().then(user => {
    if (user === undefined) {
      res.status(403).send("Invalid credentials");
      throw new Error('abort');
    }
    return [bcrypt.compare(req.body.password, user.hash),user];
  }).spread((result,user) => {
    if (result) {
      let token = jwt.sign({ id:user.id }, jwtSecret, {
        expiresIn: 86400 // expires in 24 hours
      });
      res.status(200).json({user:{username:user.username,name:user.name,id:user.id}, token:token});
    }
    else res.status(403).send("Invalid credentials");
    return;
  }).catch(error => {
    if (error.message !== 'abort') {
      console.log(error);
      res.status(500).json({ error });
    }
  });
});
// Register
app.post('/api/users', (req, res) => {
  if (!req.body.password || !req.body.username || !req.body.name) return res.status(400).send();
  knex('users').where('username',req.body.username).first().then(user => {
    if (user !== undefined) {
      res.status(409).send("User name already exists");
      throw new Error('abort');
    }
    return bcrypt.hash(req.body.password, saltRounds);
  }).then(hash => {
    return knex('users').insert({hash:hash, username:req.body.username, name:req.body.name, role: 'user'});
  }).then(ids => {
    return knex('users').where('id',ids[0]).first().select('username','name','id');
  }).then(user => {
    let token = jwt.sign({ id:user.id }, jwtSecret, {
      expiresIn: 86400 // expires in 24 hours
    });
    res.status(200).json({user:user, token:token});
    return;
  }).catch(error => {
    if (error.message !== 'abort') {
      console.log(error);
      res.status(500).json({ error });
    }
  });
});

// Get Favorites
app.get('/api/users/:id/favorites', (req, res) => {
  let id = parseInt(req.params.id);
  let offset = 0;
  if (req.query.offset) offset = parseInt(req.query.offset);
  let limit = 50;
  if (req.query.limit) limit = parseInt(req.query.limit);
  knex('users').join('favorites', 'users.id', 'favorites.user_id')
  .where('users.id', id)
  .orderBy('created', 'desc')
  .limit(limit)
  .offset(offset)
  .select('favorites.id', 'favorites.name', 'path', 'created').then(favorites => {
    res.status(200).json({ favorites:favorites })
  }).catch(error => {
    res.status(500).json({ error });
  });
});
// Add Favorite
app.post('/api/users/:id/favorites', verifyToken, (req, res) => {
  let id = parseInt(req.params.id);
  if (id !== req.userID) {
    res.status(403).send();
    return;
  }
  knex('users').where('id', id).first().then(user => {
    return knex('favorites').insert({ user_id:id, name:req.body.name, path:req.body.path, created: new Date() });
  }).then(ids => {
    return knex('favorites').where('id', ids[0]).first();
  }).then(doggo => {
    res.status(200).json({ doggo:doggo });
    return;
  }).catch(error => {
    console.log(error);
    res.status(500).json({ error });
  });
});
// Remove Favorite
app.delete("/api/users/:id/favorites/:dog_id", verifyToken, (req, res) => {
  // id of the user
  let id = parseInt(req.params.id);
  // check this // id
  if (id !== req.userID) {
    res.status(403).send();
    return;
  }
  // id of the dog
  let dog_id = parseInt(req.params.dog_id);
  // make sure both exist
  knex('users').where('id', id).first().then(user => {
    return knex('favorites').where('id', dog_id).first();
  }).then(dog => {
    // delete the dog from the favorites table
    return knex('favorites').where('id', dog_id).first().del();
  }).then(ids => {
    res.sendStatus(200);
    return;
  }).catch(error => {
    console.log(error);
    res.status(500).json({ error });
  });
});


app.listen(3002, () => console.log('Server listening on port 3002!'));
