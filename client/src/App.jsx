import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Dashboard from "./components/Dashboard"

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
    <Dashboard />
         <h1 className="text-3xl font-bold underline">
      Hello world!
    </h1>
    </>
  )
}

export default App
