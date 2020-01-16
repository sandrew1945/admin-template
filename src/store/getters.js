const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  token: state => state.user.token,
  avatar: state => state.user.avatar,
  name: state => state.user.name,
  id: state => state.user.id,
  code: state => state.user.code,
  sex: state => state.user.sex,
  role_id: state => state.user.role_id,
  roles: state => state.user.roles,
  menuList: state => state.user.menuList
}
export default getters
