<template>
  <div class="app-container">
    <el-form :inline="true" :model="roleInfo" label-width="120px">
      <el-form-item label="用户代码">
        <el-input v-model="roleInfo.roleCode" :disabled="true" />
      </el-form-item>
      <el-form-item label="用户姓名">
        <el-input v-model="roleInfo.roleName" :disabled="true" />
      </el-form-item>
      <el-form-item>
        <el-button v-loading.fullscreen.lock="fullscreenLoading" type="primary" icon="el-icon-search" @click="savePermission">
          保存权限
        </el-button>
      </el-form-item>
      <el-form-item>
        <el-button type="default" icon="el-icon-caret-left" @click="cancel">返回</el-button>
      </el-form-item>
    </el-form>
    <el-tree
      ref="tree"
      :check-strictly="checkStrictly"
      :data="routesData"
      :props="defaultProps"
      show-checkbox
      :default-checked-keys="checkMenu"
      node-key="path"
      class="permission-tree"
    />
  </div>
</template>

<script>
import { fetchRoleInfo, savePermission, getCheckedPremission } from '@/api/rolemanager'
import waves from '@/directive/waves' // waves directive
import { getfixCodeDesc } from '@/utils/fixcode'
import path from 'path'

export default {
  name: 'ManagerRoles',
  // components: { SimpleTable },
  directives: { waves },
  filters: {
    fixcodeFilter(fixcode) {
      return getfixCodeDesc(fixcode)
    }
  },
  data() {
    return {
      tableKey: 0,
      list: [],
      total: 0,
      listLoading: true,
      checkedNode: [],
      checkStrictly: false,
      roleId: '',
      roleInfo: {},
      dialogFormVisible: false,
      selectedRoles: [],
      fullscreenLoading: false,
      checkMenu: [],
      columns: [
        { header: '序号', type: 'index', width: '100px', dataIndex: '' },
        { header: '角色代码', type: 'data', width: '', dataIndex: 'roleCode' },
        { header: '角色名称', type: 'data', width: '', dataIndex: 'roleName' }
      ],
      defaultProps: {
        children: 'children',
        label: 'title'
      },
      routes: []
    }
  },
  computed: {
    routesData() {
      return this.routes
    }
  },
  created() {
    this.roleId = this.$route.params.id
    this.getRoleInfo()
    this.getRoutes()
    this.initPremission()
  },
  methods: {
    getRoleInfo() {
      fetchRoleInfo(this.roleId).then(response => {
        this.roleInfo = response.data
      })
    },
    savePermission() {
      this.fullscreenLoading = true
      const checkedNodes = this.$refs.tree.getCheckedNodes()
      const params = { 'roleId': this.roleId, 'node': checkedNodes }
      savePermission(params).then((response) => {
        if (response.data === true) {
          this.$notify({
            title: 'Success',
            message: '权限维护成功!',
            type: 'success',
            duration: 2000
          })
        }
        this.fullscreenLoading = false
      })
    },
    initPremission() {
      getCheckedPremission(this.roleId).then((response) => {
        this.checkMenu = response.data
      })
    },
    getRoutes() {
      this.routes = this.generateRoutes(this.$router.app._router.options.routes)
    },
    generateRoutes(routes, basePath = '/') {
      const res = []
      for (let route of routes) {
        // skip some route
        if (route.hidden) { continue }
        const onlyOneShowingChild = this.onlyOneShowingChild(route.children, route)
        if (route.children && onlyOneShowingChild && !route.alwaysShow) {
          route = onlyOneShowingChild
        }
        const data = {
          path: path.resolve(basePath, route.path),
          title: route.meta && route.meta.title,
          name: route.name,
          redirect: route.redirect,
          meta: route.meta
        }
        // recursive child routes
        if (route.children) {
          data.children = this.generateRoutes(route.children, data.path)
        }
        res.push(data)
      }
      return res
    },
    onlyOneShowingChild(children = [], parent) {
      let onlyOneChild = null
      const showingChildren = children.filter(item => !item.hidden)
      // When there is only one child route, the child route is displayed by default
      if (showingChildren.length === 1) {
        onlyOneChild = showingChildren[0]
        onlyOneChild.path = path.resolve(parent.path, onlyOneChild.path)
        return onlyOneChild
      }
      // Show parent if there are no child route to display
      if (showingChildren.length === 0) {
        onlyOneChild = { ... parent, path: '', noShowingChildren: true }
        return onlyOneChild
      }
      return false
    },
    cancel() {
      this.$router.back(-1)
    }
  }
}
</script>
<style lang="scss" scoped>
.app-container {
  .roles-table {
    margin-top: 30px;
  }
  .permission-tree {
    margin-bottom: 30px;
  }
}
</style>
