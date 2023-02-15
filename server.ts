const path = require('path');

const http = require('http');
const port = 3000;

const express = require('express');
const session = require('express-session');
const app = express();

const lobbyRouter = require('./server/lobby').router;
const wssHelper = require('./server/ws')

app.use(express.json());

let server = http.createServer(app);

const sessionParser = session({
    saveUninitialized: true,
    secret: "testsecretchangeonprod", //CHANGE ON PRODUCTION PLEASE
    resave: false
});

app.use(sessionParser);

let wss = wssHelper(server, sessionParser);



const indexPath = path.join(__dirname, 'build');
app.use(express.static(indexPath));

app.use('/api/lobby', lobbyRouter);


app.get('*', (req: any , res: any)=>{
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
})

server.listen(port);
console.log(`Server running on port ${port}`);