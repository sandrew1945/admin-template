<template>
  <div class="app-container">
    <el-form :inline="true" :model="userInfo" label-width="120px">
      <el-form-item label="用户代码">
        <el-input v-model="userInfo.userCode" :disabled="true" />
      </el-form-item>
      <el-form-item label="用户姓名">
        <el-input v-model="userInfo.userName" :disabled="true" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" @click="dialogFormVisible = true">
          选择可添加角色
        </el-button>
      </el-form-item>
      <el-form-item>
        <el-button type="default" icon="el-icon-caret-left" @click="cancel">返回</el-button>
      </el-form-item>
    </el-form>

    <el-table
      :key="tableKey"
      v-loading="listLoading"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%;"
    >
      <el-table-column label="序号" type="index" width="100px" align="center" />
      <el-table-column label="角色代码" min-width="150px" property="roleCode" align="center" />
      <el-table-column label="角色名称" min-width="150px" property="roleName" align="center" />
      <el-table-column label="状态" min-width="150px" property="roleStatus" align="center" width="150px">
        <template slot-scope="{row}">
          {{ row.roleStatus | fixcodeFilter }}
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="230" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <el-button size="mini" type="danger" @click="deleteRole(row.roleId)">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 新增角色modal -->
    <el-dialog :visible.sync="dialogFormVisible">
      <div class="filter-container">
        <el-input v-model="roleName" placeholder="角色名称" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
        <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
          查询
        </el-button>
        <!-- <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="addRole">
          Add
        </el-button> -->
      </div>

      <el-table
        :key="tableKey"
        v-loading="listLoading"
        :data="unrelationlist"
        border
        fit
        highlight-current-row
        style="width: 100%;"
        @selection-change="handleSelectedRoles"
      >
        <el-table-column type="selection" width="50px" align="center" />
        <el-table-column label="角色代码" min-width="150px" property="roleCode" align="center" />
        <el-table-column label="角色名称" min-width="150px" property="roleName" align="center" />
        <el-table-column label="状态" min-width="150px" property="roleStatus" align="center" width="150px">
          <template slot-scope="{row}">
            {{ row.roleStatus | fixcodeFilter }}
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="230" class-name="small-padding fixed-width">
          <template slot-scope="{row}">
            <el-button v-loading.fullscreen.lock="fullscreenLoading" size="mini" type="danger" @click="addRole(false, row.roleId)">
              添加
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          关闭
        </el-button>
        <el-button v-loading.fullscreen.lock="fullscreenLoading" type="primary" @click="addRole(true)">
          批量添加
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getRelationRoles, getUnRelationRoles, fetchUserInfo, addRole, deleteRole } from '@/api/usermanager'
import waves from '@/directive/waves' // waves directive
import { getfixCodeDesc } from '@/utils/fixcode'

export default {
  name: 'ComplexTable',
  directives: { waves },
  filters: {
    fixcodeFilter(fixcode) {
      return getfixCodeDesc(fixcode)
    }
  },
  data() {
    return {
      tableKey: 0,
      list: null,
      unrelationlist: null,
      total: 0,
      listLoading: true,
      listQuery: {
        roleName: '',
        userId: ''
      },
      userId: '',
      roleName: '',
      userInfo: {},
      dialogFormVisible: false,
      selectedRoles: [],
      fullscreenLoading: false
    }
  },
  watch: {
    dialogFormVisible: function(value) {
      if (value) {
        this.getUnRelationRoles()
      }
    }
  },
  created() {
    this.userId = this.$route.params.id
    this.listQuery.userId = this.userId
    this.getUserInfo()
    this.getList()
  },
  methods: {
    getUserInfo() {
      fetchUserInfo(this.userId).then(response => {
        this.userInfo = response.data
      })
    },
    getList() {
      this.listLoading = true
      getRelationRoles(this.userId).then(response => {
        this.list = response.data
        // this.total = response.totalRecords
        // Just to simulate the time of the request
        this.listLoading = false
      })
    },
    getUnRelationRoles() {
      this.listLoading = true
      const param = { 'userId': this.userId, 'roleName': this.roleName }
      getUnRelationRoles(param).then(response => {
        this.unrelationlist = response.data
        this.listLoading = false
      })
    },
    handleFilter() {
      this.getUnRelationRoles()
    },
    addRole(closeModal, selected) {
      this.fullscreenLoading = true
      const rolesArray = []
      if (selected) {
        rolesArray.push(selected)
      } else {
        this.selectedRoles.forEach(element => {
          rolesArray.push(element.roleId)
        })
      }
      const param = { 'userId': this.userId, 'rolesStr': rolesArray.join(',') }
      addRole(param).then(response => {
        if (response.result === true) {
          this.$message({
            message: 'Add Success',
            type: 'success'
          })
        }
        if (closeModal) {
          this.dialogFormVisible = false
        }
        this.fullscreenLoading = false
        this.getUnRelationRoles()
        this.getList()
      })
    },
    handleSelectedRoles(roles) {
      this.selectedRoles = roles
    },
    deleteRole(roleId) {
      this.$confirm('是否删除该角色？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const param = { 'userId': this.userId, 'roleId': roleId }
        deleteRole(param).then((res) => {
          if (res.result === true) {
            this.$message({
              message: '操作Success',
              type: 'success'
            })
          }
          this.fullscreenLoading = false
          this.getList()
        })
      })
    },
    cancel() {
      this.$router.back(-1)
    }
  }
}
</script>
