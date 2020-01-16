import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/login',
    method: 'post',
    data
  })
}

export function getInfo(token) {
  return request({
    url: '/userInfo',
    method: 'post',
    params: { token }
  })
}

export function getRole(token) {
  return request({
    url: '/'
  })
}

export function getMenu(roleId) {
  return request({
    url: '/getMenuByRole',
    method: 'post',
    params: { 'roleId': roleId }
  })
}

export function logout() {
  return request({
    url: '/logout',
    method: 'post'
  })
}
