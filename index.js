const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

const posts = require('./data/posts.js');
const users = require('./data/users.js');

// Body parser middlware
// we have access to the parsed data within our routes.
// The parsed data will be located in "req.body".
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// New logging middleware to help us keep track of
// requests during testing!
app.use((req, res, next) => {
  const time = new Date();

  console.log(
    `-----
${time.toLocaleTimeString()}: Received a ${req.method} request to ${req.url}.`
  );
  if (Object.keys(req.body).length > 0) {
    console.log('Containing the data:');
    console.log(`${JSON.stringify(req.body)}`);
  }
  next();
});

//GET route to get all user data
app.get('/api/users', (req, res) => {
  res.json(users);
});

// GET router to get a user by ID
app.get('/api/users/:id', (req, res, next) => {
  // Using the Array.find method to find the user with the same id as the one sent with the request
  const user = users.find((u) => u.id == req.params.id);
  if (user) {
    res.json(user);
  } else {
    // If the user doesn't exist
    next();
  }
});

// POST Create a User
app.post('/api/users', (req, res) => {
  // Within the POST request we will create a new user.
  // The client will pass us data and we'll push that data into our users array.
  // the user data that we want to create is inside the req.body
  if (req.body.name && req.body.username && req.body.email) {
    if (users.find((u) => u.username === req.body.username)) {
      // The above returns an object, we found an existing user with the same username. So it's a no go
      res.json({ error: 'Username Already Taken' });
      return;
    }

    // If the code gets to this point, we are good to create the user
    const user = {
      id: users.length + 1,
      name: req.body.name,
      username: req.body.username,
      email: req.body.email,
    };

    users.push(user);
    res.json(user);
  } else {
    res.status(400).json({ error: 'Insufficient Data' });
  }
});

//PATCH Update a User
app.patch('/api/users/:id', (req, res, next) => {
  // Within the PATCH request route, we allow the client
  // to make changes to an existing user in the database.
  const user = users.find((u, i) => {
    if (u.id == req.params.id) {
      for (const key in req.body) {
        // Applying the updates within the req.body to the in-memory user
        users[i][key] = req.body[key];
      }
      return true;
    }
  });

  if (user) {
    res.json(user);
  } else {
    next();
  }
});

// Delete a user
app.delete('/api/users/:id', (req, res) => {
  // The DELETE request route simply removes a resource.
  const user = users.find((u, i) => {
    if (u.id == req.params.id) {
      users.splice(i, 1);
      return true;
    }
  });

  if (user) res.json(user);
  else next();
});

//=========================================

//GET route to get all post data
app.get('/api/posts', (req, res) => {
  res.json(posts);
});

// GET route to get a post by ID
app.get('/api/posts/:id', (req, res, next) => {
  // Using the Array.find method to find the user with the same id as the one sent with the request
  const post = posts.find((p) => p.id == req.params.id);
  if (post) {
    res.json(post);
  } else {
    // If the post doesn't exist
    next();
  }
});

// POST Create a Post
app.post('/api/posts', (req, res) => {
  // Within the POST request we will create a new post.
  // The client will pass us data and we'll push that data into our psots array.
  // the post data that we want to create is inside the req.body
  if (req.body.userId && req.body.title && req.body.content) {
    // If the code gets to this point, we are good to create the post
    const post = {
      id: posts.length + 1,
      userId: req.body.userId,
      title: req.body.title,
      content: req.body.content,
    };

    posts.push(post);
    res.json(post);
  } else {
    res.status(400).json({ error: 'Insufficient Data' });
  }
});

//PATCH Update a Post
app.patch('/api/posts/:id', (req, res, next) => {
  // Within the PATCH request route, we allow the client
  // to make changes to an existing user in the database.
  const post = posts.find((p, i) => {
    if (p.id == req.params.id) {
      for (const key in req.body) {
        // Applying the updates within the req.body to the in-memory post
        posts[i][key] = req.body[key];
      }
      return true;
    }
  });

  if (post) {
    res.json(post);
  } else {
    next();
  }
});

// DELETE Delete a post
app.delete('/api/posts/:id', (req, res) => {
  // The DELETE request route simply removes a resource.
  const post = posts.find((p, i) => {
    if (p.id == req.params.id) {
      posts.splice(i, 1);
      return true;
    }
  });

  if (post) res.json(post);
  else next();
});

app.get('/', (req, res) => {
  res.send('Work in progress');
});

app.use((req, res) => {
  res.status(404);
  res.json({ error: 'Resource Not Found' });
});

app.listen(PORT, () => {
  console.log('Server running on port: ' + PORT);
});