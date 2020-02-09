<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.roleCode" placeholder="角色代码" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-input v-model="listQuery.roleName" placeholder="角色名称" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <FixcodeSelect :type="'1001'" :model.sync="listQuery.roleStatus" :placeholder="'角色状态'" :css="'width: 130px'" />
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
          <el-button size="mini" type="danger" @click="handleDelete(row.roleId)">
            删除
          </el-button>
          <el-button type="warning" size="mini" @click="handlePermission(row)">
            权限
          </el-button>
        </template>
      </el-table-column>
    </SimpleTable>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />
  </div>
</template>

<script>
import { getRoleList, deleteRole } from '@/api/rolemanager'
import waves from '@/directive/waves' // waves directive
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
        roleCode: undefined,
        roleName: undefined,
        roleStatus: ''
      },
      columns: [
        { header: '序号', type: 'index', width: '100px', dataIndex: '' },
        { header: '角色代码', type: 'data', width: '', dataIndex: 'roleCode' },
        { header: '角色名称', type: 'data', width: '', dataIndex: 'roleName' },
        { header: '状态', type: 'fixcode', width: '', dataIndex: 'roleStatus' }
      ]
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      getRoleList(this.listQuery).then(response => {
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
    handleDelete(roleId) {
      this.$confirm('是否删除该角色？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const param = { 'roleId': roleId }
        deleteRole(param).then((res) => {
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
    handleCreate() {
      this.$router.push({
        name: 'roleedit',
        params: {
          opt: 'add'
        }
      })
    },
    handleUpdate(row) {
      this.$router.push({
        name: 'roleedit',
        params: {
          opt: 'edit',
          id: row.roleId
        }
      })
    },
    handlePermission(row) {
      this.$router.push({
        name: 'managepermission',
        params: {
          id: row.roleId
        }
      })
    }
  }
}
</script>
