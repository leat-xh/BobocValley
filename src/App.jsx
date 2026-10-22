import Game from './pages/Game'
import FirstHouse from './pages/FirstHouse'
import SecondHouse from './pages/SecondHouse'
import { Route, Routes } from 'react-router'

function App() {
  return (
    <Routes>
      <Route path='/' element={<Game/>}/>
      <Route path='/firsthouse' element={<FirstHouse/>}/>
      <Route path='/secondhouse' element={<SecondHouse/>}/>
    </Routes>
  )
}

export default App
