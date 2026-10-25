import Game from './pages/Game'
import FirstHouse from './pages/FirstHouse'
import SecondHouse from './pages/SecondHouse'
import Tent from './pages/Tent'
import { Route, Routes } from 'react-router'
import BeatmapEditor from './pages/TentComponents/BeatmapEditor'

function App() {
  return (
    <Routes>
      <Route path='/' element={<Game/>}/>
      <Route path='/firsthouse' element={<FirstHouse/>}/>
      <Route path='/secondhouse' element={<SecondHouse/>}/>
      <Route path='/tent' element={<Tent/>}/>
      <Route path='/beatmapeditor' element={<BeatmapEditor/>}/>
    </Routes>
  )
}

export default App
