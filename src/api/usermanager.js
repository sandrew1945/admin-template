import request from '@/utils/request'

/**
 *  查询用户列表
 * @param {*} queryParams
 */
export function getUserList(data) {
  return request({
    url: 'usermanager/userManagerPageQuery',
    method: 'post',
    data
  })
}
/**
 *  创建用户
 * @param {*} userInfo
 */
export function createUser(data) {
  return request({
    url: 'usermanager/createUserInfo',
    method: 'post',
    data
  })
}
/**
 *  查询用户信息
 * @param {*} id
 */
export function fetchUserInfo(id) {
  return request({
    url: 'usermanager/getUserInfoById',
    method: 'get',
    params: { 'userId': id }
  })
}
/**
 *  更新用户信息
 * @param {*} data
 */
export function updateUserInfo(data) {
  return request({
    url: 'usermanager/updateUserInfo',
    method: 'post',
    data
  })
}
/**
 *  删除用户
 * @param {*} data
 */
export function deleteUser(data) {
  return request({
    url: 'usermanager/deleteUserInfo',
    method: 'post',
    data
  })
}
