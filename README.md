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

## Deploy application to Amazon cloud

Create new repository on the GitHub and push your code there.

Login into AWS Management Console, go to Instances / EC2, select from the list Linux 2 AMI (top one), select it, you'll se the list of instances. Pres review and launch, check details and click launch.

Creat a new key pair and download it and launch instance(s). Move downloaded `*.pem` file to the `.ssh` dir in your home dir. Change permissions of the `*.pem` file to 400. Than make ssh connection to the AWS instance with the downloaded key:
copy in your AWS console instance details "Public IPv4 DNS" address (something like `ec2-35-175-229-58.compute-1.amazonaws.com`). 
```
ssh -i ~/.ssh/<your-key-name>.pem ec2-user@<Public IPv4 DNS>
```
If everything is ok, you should see ssh prompt like 
```

       __|  __|_  )
       _|  (     /   Amazon Linux 2 AMI
      ___|\___|___|

https://aws.amazon.com/amazon-linux-2/
No packages needed for security; 2 packages available
Run "sudo yum update" to apply all updates.
[ec2-user@ip-172-31-38-87 ~]$ 
```
Install git on the Amazon instance:
```
$ sudo yum install git
```
Install Node 
(check AWS docs how to do this: https://docs.aws.amazon.com/sdk-for-javascript/v3/developer-guide/setting-up-node-on-ec2-instance.html):
```
$ curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.34.0/install.sh | bash
$ . ~/.nvm/nvm.sh
$ nvm install node
$ npm instal -g npm@latest
```

Install MongoDB to the Amazon istance.
(Check MongDB documentation for it: https://docs.mongodb.com/manual/tutorial/install-mongodb-on-amazon/):
Select Linux 2 instance, create file `/etc/yum.repos.d/mongodb-org-4.4.repo`:
```
$ sudo nano /etc/yum.repos.d/mongodb-org-4.4.repo
```
past following text into nano editor:
```
[mongodb-org-4.4]
name=MongoDB Repository
baseurl=https://repo.mongodb.org/yum/amazon/2/mongodb-org/4.4/x86_64/
gpgcheck=1
enabled=1
gpgkey=https://www.mongodb.org/static/pgp/server-4.4.asc
```
save it by pressing Ctrl+O, Enter, Ctrl+X.

Install packages:
```
$ sudo yum install -y mongodb-org
```
Start MongoDB service:
```
$ sudo service mongod start
```
Go to the MongoDb shell and initialize db: 
```
$ mongo
> use my-blog
> db.articles.insert([{
name: 'learn-react',
upvotes: 0,
comments: []
}, {
name: 'learn-angular',
upvotes: 0,
comments: []
},{
name: 'my-cv',
upvotes: 0,
comments: []
}])
```
Enter.

Clone repository to the Amazon instance:
```
git clone https://github.com/stimg/my-blog.git
```
Go to `my-blog` dir and install node modules, ten install `forever` package to be sure that your service runs continuosly.
```
$ npm install -g forever
```
Start server
```
$ forever start -c "npm start" .
```
Check if server is running:
```
$ forever list
```
You should see there something like this:
```
...
data:    [0] ID2j npm start /home/ec2-user/my-blog 2272    2279    /home/ec2-user/.forever/ID2j.log 0:0:0:8.082
... 
```
Set port redirection from 80 to 8000:
```
$ sudo iptables -t nat -A PREROUTING -p tcp --dport 80 -j REDIRECT --to-ports 8000
```
Go to Amazon console, check to wich security group your instance belongs (sg-090722e243c197ab0 (launch-wizard-2)).

Go to Security group find and select your instance in the list.  

Select "Inbound rules" tab, click "Edit inbound rules" and add rule
HTTP TCP 80 Anywhere
Save it.

Go back ti instances, and click "open address" by "Public IPv4 DNS" label. 
You should see my-blog website.