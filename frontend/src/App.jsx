import React from 'react'
import './App.css'
import Navbar from './components/Navbar'
import Dashboard from './components/Dashboard/Dashboard'

function App() {
  

  return (
    <div>
      <div className=" bg-gray-900 min-h-screen">
        <Navbar />
        <Dashboard />
      </div>
    </div>
  )
}

export default App
