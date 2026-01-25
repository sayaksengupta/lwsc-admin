import React, { Suspense, useEffect } from 'react'
import { BrowserRouter, Route, Routes, Navigate, useLocation } from 'react-router-dom'
import { CSpinner, useColorModes } from '@coreui/react'
import './scss/style.scss'
import 'react-toastify/dist/ReactToastify.css'
import { jwtDecode } from 'jwt-decode'
import axios from 'axios'
import { useSelector, useDispatch } from 'react-redux'

import { authApi } from './services/api'

// Profile Watcher to handle data fetching after login/navigation
const ProfileWatcher = () => {
  const dispatch = useDispatch()
  const location = useLocation()
  const userProfile = useSelector((state) => state.userProfile)

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem('token')
      if (!token || userProfile) return

      try {
        const res = await authApi.getMe()
        dispatch({ type: 'setProfile', profile: res.data.admin || res.data })
      } catch (err) {
        console.error('Failed to fetch profile:', err)
        if (err.response && err.response.status === 401) {
          localStorage.removeItem('token')
          localStorage.removeItem('refreshToken')
          dispatch({ type: 'setProfile', profile: null })
        }
      }
    }

    fetchProfile()
  }, [location.pathname, userProfile, dispatch])

  return null
}

// PrivateRoute component
const PrivateRoute = ({ children }) => {
  const isTokenExpired = (token) => {
    if (!token) return true;
    try {
      const decoded = jwtDecode(token);
      const currentTime = Date.now() / 1000;
      return decoded.exp < currentTime;
    } catch (error) {
      console.error('Invalid token:', error);
      return true;
    }
  };

  const token = localStorage.getItem('token');

  if (isTokenExpired(token)) {
    localStorage.removeItem('token');
    return <Navigate to="/login" />;
  }

  return <>{children}</>;
};

// Containers
const DefaultLayout = React.lazy(() => import('./layout/DefaultLayout'))

// Pages
const Login = React.lazy(() => import('./views/pages/login/Login'))
const DeleteAccount = React.lazy(() => import('./views/pages/deleteAccount/DeleteAccount'))
const Page404 = React.lazy(() => import('./views/pages/page404/Page404'))
const Page500 = React.lazy(() => import('./views/pages/page500/Page500'))

const App = () => {
  const { isColorModeSet, setColorMode } = useColorModes('coreui-free-react-admin-template-theme')
  const storedTheme = useSelector((state) => state.theme)

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.href.split('?')[1])
    const theme = urlParams.get('theme') && urlParams.get('theme').match(/^[A-Za-z0-9\s]+/)[0]
    if (theme) {
      setColorMode(theme)
    }

    if (isColorModeSet()) {
      return
    }

    setColorMode(storedTheme)
  }, [isColorModeSet, setColorMode, storedTheme])

  return (
    <BrowserRouter>
      <ProfileWatcher />
      <Suspense
        fallback={
          <div className="pt-3 text-center">
            <CSpinner color="primary" variant="grow" />
          </div>
        }
      >
        <Routes>
          <Route exact path="/login" name="Login Page" element={<Login />} />
          <Route exact path="/delete-account" name="Delete Account" element={<DeleteAccount />} />
          <Route exact path="/404" name="Page 404" element={<Page404 />} />
          <Route exact path="/500" name="Page 500" element={<Page500 />} />
          <Route
            path="*"
            element={
              <PrivateRoute>
                <DefaultLayout />
              </PrivateRoute>
            }
          />
        </Routes>
      </Suspense>
    </BrowserRouter>
  )
}

export default App

