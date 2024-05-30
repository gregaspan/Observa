import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import { BrowserRouter as Router, Route, BrowserRouter, Routes } from 'react-router-dom';
import './App.css'
import Dashboard from "./components/Dashboard"
import Login from "./components/Login"
import Registration from "./components/Registration"

function App() {
  const [count, setCount] = useState(0)

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Registration />} />
        
      </Routes>
    </BrowserRouter>
  )
}

export default App
