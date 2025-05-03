// import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
import './App.css'
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'
import SignUp from './Components/SignUp'
import DeveloperDash from './Components/DeveloperDash'
import AdminDash from './Components/AdminDash'
import ApproverDash from './Components/ApproverDash'
import LogIn from './Components/LogIn'
import Dashboards from './Components/Dashboards'
import ChangeRequestHistory from './Components/ChangeRequestHistory'
import ActionsDash from './Components/ActionsDash'
import Projects from './Components/Projects'

function App() {
  // const [count, setCount] = useState(0)

  

  return (
    <>
    <Router>
      <Routes>
        <Route path='/' element={<LogIn />} />
        <Route path='/signup' element={<SignUp />} />
        {/* <Route path='/dashboards' element={<Dashboards />}/> */}
        {/* <Route path='/developer' element={<DeveloperDash />}/> */}
        {/* <Route path='/admin' element={<AdminDash />}/> */}
        {/* <Route path='/approver' element={<ApproverDash />}/> */}

        <Route path='/dashboards' element={<Dashboards/>} >
          <Route path='developer' element={<DeveloperDash />}>
            <Route index element={<Projects />} />
            <Route path='change-requests-history' element={<ChangeRequestHistory />}/>
            <Route path='actions' element={<ActionsDash />}/>
          </Route>

          <Route path='admin' element={<AdminDash />}/>
          <Route path='approver' element={<ApproverDash />}/>
        </Route>
        
      </Routes>
    </Router>
    </>
  )
}

export default App
