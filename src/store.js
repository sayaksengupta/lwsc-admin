import { legacy_createStore as createStore } from 'redux'

const initialState = {
  sidebarShow: true,
  theme: 'light',
  userProfile: null, // role, permissions, name, email
}

const changeState = (state = initialState, { type, ...rest }) => {
  switch (type) {
    case 'set':
      return { ...state, ...rest }
    case 'setProfile':
      return { ...state, userProfile: rest.profile }
    default:
      return state
  }
}

const store = createStore(changeState)
export default store
