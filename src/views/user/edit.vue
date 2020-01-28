<template>
  <div class="app-container">
    <el-row>
      <el-col :span="8">
        <div class="avatar-block">
          <el-upload
            class="avatar-uploader"
            :headers="headers"
            :action="actionUrl"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
          >
            <img v-if="imageUrl" :src="imageUrl" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon" />
          </el-upload>
        </div>
      </el-col>
      <el-col :span="16">
        <el-form ref="dataForm" :rules="rules" :model="user" label-position="left" label-width="100px" class="form-container" style="width: 400px; margin-left:50px;">
          <el-form-item label="用户代码" prop="userCode">
            <el-input v-model="user.userCode" />
          </el-form-item>
          <el-form-item label="姓名" prop="userName">
            <el-input v-model="user.userName" />
          </el-form-item>
          <el-form-item label="性别" prop="sex">
            <el-select v-model="user.sex" class="filter-item" placeholder="Please select">
              <el-option v-for="item in sexOptions" :key="item.key" :label="item.value" :value="item.key" />
            </el-select>
          </el-form-item>
          <el-form-item label="生日" prop="birthday">
            <el-date-picker v-model="user.birthday" type="date" placeholder="Please pick a date" />
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input v-model="user.password" type="password" />
          </el-form-item>
          <el-form-item label="状态" prop="userStatus">
            <el-select v-model="user.userStatus" class="filter-item" placeholder="Please select">
              <el-option v-for="item in statusOptions" :key="item.key" :label="item.value" :value="item.key" />
            </el-select>
          </el-form-item>
          <el-form-item label="电话" prop="phone">
            <el-input v-model="user.phone" style="" placeholder="Please input phone" />
          </el-form-item>
          <el-form-item label="手机" prop="mobile">
            <el-input v-model="user.mobile" style="" placeholder="Please input mobile" />
          </el-form-item>
          <el-form-item label="电子邮件" prop="email">
            <el-input v-model="user.email" style="" placeholder="Please input Email" />
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
    </el-row>
  </div>
</template>

<script>
import { parseTime } from '@/utils'
import { getSelectOption } from '@/utils/fixcode'
import { getToken } from '@/utils/auth'
import { createUser, fetchUserInfo, updateUserInfo } from '@/api/usermanager'

export default {
  name: 'Edit',
  filters: {
  },
  data() {
    return {
      headers: { sid: getToken() },
      actionUrl: process.env.VUE_APP_BASE_API + '/generate/uploadImg',
      imageUrl: '',
      statusOptions: getSelectOption('1001'),
      sexOptions: getSelectOption('1002'),
      operation: '',
      fullscreenLoading: false,
      user: {
        userId: '',
        userCode: '',
        userName: '',
        password: '',
        phone: '',
        mobile: '',
        email: '',
        sex: '',
        birthday: '',
        avatar: '',
        userStatus: ''
      },
      rules: {
        userCode: [{ required: true, message: 'code is required', trigger: 'blur' }],
        userName: [{ required: true, message: 'name is required', trigger: 'blur' }],
        // birthday: [{ required: true, message: 'birthday is required', trigger: 'change' }],
        password: [{ required: true, message: 'title is required', trigger: 'blur' }],
        userStatus: [{ required: true, message: 'status is required', trigger: 'blur' }]
      },
      downloadLoading: false
    }
  },
  created() {
    this.operation = this.$route.params.opt
    if (this.operation && this.operation === 'edit') {
      this.rules.password[0].required = false
      fetchUserInfo(this.$route.params.id).then((res) => {
        this.user.userId = res.data.userId
        this.user.userCode = res.data.userCode
        this.user.userName = res.data.userName
        this.user.phone = res.data.phone
        this.user.mobile = res.data.mobile
        this.user.email = res.data.email
        this.user.sex = res.data.sex
        this.user.birthday = res.data.birthday
        this.user.avatar = res.data.avatar
        this.user.userStatus = res.data.userStatus
        this.imageUrl = process.env.VUE_APP_BASE_API + '/generate/loadImage?filePath=' + res.data.avatar
      })
    }
  },
  methods: {
    beforeAvatarUpload() {
    },
    handleAvatarSuccess(res) {
      this.imageUrl = process.env.VUE_APP_BASE_API + '/generate/loadImage?filePath=' + res.data
      this.user.avatar = res.data
    },
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
          createUser(this.user).then(() => {
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
          updateUserInfo(this.user).then(() => {
            this.$notify({
              title: 'Success',
              message: 'Created Successfully',
              type: 'success',
              duration: 2000
            })
            this.$nextTick(() => {
              // this.resetForm()
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
      this.user = {
        userId: '',
        userCode: '',
        userName: '',
        password: '',
        phone: '',
        mobile: '',
        email: '',
        sex: '',
        birthday: new Date(),
        avatar: '',
        userStatus: ''
      }
      this.imageUrl = ''
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => {
        if (j === 'timestamp') {
          return parseTime(v[j])
        } else {
          return v[j]
        }
      }))
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
