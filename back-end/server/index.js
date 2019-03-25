const express = require('express');
const mysql = require('mysql');
const app = express();
const port = process.env.PORT || 3000;

var knex = require('knex')({
  client: 'mysql',
  connection: {
    host : 'us-cdbr-iron-east-03.cleardb.net',
    user : 'ba46ee82f0feb2',
    password : 'c02c1f42',
    database : 'heroku_7e1867d4621a886'
  }
});

app.get('/', (req, res) => res.send('A simple service to find content based on authors or tags'));

app.get('/author/:name', (req, res) => {
  const name = req.params.name.toLowerCase().replace("_", " ");
  query = `SELECT articles.content_id, articles.headline
           FROM articles
           INNER JOIN author_relations ar ON ar.content_id=articles.content_id
           INNER JOIN authors ON ar.author_id=authors.author_id
           WHERE authors.name=?`
  knex.raw(query, [name]).then((result) => {
    res.send(result);
  });
});

app.get('/tag/:tag1/:tag2?/:tag3?', (req, res) => {
  let where = 'WHERE ';
  let params = [];
  Object.keys(req.params).forEach(tag => {
    if (req.params[tag] != null) {
      where += 'tags.tag=? '
      params.push(req.params[tag]);
    }
  });

  query = `SELECT *
           FROM articles
           INNER JOIN tag_relations tr ON tr.content_id=articles.content_id
           INNER JOIN tags ON tr.tag_id=tags.tag_id
           ${where}`
  knex.raw(query, params).then((result) => {
    res.send(result);
  });
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
