import Game from './pages/Game'
import FirstHouse from './pages/FirstHouse'
import SecondHouse from './pages/SecondHouse'
import Tent from './pages/Tent'
import Fortress from './pages/Fortress'
import SecretHideout from './pages/SecretHideout'
import InventorySidebar from './pages/GameComponents/InventorySidebar'
import Taskbar from './pages/GameComponents/Taskbar'
import ResetGameButton from './pages/GameComponents/ResetGameButton'
import { InventoryProvider } from './context/InventoryContext'
import { Route, Routes } from 'react-router'

function App() {
  return (
    <InventoryProvider>
      <Taskbar />
      <InventorySidebar />
      <ResetGameButton />
      <Routes>
        <Route path='/' element={<Game/>}/>
        <Route path='/firsthouse' element={<FirstHouse/>}/>
        <Route path='/secondhouse' element={<SecondHouse/>}/>
        <Route path='/tent' element={<Tent/>}/>
        <Route path='/fortress' element={<Fortress/>}/>
        <Route path='/hideout' element={<SecretHideout/>}/>
      </Routes>
    </InventoryProvider>
  )
}

export default App
