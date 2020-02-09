<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.userCode" placeholder="用户账号" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-input v-model="listQuery.userName" placeholder="用户姓名" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <FixcodeSelect :type="'1001'" :model.sync="listQuery.userStatus" :placeholder="'用户状态'" :css="'width: 130px'" />
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        查询
      </el-button>
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleCreate">
        新增
      </el-button>
    </div>
    <SimpleTable :list-loading="listLoading" :data="list" :columns="columns">
      <el-table-column label="Actions" align="center" width="250px" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <el-button type="primary" size="mini" @click="handleUpdate(row)">
            编辑
          </el-button>
          <el-button size="mini" type="danger" @click="deleteUser(row.userId)">
            删除
          </el-button>
          <el-button type="warning" size="mini" @click="handleRoles(row)">
            角色
          </el-button>
        </template>
      </el-table-column>
    </SimpleTable>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.curPage" :limit.sync="listQuery.limit" @pagination="getList" />
  </div>
</template>

<script>
import { getUserList, deleteUser } from '@/api/usermanager'
import waves from '@/directive/waves' // waves directive
import { parseTime } from '@/utils'
import SimpleTable from '@/components/SimpleTable'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
import FixcodeSelect from '@/components/FixcodeSelect'

export default {
  name: 'UserManager',
  components: { SimpleTable, Pagination, FixcodeSelect },
  directives: { waves },
  filters: {
  },
  data() {
    return {
      tableKey: 0,
      list: [],
      total: 0,
      listLoading: true,
      listQuery: {
        curPage: 1,
        limit: 20,
        userCode: undefined,
        userName: undefined,
        userStatus: ''
        // sort: '+id'
      },
      columns: [
        { header: '序号', type: 'index', width: '100px', dataIndex: '' },
        { header: '账号', type: 'data', width: '', dataIndex: 'userCode' },
        { header: '姓名', type: 'data', width: '', dataIndex: 'userName' },
        { header: '角色', type: 'data', width: '', dataIndex: 'roleName' },
        { header: '性别', type: 'fixcode', width: '', dataIndex: 'sex' },
        { header: '状态', type: 'fixcode', width: '', dataIndex: 'userStatus' }
      ],
      sortOptions: [{ label: 'ID Ascending', key: '+id' }, { label: 'ID Descending', key: '-id' }]
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      getUserList(this.listQuery).then(response => {
        this.list = response.records
        this.total = response.totalRecords
        // Just to simulate the time of the request
        this.listLoading = false
      })
    },
    handleFilter() {
      this.listQuery.curPage = 1
      this.getList()
    },
    deleteUser(userId) {
      this.$confirm('是否删除该用户？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const param = { 'userId': userId }
        deleteUser(param).then((res) => {
          if (res.data === true) {
            this.$message({
              message: '操作Success',
              type: 'success'
            })
            this.handleFilter()
          }
        })
      })
    },
    sortChange(data) {
      const { prop, order } = data
      if (prop === 'id') {
        this.sortByID(order)
      }
    },
    sortByID(order) {
      if (order === 'ascending') {
        this.listQuery.sort = '+id'
      } else {
        this.listQuery.sort = '-id'
      }
      this.handleFilter()
    },
    handleCreate() {
      this.$router.push({
        name: 'useredit',
        params: {
          opt: 'add'
        }
      })
    },
    handleUpdate(row) {
      this.$router.push({
        name: 'useredit',
        params: {
          opt: 'edit',
          id: row.userId
        }
      })
    },
    handleDelete(row) {
      this.$notify({
        title: 'Success',
        message: 'Delete Successfully',
        type: 'success',
        duration: 2000
      })
      const index = this.list.indexOf(row)
      this.list.splice(index, 1)
    },
    handleRoles(row) {
      this.$router.push({
        name: 'manageroles',
        params: {
          id: row.userId
        }
      })
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => {
        if (j === 'timestamp') {
          return parseTime(v[j])
        } else {
          return v[j]
        }
      }))
    },
    getSortClass: function(key) {
      const sort = this.listQuery.sort
      return sort === `+${key}`
        ? 'ascending'
        : sort === `-${key}`
          ? 'descending'
          : ''
    }
  }
}
</script>
