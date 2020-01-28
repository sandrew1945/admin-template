import { login, logout, getInfo, getMenu } from '@/api/user'
import { getToken, setToken, removeToken } from '@/utils/auth'
import { resetRouter } from '@/router'

const state = {
  token: getToken(),
  name: '',
  avatar: '',
  id: '',
  code: '',
  sex: '',
  role_id: '',
  roles: [],
  menuList: []
}

const mutations = {
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  },
  SET_ID: (state, id) => {
    state.id = id
  },
  SET_CODE: (state, code) => {
    state.code = code
  },
  SET_SEX: (state, sex) => {
    state.sex = sex
  },
  SET_ROLE_ID: (state, role_id) => {
    state.role_id = role_id
  },
  SET_ROLES: (state, roles) => {
    state.roles = roles
  },
  SET_MENU: (state, menuList) => {
    state.menuList = menuList
  }
}

const actions = {
  // user login
  login({ commit }, userInfo) {
    const { username, password } = userInfo
    return new Promise((resolve, reject) => {
      login({ userCode: username.trim(), password: password }).then(response => {
        const { data } = response
        commit('SET_TOKEN', data.token)
        setToken(data.token)
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },
  setRole({ commit }, roleId) {
    commit('SET_ROLE_ID', roleId)
  },
  // get user info
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      getInfo(state.token).then(response => {
        const { data } = response
        if (!data) {
          reject('Verification failed, please Login again.')
        }
        const { userId, userCode, userName, sex, avatarPath, roleList } = data
        commit('SET_ID', userId)
        commit('SET_CODE', userCode)
        commit('SET_NAME', userName)
        commit('SET_SEX', sex)
        commit('SET_AVATAR', avatarPath)
        commit('SET_ROLES', roleList)
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },

  getMenu({ commit }, roleId) {
    return new Promise((resolve, reject) => {
      getMenu(roleId).then(response => {
        const { data } = response
        resolve(data)
      })
    })
  },

  setMenu({ commit }, menuList) {
    commit('SET_MENU', menuList)
  },

  // user logout
  logout({ commit, state }) {
    return new Promise((resolve, reject) => {
      logout(state.token).then((response) => {
        commit('SET_TOKEN', '')
        commit('SET_NAME', '')
        commit('SET_ROLE_ID', '')
        commit('SET_MENU', [])
        commit('SET_ROLES', [])
        removeToken()
        resetRouter()
        resolve()
      }).catch(error => {
        commit('SET_TOKEN', '')
        commit('SET_NAME', '')
        commit('SET_ROLE_ID', '')
        commit('SET_MENU', [])
        commit('SET_ROLES', [])
        removeToken()
        resetRouter()
        resolve()
        reject(error)
      })
    })
  },
  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      commit('SET_TOKEN', '')
      removeToken()
      resolve()
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

