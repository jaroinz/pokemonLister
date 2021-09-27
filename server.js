/*
* Used by heroku to start angular
* for now we provide only Spanish translation. So, dist contains only /es folder
*
* steps to produce and execute the bundle
*
* - at package.json ensure the tasks are set like the following:
* start : node server.js
* build : ng build
*
* - at server.js
* the line app.use(requireHTTPS); is uncommented
*
* */

function requireHTTPS(req, res, next) {
  // The 'x-forwarded-proto' check is for Heroku
  console.log( `req ${req.get('host')}`);
  if (!req.secure && req.get('x-forwarded-proto') !== 'https') {
    console.log( `req ${req.url}`);
    return res.redirect('https://' + req.get('host') + req.url);
  }
  next();
}

const express = require('express');
const app = express();
//console.log(`express: ${express}`)

//comment the following for localhost testing
app.use(requireHTTPS);

app.use(express.static('./dist/pokEvolution'));

app.get('/*', (req, res) =>
  res.sendFile('index.html', {root: 'dist/pokEvolution/'}),
);

console.log(`progressing`)

const port = process.env.PORT || 8080;

console.log(`listening at port: ${port}`)

app.listen(port);

console.log(`ready`)
