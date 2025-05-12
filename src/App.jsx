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
import UserProjects from './Components/UserProjects'
import Pending from './Components/Pending'
import Approved from './Components/Approved'
import RolledBack from './Components/RolledBack'
import UserInformation from './Components/UserInformation'
import Users from './Components/Users'
import AssignProjects from './Components/AssignProjects'
import ProjectsDash from './Components/ProjectsDash'
import AllProjects from './Components/AllProjects'
import ProjectInfo from './Components/ProjectInfo'
import AddUser from './Components/AddUser'

function App() {
  // const [count, setCount] = useState(0)

  

  return (
    <>
    <Router>
      <Routes>
        <Route path='/' element={<LogIn />} />
        <Route path='/signup' element={<SignUp />} />

        <Route path='/dashboards' element={<Dashboards/>} >
          <Route path='developer' element={<DeveloperDash />}>
            <Route index element={<UserProjects />} />
            <Route path='change-requests-history' element={<ChangeRequestHistory />}/>
            <Route path='actions' element={<ActionsDash />}/>
          </Route>

          <Route path='admin' element={<AdminDash />}>
            <Route index element={<Users />} />
            <Route path='user-info' element={<UserInformation />}/>
            <Route path='add-user' element={<AddUser />}/>
            <Route path='assign-projects' element={<AssignProjects />}/>
          </Route>
          <Route path='admin/all-projects' element={<ProjectsDash />}>
            <Route index element={<AllProjects />} />
            <Route path='project-info' element={<ProjectInfo />}/>
          </Route>

          <Route path='approver' element={<ApproverDash />}>
          <Route index element={<Pending />} />
            <Route path='approved' element={<Approved />}/>
            <Route path='rolled-back' element={<RolledBack />}/>
          </Route>

        </Route>
        
      </Routes>
    </Router>
    </>
  )
}

export default App
