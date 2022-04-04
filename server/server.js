const express = require('express');

// set up Apollo server
const { ApolloServer } = require('apollo-server-express');
const { authMiddleWare } = require('./utils/auth');
const path = require('path');
const db = require('./config/connection');

//import schema folder
const { typeDefs, resolvers } = require('./schemas');


const app = express();
const PORT = process.env.PORT || 3001;

// nwe Apollo server
const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: authMiddleWare,
});

//apply middleware
server.applyMiddleware({ app });

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// if we're in production, serve client/build as static assets
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));
}

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/build/index.html'));
});

db.once("open", () => {
  app.listen(PORT, () => {
    console.log(`API server running on port http://localhost:${PORT}!`);
  
  });
});
