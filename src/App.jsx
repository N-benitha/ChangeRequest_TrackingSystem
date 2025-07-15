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
import AddProject from './Components/AddProject'
import ProjectUpdate from './Components/ProjectUpdate'
import Reports from './Components/Reports'

/**
 * The main application component that sets up the routing structure for the Change Request Tracking System.
 * 
 * Defines a hierarchical routing structure with role-based dashboards:
 * - Public routes: login, signup
 * - Protected routes under /dashboards with nested routes for each user role
 * - Developer: project management and change request actions
 * - Admin: user management and project administration
 * - Approver: change request approval workflow
 * - Reports: accessible to all authenticated users
 * 
 * @component
 */
function App() {  

  return (
    <>
    <Router>
      <Routes>
        {/* Public authentication routes */}
        <Route path='/' element={<LogIn />} />
        <Route path='/signup' element={<SignUp />} />

        {/* Protected dashboard routes - role-based access */}
        <Route path='/dashboards' element={<Dashboards/>} >
          {/* Developer dashboard - project assignment and change request management */}
          <Route path='developer' element={<DeveloperDash />}>
            <Route index element={<UserProjects />} />
            <Route path='change-requests-history/:id' element={<ChangeRequestHistory />}/>
            <Route path='actions/:id' element={<ActionsDash />}/>
          </Route>

          {/* Admin dashboard - user and project administration */}
          <Route path='admin' element={<AdminDash />}>
            <Route index element={<Users />} />
            <Route path='user-info' element={<UserInformation />}/>
            <Route path='add-user' element={<AddUser />}/>
            <Route path='assign-projects/:id' element={<AssignProjects />}/>
          </Route>

          {/* Reports accessible to all authenticated users */}
          <Route path='reports' element={<Reports/>}/>

          {/* Admin project management section */}
          <Route path='admin/all-projects' element={<ProjectsDash />}>
            <Route index element={<AllProjects />} />
            <Route path='add-project' element={<AddProject />}/>
            <Route path='project-update/:id' element={<ProjectUpdate/>}/>
            <Route path='project-info/:id' element={<ProjectInfo />}/>
          </Route>

          {/* Approver dashboard - change request approval workflow */}
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
