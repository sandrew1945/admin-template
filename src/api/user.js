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
    method: 'get',
    params: { token }
  })
}

// export function getRole(token) {
//   return request({
//     url: '/'
//   })
// }

export function getMenu(roleId) {
  return request({
    url: '/getMenuByRole',
    method: 'get',
    params: { 'roleId': roleId }
  })
}

export function logout() {
  return request({
    url: '/logout',
    method: 'post'
  })
}
