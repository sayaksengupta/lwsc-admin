import React, { useMemo } from 'react'
import { useSelector, useDispatch } from 'react-redux'

import {
  CCloseButton,
  CSidebar,
  CSidebarBrand,
  CSidebarFooter,
  CSidebarHeader,
  CSidebarToggler,
  CNavTitle,
} from '@coreui/react'

import { AppSidebarNav } from './AppSidebarNav'
import logo from '../assets/logo.svg'
import navigation from '../_nav'

const AppSidebar = () => {
  const dispatch = useDispatch()
  const unfoldable = useSelector((state) => state.sidebarUnfoldable)
  const sidebarShow = useSelector((state) => state.sidebarShow)
  const userProfile = useSelector((state) => state.userProfile)

  const dynamicNavigation = useMemo(() => {
    // If no profile, show everything or a limited set
    if (!userProfile) return navigation
    
    const { role = '', permissions = [] } = userProfile

    // 1. Filter by permission
    let filtered = navigation
    if (role !== 'super-admin' && role !== 'superadmin') {
      filtered = navigation.filter((item) => {
        if (item.permission) {
          return permissions.includes(item.permission)
        }
        return true
      })
    }

    // 2. Remove consecutive titles or dangling titles
    const final = []
    for (let i = 0; i < filtered.length; i++) {
       const curr = filtered[i]
       const next = filtered[i+1]
       
       if (curr.component === CNavTitle) {
         if (next && next.component !== CNavTitle) {
           final.push(curr)
         }
       } else {
         final.push(curr)
       }
    }

    return final
  }, [userProfile])

  return (
    <CSidebar
      className="border-end shadow-sm"
      colorScheme="dark"
      position="fixed"
      unfoldable={unfoldable}
      visible={sidebarShow}
      onVisibleChange={(visible) => {
        dispatch({ type: 'set', sidebarShow: visible })
      }}
    >
      <CSidebarHeader className="border-bottom d-flex justify-content-center py-3">
        <CSidebarBrand to="/" className='text-decoration-none'>
          <img src={logo} width={160} alt='logo' style={{ objectFit: 'contain' }}/>
        </CSidebarBrand>
        <CCloseButton
          className="d-lg-none"
          onClick={() => dispatch({ type: 'set', sidebarShow: false })}
        />
      </CSidebarHeader>
      
      <AppSidebarNav items={dynamicNavigation} />
      
      <CSidebarFooter className="border-top d-none d-lg-flex">
        <CSidebarToggler
          onClick={() => dispatch({ type: 'set', sidebarUnfoldable: !unfoldable })}
        />
      </CSidebarFooter>
    </CSidebar>
  )
}

export default React.memo(AppSidebar)
