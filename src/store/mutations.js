const mutations = {
  clearLoginStatus(state) {
    state.isLogin = false
    state.currentUser = 'guest'
    state.userId = null
    state.token = ''
  },
  initLoginStatus(state) {
    state.isLogin = true
    state.currentUser = localStorage.getItem('user')
    state.token = localStorage.getItem('token')
    state.userId = parseInt(localStorage.getItem('userId'))
  },
  initParams(state) {
    state.params = {}
    state.params['fh'] = ''
    state.params['position'] = []
    state.params['up'] = []
    state.params['score'] = []
    state.params['page'] = 1
    state.params['actor'] = []
    state.params['genre'] = []
    state.params['orderBy'] = 'id'
    state.params['isReverse'] = false
  },
  changeParams(state, payload) {
    state.params = payload
  },
  changeFh(state, payload) {
    state.params['fh'] = payload
  },
  changePage(state, payload) {
    state.params['page'] = payload
  },
  changeOrderBy(state, payload) {
    state.params['orderBy'] = payload
  },
  changePosition(state, payload) {
    state.params['position'] = []
    for (const val of payload) {
      state.params['position'].push(val)
    }
  },
  changeGenre(state, payload) {
    state.params['genre'] = payload
  },
  changeActor(state, payload) {
    state.params['actor'] = payload
  },
  changeSelector(state) {
    state.showSelector = !state.showSelector
  }
}

export default mutations
