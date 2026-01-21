import React from 'react'
import { CNavGroup, CNavItem, CNavTitle } from '@coreui/react'
import CIcon from '@coreui/icons-react'
import {
  cilSpeedometer,
  cilUser,
  cilLocationPin,
  cilGift,
  cilStar,
  cilBadge,
  cilList,
  cilBook,
} from '@coreui/icons'

let _nav = [
  {
    component: CNavTitle,
    name: 'Dashboard',
  },
  {
    component: CNavItem,
    name: 'Dashboard',
    to: '/dashboard',
    icon: <CIcon icon={cilSpeedometer} customClassName="nav-icon" />,
  },
  {
    component: CNavTitle,
    name: 'Management',
  },
  {
    component: CNavItem,
    name: 'User Management',
    to: '/users',
    icon: <CIcon icon={cilUser} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Pain Locations',
    to: '/pain-locations',
    icon: <CIcon icon={cilLocationPin} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Facilities',
    to: '/facilities',
    icon: <CIcon icon={cilLocationPin} customClassName="nav-icon" />, 
  },
  {
    component: CNavGroup,
    name: 'Resources',
    icon: <CIcon icon={cilBook} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: 'Articles',
        to: '/resources/articles',
      },
    ],
  },
  {
    component: CNavGroup,
    name: 'Rewards',
    icon: <CIcon icon={cilGift} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: 'Achievements',
        to: '/rewards/achievements',
        icon: <CIcon icon={cilStar} customClassName="nav-icon" />,
      },
      {
        component: CNavItem,
        name: 'Badges',
        to: '/rewards/badges',
        icon: <CIcon icon={cilBadge} customClassName="nav-icon" />,
      },
    ],
  },
  {
    component: CNavGroup,
    name: 'Logs & Reports',
    icon: <CIcon icon={cilList} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: 'Pain Logs',
        to: '/logs/pain',
      },
      {
        component: CNavItem,
        name: 'Mood Logs',
        to: '/logs/mood',
      },
      {
        component: CNavItem,
        name: 'Hydration Logs',
        to: '/logs/hydration',
      },
      {
        component: CNavItem,
        name: 'Medication Logs',
        to: '/logs/medications',
      },
    ],
  },
]

export default _nav
