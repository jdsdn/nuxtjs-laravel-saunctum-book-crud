import axios from 'axios'

let url = 'http://127.0.0.1:8000/api'

export const state = () => ({
  authUser: null,
  url: url,
})

export const mutations = {
  SET_USER (state, user) {
    state.authUser = user,
    state.authUser.token = user.data.token,
    state.authUser.name = user.data.name,
    state.authUser.email = user.data.email
  },
  REV_USER (state, user) {
    state.authUser = user
  }
}

export const actions = {
  async register ({ commit }, { name, email, password, c_password }) {
    try {
      const { data } = await axios.post(url + '/register', { name, email, password, c_password })
      commit('SET_USER', data)

    } catch (error) {
      if (error.response && error.response.status === 401) {
        throw new Error('Bad credentials')
      }
      throw error
    }
  },

  async login ({ commit }, { email, password }) {
    try {
      const { data } = await axios.post(url + '/login', { email, password })
      commit('SET_USER', data)

    } catch (error) {
      if (error.response && error.response.status === 401) {
        throw new Error('Bad credentials')
      }
      throw error
    }
  },

  async logout ({ commit }) {
    await axios.post(url + '/logout')
    commit('REV_USER', null)
  }

}
