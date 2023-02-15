enum hexState{
    Empty = 0,
    Player1 = 1,
    Player2 = 2,
}

class Game{

    boardState : Array<Array<hexState>>;
    turn: hexState.Player1 | hexState.Player2;

    constructor(){
        let tempState : Array<Array<hexState>> = [];
        for(let i = 0; i < 11; i++){
            tempState.push([]);
            for(let j = 0; j < 11; j++){
                tempState[i][j] = hexState.Empty;
            }
        }
        
        this.boardState = tempState;
        this.turn = hexState.Player1;
    }
    swapTurn(){
        if(this.turn == hexState.Player1){
            this.turn = hexState.Player2;
        }
        else if(this.turn == hexState.Player2){
            this.turn = hexState.Player1
        }
    }

    updateBoard(x : number, y : number, playerColor : hexState){
        if(playerColor != hexState.Player1 && playerColor != hexState.Player2) {console.log("invalid player passed into game.updateBoard()"); return;}
        if(playerColor != this.turn){ console.log("not your turn"); return; }
        if(this.boardState[y][x] != hexState.Empty){console.log("not an empty square"); return;}

        this.boardState[y][x] = playerColor;
        this.swapTurn();
        return this.checkWin(playerColor, y , x);
        
    }

    checkWin(player : hexState.Player1 | hexState.Player2, row: number, column: number){

        let dpBoardSeen : Array<Array<boolean>> = Array.from(Array(11), () => new Array(11));
        let dpSolveState : [boolean, boolean]= [false, false]
        function checkWinHelper(this: any, player: hexState, row: number, column: number, boardState: Array<Array<hexState>>){
            console.log(`row: ${row}, column: ${column}`);
            console.log(boardState[row][column]);
            dpBoardSeen[row][column] = true;
            if(player == hexState.Player1){

                if(row == 0) dpSolveState[0] = true;
                else if(row == 10) dpSolveState[1] = true;
                
            }

            else if(player == hexState.Player2){
                
                if(column == 0) dpSolveState[0] = true;
                else if(column == 10) dpSolveState[1] = true;

            }

            else{
                throw console.error("Passing non-player as player");
            }
            

            if(row > 0 && dpBoardSeen[row - 1][column] != true && boardState[row - 1][column] == player) checkWinHelper(player, row - 1, column, boardState);
            if(row < 10 && dpBoardSeen[row + 1][column] != true && boardState[row + 1][column] == player) checkWinHelper(player, row + 1, column, boardState);
            if(column > 0 && dpBoardSeen[row][column - 1] != true && boardState[row][column - 1] == player) checkWinHelper(player, row, column - 1, boardState);
            if(column < 10 && dpBoardSeen[row][column + 1] != true && boardState[row][column + 1] == player) checkWinHelper(player, row, column + 1, boardState);
            if(row > 0 && column < 10 && dpBoardSeen[row - 1][column + 1] != true && boardState[row - 1][column + 1] == player) checkWinHelper(player, row - 1, column + 1, boardState);
            if(row < 10 && column > 0 && dpBoardSeen[row + 1][column - 1] != true && boardState[row + 1][column - 1] == player) checkWinHelper(player, row + 1, column - 1, boardState);

            if(dpSolveState[0] === true && dpSolveState[1] === true) return true;
        }


        return checkWinHelper(player, row, column, this.boardState);
    }
}

module.exports = Game;