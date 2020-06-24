const getters = {
  input: state => {
    return state.input
  },
  actor: state => {
    return state.actor
  },
  genre: state => {
    return state.genre
  },
  isLogin: state => {
    return state.isLogin
  },
  currentUser: state => {
    return state.currentUser
  },
  userId: state => {
    return state.userId
  },
  position: state => {
    return state.position
  },
  params: state => {
    return state.params
  }
}

export default getters
