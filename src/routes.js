import React from 'react'
const Dashboard = React.lazy(() => import('./views/dashboard/Dashboard'))
const Login = React.lazy(() => import('./views/pages/login/Login'))
const Profile = React.lazy(() => import('./views/Profile/Profile'))

// New views
const UsersList = React.lazy(() => import('./views/users/UsersList'))
const PainLocations = React.lazy(() => import('./views/pain-locations/PainLocations'))
const Achievements = React.lazy(() => import('./views/rewards/Achievements'))
const Badges = React.lazy(() => import('./views/rewards/Badges'))

// Logs
const PainLogs = React.lazy(() => import('./views/logs/PainLogs'))
const MoodLogs = React.lazy(() => import('./views/logs/MoodLogs'))
const HydrationLogs = React.lazy(() => import('./views/logs/HydrationLogs'))
const MedicationLogs = React.lazy(() => import('./views/logs/MedicationLogs'))
const Facilities = React.lazy(() => import('./views/facilities/Facilities'))

const routes = [
  { path: '/', exact: true, name: 'Home' },
  { path: '/dashboard', name: 'Dashboard', element: Dashboard, permission: 'dashboard' },
  { path: '/Login', name: 'Login', element: Login, exact: true },
  { path: '/profile', name: 'Profile', element: Profile },
  { path: '/users', name: 'Users', element: UsersList },
  { path: '/facilities', name: 'Facilities', element: Facilities },
  { path: '/pain-locations', name: 'Pain Locations', element: PainLocations },
  { path: '/rewards/achievements', name: 'Achievements', element: Achievements },
  { path: '/rewards/badges', name: 'Badges', element: Badges },
  { path: '/logs/pain', name: 'Pain Logs', element: PainLogs },
  { path: '/logs/mood', name: 'Mood Logs', element: MoodLogs },
  { path: '/logs/hydration', name: 'Hydration Logs', element: HydrationLogs },
  { path: '/logs/medications', name: 'Medication Logs', element: MedicationLogs },
]

export default routes

