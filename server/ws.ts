
const ws = require('ws');
const uuid = require('uuid');

let lobby = require('./lobby').tempGameDirectiory;

interface User{
    name?: string,
    UID: string,
    type: "player1" | "player2" | "spectator" | undefined;
}


function createWSS(server : any, sessionParser : any){
    let wss = new ws.WebSocketServer({
        noServer: true
    })

    // accuiring user ID

    server.on('upgrade', (request : any, socket : any, head : any) =>{
        sessionParser(request, {}, () => {
            if(!request.session.userId){
                const id = uuid.v4();
                request.session.userId = id;
                console.log(`Session for ${id} created!`)
            }

            console.log('Session parsed');
            request.session.save((err : any) =>{
                wss.handleUpgrade(request, socket, head, (ws : any) =>{
                    wss.emit('connection', ws, request);
                })
            })
        })
    });

    wss.on('connection', function (ws : any, request : any ){
        
        const sess = request.session;
        const userId = request.session.userId;
        let lobbyCode = request.url.substring(1); //FIXME: implement accuisition of lobby code from request body

        let joiningUser : User = {UID: userId, type: undefined}; 

        // joins lobby;
        if(lobbyCode in lobby){
            let joinResult = lobby[lobbyCode].join(joiningUser, ws);
    
            if(joinResult){
                //FIXME: sendjson
                console.log("user is joined!");
                let x = {
                    type: 'join',
                    result: true,
                    player1: lobby[lobbyCode].GetPlayer1(),
                    player2: lobby[lobbyCode].GetPlayer2(),
                    spectators: Object.entries(lobby[lobbyCode].GetSpectators())
                };
                ws.send(JSON.stringify(x));
                lobby[lobbyCode].BroadcastState();
            }
            else{
                //FIXME: send json
                console.log("user failed to join D:");
                ws.send(JSON.stringify({
                    type: 'join',
                    result: false
                }));
                ws.close();
            }
        }
        else{
            console.log("Lobby does't exist");
            ws.send(JSON.stringify({
                type: 'join',
                result: false
            }));
            ws.close();
        }

        ws.on('message', (message : any)=>{
            lobby[lobbyCode].MessageHandler(joiningUser, message);
        })
        ws.on('close', (message : any)=>{
            console.log("ws closed");
            if(lobbyCode in lobby) lobby[lobbyCode].CloseUser(joiningUser, sess);
            else{
                sess.destroy();
            }
        });


    });

    return wss;
}

module.exports = createWSS;