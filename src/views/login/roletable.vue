<template>
  <el-table
    :data="tableData"
    style="width: 100%"
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
        this.$router.addRoutes(routers)
        // routers.forEach((item, index) => {
        //   this.$router.options.routes[index + this.$router.options.routes.length - 1] = item
        // })
      })
      this.$router.push('/')
    }
  }
}
</script>

<style lang="scss">
/* 修复input 背景不协调 和光标变色 */
/* Detail see https://github.com/PanJiaChen/vue-element-admin/pull/927 */

$bg:#283443;
$light_gray:#fff;
$cursor: #fff;

@supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
  .login-container .el-input input {
    color: $cursor;
  }
}

/* reset element-ui css */
.login-container {
  .el-input {
    display: inline-block;
    height: 47px;
    width: 85%;

    input {
      background: transparent;
      border: 0px;
      -webkit-appearance: none;
      border-radius: 0px;
      padding: 12px 5px 12px 15px;
      color: $light_gray;
      height: 47px;
      caret-color: $cursor;

      &:-webkit-autofill {
        box-shadow: 0 0 0px 1000px $bg inset !important;
        -webkit-text-fill-color: $cursor !important;
      }
    }
  }

  .el-form-item {
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(0, 0, 0, 0.1);
    border-radius: 5px;
    color: #454545;
  }
}
</style>

<style lang="scss" scoped>
$bg:#2d3a4b;
$dark_gray:#889aa4;
$light_gray:#eee;

.login-container {
  min-height: 100%;
  width: 100%;
  background-color: $bg;
  overflow: hidden;

  .login-form {
    position: relative;
    width: 520px;
    max-width: 100%;
    padding: 160px 35px 0;
    margin: 0 auto;
    overflow: hidden;
  }

  .tips {
    font-size: 14px;
    color: #fff;
    margin-bottom: 10px;

    span {
      &:first-of-type {
        margin-right: 16px;
      }
    }
  }

  .svg-container {
    padding: 6px 5px 6px 15px;
    color: $dark_gray;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
  }

  .title-container {
    position: relative;

    .title {
      font-size: 26px;
      color: $light_gray;
      margin: 0px auto 40px auto;
      text-align: center;
      font-weight: bold;
    }
  }

  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
  }
}
</style>
