import React, { Suspense } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { CContainer, CSpinner } from '@coreui/react'

// routes config
import routes from '../routes'

import { useSelector } from 'react-redux'

const AppContent = () => {
  const userProfile = useSelector((state) => state.userProfile)

  return (
    <CContainer className="px-4" lg>
      <Suspense fallback={<CSpinner color="primary" />}>
        <Routes>
          {routes.map((route, idx) => {
            const isAllowed = !route.permission || 
                             (userProfile && (userProfile.role === 'super-admin' || 
                             userProfile.role === 'superadmin' ||
                             userProfile.permissions?.includes(route.permission)))

            return (
              route.element && (
                <Route
                  key={idx}
                  path={route.path}
                  exact={route.exact}
                  name={route.name}
                  element={isAllowed ? <route.element /> : <Navigate to="/dashboard" replace />}
                />
              )
            )
          })}
          <Route path="/" element={<Navigate to="dashboard" replace />} />
        </Routes>
      </Suspense>
    </CContainer>
  )
}

export default React.memo(AppContent)
