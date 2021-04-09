import express from 'express';
import bodyParser from 'body-parser';
import {MongoClient} from 'mongodb';
import path from 'path';

const withDb = async (operations, res) => {
  try {
    const client = await MongoClient.connect('mongodb://localhost:27017', { useNewUrlParser: true });
    const db = client.db('my-blog');

    await operations(db, res);

    client.close();
  }
  catch (err) {
    res.status(err.status).send(err.message);
  }
}
const app = express();

app.use(express.static(path.join(__dirname, '/build')));
app.use(bodyParser.json());

app.get('/api/articles/:name', async (req, res) => {
  withDb(async (db) => {
    const artName = req.params.name;
    const art = await db.collection('articles').findOne({name: artName});

    res.status(200).json(art);
  }, res);
});
app.post('/api/articles/:name/upvote', async (req, res) => {
  withDb(async (db) => {
    const artName = req.params.name;
    const art = await db.collection('articles').findOne({name: artName});

    await db.collection('articles').updateOne({name: artName}, {
      '$set': {
        upvotes: art.upvotes + 1
      }
    });
    const artUpd = await db.collection('articles').findOne({name: artName});
    res.status(200).json(artUpd);
  }, res)
});
app.post('/api/articles/:name/add-comment', (req, res) => {
  withDb(async (db) => {
    const {username, text} = req.body;
    const artName = req.params.name;

    const art = await db.collection('articles').findOne({name: artName});

    await db.collection('articles').updateOne({name: artName}, {
      '$set': {
        comments: art.comments.concat({username, text})
      }
    });
    const artUpd = await db.collection('articles').findOne({name: artName});

    res.status(200).json(artUpd);
  }, res);
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '/build/index.html'));
});

app.listen(8000, () => console.log('Listening on port 8000...'));