import React from 'react'
import{BrowserRouter,Routes,Route} from 'react-router-dom'
import Register from './Pages/Register'
import Login from './Pages/Login'
import Chat from './Pages/Chat'
import SetAvatar from './Pages/setAvatar'
import EmailVerification from './Pages/emailVerification'
const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/register" element={<Register/>}/>
        <Route path="/login" element={<Login/>}/>
        <Route path="/" element={<Chat/>}/>
        <Route path="/setAvatar" element={<SetAvatar/>}/>
        <Route path ="/users/:id/verify/:token" element={<EmailVerification />}/>
      </Routes>
    </BrowserRouter>
  )
}

export default App
