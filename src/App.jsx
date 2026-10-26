import Game from './pages/Game'
import FirstHouse from './pages/FirstHouse'
import SecondHouse from './pages/SecondHouse'
import Tent from './pages/Tent'
import Fortress from './pages/Fortress'
import SecretHideout from './pages/SecretHideout'
import BeatmapEditor from './pages/TentComponents/BeatmapEditor'
import InventorySidebar from './pages/GameComponents/InventorySidebar'
import Taskbar from './pages/GameComponents/Taskbar'
import { InventoryProvider } from './context/InventoryContext'
import { Route, Routes } from 'react-router'

function App() {
  return (
    <InventoryProvider>
      <Taskbar />
      <InventorySidebar />
      <Routes>
        <Route path='/' element={<Game/>}/>
        <Route path='/firsthouse' element={<FirstHouse/>}/>
        <Route path='/secondhouse' element={<SecondHouse/>}/>
        <Route path='/tent' element={<Tent/>}/>
        <Route path='/fortress' element={<Fortress/>}/>
        <Route path='/hideout' element={<SecretHideout/>}/>
        <Route path='/beatmapeditor' element={<BeatmapEditor/>}/>
      </Routes>
    </InventoryProvider>
  )
}

export default App
