## Setting up backend

Init npm
```
npm init -y
```
Install express
```
npm i -s express
```
Install babel
```
npm i --save-dev @babel/core @babel/node @babel/preset-env
```
Create babel config file `.babelrc` and init it with one parameter (see the file).

Init express server in the `server.js` (see file) and start the server to test it:
```
npx babel-node src/server.js
```
(i) Shaun Wassel thinks that it is easier to create backend services first, and proceed with the frontend after this.

Install POST body parser node module:
```
npm i -s body-parser
```
To restart express server automatically after code change install `nodemon` 
```
npm i -save-dev nodemon
```
Run the server with 
```
npx nodemon --exec npx babel-node src/server.js
```
To optimize starting process move the line above to the `package.json --> scripts` section like:
```
...
  "scripts": {
    "start": "npx nodemon --exec npx babel-node src/server.js",
    "test": "echo \"Error: no test specified\" && exit 1"
  },
...
```

## Installing MongoDB

Install with `homebrew`:
```
brew install mongodb
```
(Already installed and run by me)

In another terminal window go to MongoDB shell
```
mongo
```
Switch to / create the "my-blog" db. Type in the mongo shell:
```
use my-blog
```
Manually enter new db entries to the db with `db.articles.insert([...])`
...

## Installing MongoDB module

Run in the backend directory 
```
npm i -s mongodb
```

## Resolve CORS

Put into `/my-blog/package.json` following string:
```
"proxy": "http://localhost:8000/",
```
Restart application in order changes in the `package.json` will be applied.

## Release application

When you're ready with the app, adjust names and run
```
npm run build
```
It will compile app into `build` folder. Copy this folder in to `my-blog-backend/src` folder.

Adjust `server.js` to use static path and redirect all unmatched requests to `*` path.