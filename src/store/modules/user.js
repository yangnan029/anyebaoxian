const state = {
  user: {
    city: '',
    deviceToken: null,
    id: undefined,
    job: '',
    nickName: '',
    phone: '',
    photoUrl: '',
    province: '',
    sex: undefined
  }
}

const getters = {
  user: state => state.user
}

const mutations = {
  changeUserInfo: (state, user) => {
    state.user = {...user}
  }
}

const actions = {
  changeUserInfo: ({ commit, state }, user) => {
    commit('changeUserInfo', user)
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
