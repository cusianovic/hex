import { join } from "path";
import { isReturnStatement } from "typescript";
const express = require('express');
const router = express.Router();
const WebSocket = require('ws');
const Game = require('./game');

let { generateNCharAlphaNumeric } = require('../util/alphanumeric.js');

let tempGameDirectiory : {[key: string]: Lobby} = {};


interface User{
    name?: string,
    UID: string,
    type: "player1" | "player2" | "spectator" | undefined,
    leaveHandler?: ReturnType<typeof setTimeout>;
}

class Lobby{

    LID: string;
    player1 : User | undefined;
    player2 : User | undefined;
    sockets: Record<string, WebSocket>;
    spectators: Record<string, User>;
    leaveHandlers: Record<string, ReturnType<typeof setTimeout>>;
    game: typeof Game | undefined;
    inGame: boolean;

    constructor(player1?: User, player2?: User){

        this.player1 = player1;
        this.player2 = player2;
        this.LID = generateNCharAlphaNumeric(5);
        this.sockets = {};
        this.spectators = {};
        this.leaveHandlers = {};
        this.inGame = false;
    }
    
    GetPlayer1(){
        return this.player1;
    }

    GetPlayer2(){
        return this.player2;
    }

    GetSpectators(){
        return this.spectators;
    }

    MoveTo(player: User, type: User["type"]){
        if(player.type == type){
            console.log("Can not switch, you are already that type");
        }

        else if(type == "player1"){
            if(this.player1 != undefined) return;
            if(this.player2?.UID == player.UID){
                this.player2 = undefined;
            }
            else if(player.UID in this.spectators){
                delete this.spectators[player.UID];
            }

            this.player1 = player;
        }

        else if(type == "player2"){
            if(this.player2 != undefined) return;
            if(this.player1?.UID == player.UID){
                this.player1 = undefined;
            }
            else if(player.UID in this.spectators){
                delete this.spectators[player.UID];
            }
            this.player2 = player;
        }

        else if(type == "spectator"){
            if(player.UID in this.spectators) return;
            if(this.player1?.UID == player.UID) this.player1 = undefined;
            else if(this.player2?.UID == player.UID) this.player2 = undefined;

            this.spectators[player.UID] = player;
        }

    }

    join(player : User, ws : WebSocket){

        if(player.UID in this.sockets){
            this.sockets[player.UID].send(
                JSON.stringify({
                    type: "close",
                    reason: "Opened on another socket"
                })
            )
            
            console.log("closing old connection");
            
            let tempWS = this.sockets[player.UID];
            this.sockets[player.UID] = ws;
        }

        if(this.player1?.UID == player.UID) {
            this.sockets[this.player1.UID] = ws;
            clearTimeout(this.leaveHandlers[this.player1.UID]);
            delete this.leaveHandlers[this.player1.UID];
            return true;
        }
        else if(this.player2?.UID == player.UID){
            this.sockets[this.player2.UID] = ws;
            clearTimeout(this.leaveHandlers[this.player2.UID]);
            delete this.leaveHandlers[this.player2.UID];
            return true;
        }

        if(this.player1 == undefined)
        {
            player.type = "player1";
            this.player1 = player;
            this.sockets[this.player1.UID] = ws;
            this.BroadcastState();
            return true;
        }
        else if(this.player2 == undefined){
            player.type = "player2";
            this.player2 = player;
            this.sockets[this.player2.UID] = ws;
            this.BroadcastState();
            return true;
        }

        else{
            player.type = "spectator";
            this.spectators[player.UID] = player;
            this.sockets[player.UID] = ws;
            this.BroadcastState();
            return true;
        }   
    }


    DeleteLobby(){
        delete tempGameDirectiory[this.LID];
    }


    // handles user leaving
    // TODO: FIX MULTIPLE INSTANCE ERRORS
    
    leaveHandler(u : User, sess : any){

        if(u.UID in this.sockets && this.sockets[u.UID].readyState == 1) return false;

        console.log("closing user: " + u.UID);
        delete this.leaveHandlers[u.UID];
        delete this.sockets[u.UID];
        if(u.type == "player1") this.player1 = undefined;
        else if(u.type == "player2") this.player2 = undefined;
        else if(u.type == "spectator"){
            delete this.spectators[u.UID];
        }

        if((!this.player1 || !this.player2) && this.inGame == true){
            this.inGame = false;
        }

        if(!this.player1 && !this.player2 && Object.keys(this.spectators).length == 0){
            this.DeleteLobby();
        }

        this.BroadcastState();
        sess.destroy();
        return true;
    }

    CloseUser(u : User, sess : any){
        let user : User = u;
        if(u.UID == this.player1?.UID) user = this.player1;
        else if(u.UID == this.player2?.UID) user = this.player2;
        else if(u.UID in this.spectators) user = this.spectators[u.UID];
        else return false;

        if(this.inGame == true && !(u.UID in this.spectators)) this.leaveHandlers[user.UID] = setTimeout(()=>{this.leaveHandler(user, sess)}, 300000);
        else {
            this.leaveHandler(user, sess);
        };
        return true;
    }

    startGame(){
        if(this.player1 == undefined || this.player2 == undefined){
            console.log("need 2 players");
            return;
        }
        this.game = new Game();
        this.inGame = true;
    }

    endGame(){
        console.log("game over!");
        this.inGame = false;
        delete this.game;
    }

    HandleMove(user: User, req : any){

        if(this.inGame === false){ console.log("game is not started"); return; }
        if(user.UID != this.player1?.UID && user.UID != this.player2?.UID){ console.log("not a player"); return; }

        let player = (user.UID == this.player1?.UID) ? 1 : 2;
        let x = req.x;
        let y = req.y;

        let isGameOver = this.game.updateBoard(x , y, player);

        if(isGameOver) this.endGame();
    }
    
    Broadcast(callback :  (key : string, value: WebSocket) => void ) {
        for(const [key, value] of Object.entries(this.sockets)){
            callback(key, value);
        }
    }

    MessageHandler(user: User, message : any){
        let req = JSON.parse(message);
        
        if(req.type == "start"){
            this.startGame();
            this.BroadcastState();
        }

        else if(req.type === "move"){
            this.HandleMove(user, req);
            this.BroadcastState();
        }

    }

    BroadcastState(){
        if(this.inGame == true){
            this.Broadcast((key, value)=>{
                value.send(JSON.stringify({
                    type: "update",
                    player1: this.player1,
                    player2: this.player2,
                    spectators: Object.entries(this.spectators),
                    inGame: this.inGame,
                    gameState: this.game.boardState
                }));
            });
        }
        else{
            this.Broadcast((key, value)=>{
                value.send(JSON.stringify({
                    type: "update",
                    player1: this.player1,
                    player2: this.player2,
                    spectators: Object.entries(this.spectators),
                    inGame: this.inGame
                }));
            });
        } 
    }



}

router.post('/create_lobby', (req : any, res : any) => {
    let lob = new Lobby();
    tempGameDirectiory[lob.LID] = lob;
    console.log(`lobby id from create_lobby:  ${lob.LID}`);
    res.status(200).json({
        status: "redirect",
        url: `lobby/${lob.LID}`
    });
});

router.post('/join_lobby', (req : Express.Request, res : Express.Response) => {
    let lobbyCode = ""; //FIXME: implement accuisition of lobby code from request body
});

module.exports.router = router;
module.exports.tempGameDirectiory = tempGameDirectiory;

