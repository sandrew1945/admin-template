<template>
  <el-container>
    <el-header>选择角色</el-header>
    <el-main>
      <el-row>
        <el-col :span="16" :push="8">
          <div class="grid-content bg-purple-dark">

            <el-table
              :data="tableData"
              style="width: 50%"
            >
              <el-table-column
                label="角色"
                width="380"
                property="roleName"
              />

              <el-table-column label="操作">
                <template slot-scope="scope">
                  <el-button
                    size="mini"
                    @click="handleSelect(scope.row.roleId)"
                  >选择</el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </el-col>
      </el-row>
    </el-main>
  </el-container>

</template>

<script>

// import { request } from 'http'
import { rFormat } from '@/router'
// import Layout from '@/layout'

export default {
  name: 'Login',
  data() {
    return {
      tableData: []
    }
  },
  created() {
    this.getRole()
  },
  methods: {
    getRole() {
      this.tableData = this.$store.getters.roles
    },
    async handleSelect(id) {
      // 将选择的角色ID存入vuex
      this.$store.dispatch('user/setRole', id)
      // 获取菜单
      await this.$store.dispatch('user/getMenu', id).then(response => {
        const routers = rFormat(response)
        this.$store.dispatch('user/setMenu', routers)
        // this.$router.addRoutes(routers)
      })
      this.$router.push('/')
    }
  }
}
</script>

<style lang="scss">
  .el-header, .el-footer {
    //background-color: #B3C0D1;
    color: #333;
    text-align: center;
    line-height: 60px;
  }
.el-main {
    //background-color: #E9EEF3;
    color: #333;
    text-align: center;
  }

</style>
