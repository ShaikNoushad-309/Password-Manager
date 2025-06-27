import React, { useState } from 'react'
import './App.css'
import './index.css'
import Navbar from '../components/navbar'
import Manager from '../components/Manager'
// import LatestManagerBackup from "../components/latestManagerBackup.jsx";
// import Manager from '../backup'

function App() {
  // const [count, setCount] = useState(0)

  return (
    <div className="container ">
      <Navbar />
      {/*<LatestManagerBackup />*/}
        <Manager/>
    </div>
  )
}

export default App
