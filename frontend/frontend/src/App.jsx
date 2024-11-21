import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import { BrowserRouter,Routes,Route,Navigate } from 'react-router-dom'
import Register from './pages/Register'
import Login from './pages/Login'
import ProtectedRoute from './componenets/ProtectedRoute'
import Home from './pages/Home'
import Adminlogin from './pages/Admin/adminlogin/adminlogin'
import Adminhome from './pages/Admin/Adminhome/adminhome'
import UserProfile from './pages/user/Userprofile/userprofile'
import EditProfile from './pages/user/editprofile/Editprofile'
import AdminProtectedRoute from './componenets/adminprotect'
import Adduser from './pages/Admin/Adduser/Adduser'








const Logout= ()=> {
  localStorage.clear()
  return <Navigate to="/login" />
}
const RegisterAndLogout= ()=> {
  localStorage.clear()
  return <Register/>
}
function App() {


  return (
    <BrowserRouter>
    <Routes>
      <Route path='/' element={
        <ProtectedRoute>
          <Home/>
        </ProtectedRoute>
      }/>
      <Route path="/login" element={<Login/>}></Route>
      <Route path="/admin" element={<Adminlogin/>}></Route>
      <Route path="/Register" element={<RegisterAndLogout/>}></Route>
      <Route path="/profile" element={<ProtectedRoute><UserProfile/></ProtectedRoute>}></Route>
      <Route path='/adminhome' element={<AdminProtectedRoute><Adminhome/></AdminProtectedRoute>}></Route>
      <Route path="/editprofile" element={<ProtectedRoute><EditProfile/></ProtectedRoute>}></Route>
      <Route path='/adduser' element={<AdminProtectedRoute><Adduser/></AdminProtectedRoute>}></Route>
    </Routes>
    </BrowserRouter>
    
  )
}

export default App
