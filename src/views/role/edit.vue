<template>
  <div class="app-container">
    <el-col>
      <el-form ref="dataForm" :rules="rules" :model="role" label-position="left" label-width="100px" class="form-container" style="width: 600px; margin-left:50px;">
        <el-form-item label="角色代码" prop="roleCode">
          <el-input v-model="role.roleCode" />
        </el-form-item>
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="role.roleName" />
        </el-form-item>
        <el-form-item label="状态" prop="roleStatus">
          <FixcodeSelect :type="'1001'" :model.sync="role.roleStatus" :placeholder="'请选择状态'" :css="'width:500px'" />
        </el-form-item>
      </el-form>
      <div class="footer">
        <el-button icon="el-icon-caret-left" @click="cancel">
          返回
        </el-button>
        <el-button v-loading.fullscreen.lock="fullscreenLoading" type="primary" icon="el-icon-edit" @click="operation==='add'?createData():updateData()">
          保存
        </el-button>
      </div>
    </el-col>
  </div>
</template>

<script>
import { getToken } from '@/utils/auth'
import { createRole, fetchRoleInfo, updateRoleInfo } from '@/api/rolemanager'
import FixcodeSelect from '@/components/FixcodeSelect'

export default {
  name: 'Edit',
  components: { FixcodeSelect },
  data() {
    return {
      headers: { sid: getToken() },
      operation: '',
      fullscreenLoading: false,
      role: {
        roleId: '',
        roleCode: '',
        roleName: '',
        roleStatus: ''
      },
      rules: {
        roleCode: [{ required: true, message: 'code is required', trigger: 'blur' }],
        roleName: [{ required: true, message: 'name is required', trigger: 'blur' }],
        roleStatus: [{ required: true, message: 'status is required', trigger: 'blur' }]
      },
      downloadLoading: false
    }
  },
  created() {
    this.operation = this.$route.params.opt
    if (this.operation && this.operation === 'edit') {
      fetchRoleInfo(this.$route.params.id).then((res) => {
        this.role.roleId = res.data.roleId
        this.role.roleCode = res.data.roleCode
        this.role.roleName = res.data.roleName
        this.role.roleStatus = '' + res.data.roleStatus
      })
    }
  },
  methods: {
    handleFilter() {
      this.getList()
    },
    handleModifyStatus(row, status) {
      this.$message({
        message: '操作Success',
        type: 'success'
      })
      row.status = status
    },
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.fullscreenLoading = true
          createRole(this.role).then(() => {
            this.$notify({
              title: 'Success',
              message: 'Created Successfully',
              type: 'success',
              duration: 2000
            })
            this.$nextTick(() => {
              this.resetForm()
              this.fullscreenLoading = false
            })
          })
        }
      })
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.fullscreenLoading = true
          updateRoleInfo(this.role).then(() => {
            this.$notify({
              title: 'Success',
              message: 'Created Successfully',
              type: 'success',
              duration: 2000
            })
            this.$nextTick(() => {
              this.fullscreenLoading = false
            })
          })
        }
      })
    },
    cancel() {
      this.$router.back(-1)
    },
    resetForm() {
      this.role = {
        roleCode: '',
        roleName: '',
        roleStatus: ''
      }
    }
  }
}
</script>
<style>
.footer {
  margin-left: 300px;
}
.avatar-uploader {
  text-align: center;
  margin-top: 100px;
}
.avatar-uploader .el-upload--text {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload--text:hover {
  border-color: #409EFF;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
.el-upload--picture-card {
  background-color:#fbfdff;
  border:1px dashed #c0ccda;
  border-radius:6px;
  box-sizing:border-box;
  width:148px;
  height:148px;
  cursor:pointer;
  line-height:146px;
  vertical-align:top
}
</style>
