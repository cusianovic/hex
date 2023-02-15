import {Routes, Route} from 'react-router-dom'

import React from 'react';
import Home from "./pages/home"
import Game from "./pages/game"
import Play from "./pages/play"
import Join from "./pages/join"
import Lobby from "./pages/lobby";
import Test from "./pages/test";
import TempLobby from "./pages/templobby"

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/play" element={<Play/>}/>
      <Route path='/join' element={<Join/>}/>
      <Route path='/game/:lobbyCode' element={<Game />}/>
      <Route path='/lobby/:lobbyCode' element={<Lobby/>}/>
      <Route path='/testlobby' element={<Test/>}/>
      <Route path='/templobby' element={<TempLobby/>}/>
    </Routes>
  );
}

export default App;
