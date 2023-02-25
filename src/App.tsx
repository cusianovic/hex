import {Routes, Route} from 'react-router-dom'

import React from 'react';
import Home from "./pages/home"
import Game from "./pages/game"
import Join from "./pages/join"
import Lobby from "./pages/lobby";


function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path='/join' element={<Join/>}/>
      <Route path='/game/:lobbyCode' element={<Game />}/>
      <Route path='/lobby/:lobbyCode' element={<Lobby/>}/>
    </Routes>
  );
}

export default App;
