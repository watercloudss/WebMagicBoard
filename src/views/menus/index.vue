<template>
  <div class="tab-container">
    <el-form ref="queryForm" :model="queryParam" size="small" :inline="true" label-width="68px">
      <el-form-item label="菜单名称" prop="title">
        <el-input
          v-model="queryParam.title"
          placeholder="请输入菜单名称"
          clearable
          style="width: 240px"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="创建时间">
        <el-date-picker
          v-model="dateRange"
          style="width: 240px"
          value-format="yyyy-MM-dd"
          type="daterange"
          range-separator="-"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="queryList">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
      <el-form-item>
        <el-button
          type="danger"
          plain
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
        >新增</el-button>
      </el-form-item>
    </el-form>

    <el-table
      v-loading="loading"
      :data="tableData"
      row-key="id"
      :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
      style="width: 100%"
    >
      <el-table-column
        prop="title"
        label="菜单名称"
      />
      <el-table-column
        prop="icon"
        label="图标"
        align="center"
        width="80"
      >
        <template slot-scope="scope">
          <svg-icon v-if="!scope.row.isEl" :icon-class="scope.row.icon" />
          <i v-if="scope.row.isEl" :class="scope.row.icon" />
        </template>
      </el-table-column>
      <el-table-column
        prop="type"
        label="类型"
        align="center"
        width="150"
      />
      <el-table-column
        prop="component"
        label="路径"
        align="center"
      />
      <el-table-column
        prop="permission"
        label="权限"
        align="center"
      />
      <el-table-column
        prop="status"
        label="状态"
        align="center"
        width="100"
      />
      <el-table-column
        prop="createTime"
        label="创建时间"
        width="160"
      />
      <el-table-column
        prop="createBy"
        align="center"
        label="创建人"
      />
      <el-table-column
        fixed="right"
        label="操作"
        width="100"
      >
        <template slot-scope="scope">
          <el-button type="primary" size="mini" icon="el-icon-edit" circle @click="handleEdit(scope.row)" />
          <el-button type="danger" size="mini" icon="el-icon-delete" circle @click="handleDel(scope.row)" />
        </template>
      </el-table-column>
    </el-table>
    <!--    <el-pagination-->
    <!--      :current-page="currentPage"-->
    <!--      :page-sizes="[10, 15, 20]"-->
    <!--      :page-size="100"-->
    <!--      layout="total, sizes, prev, pager, next, jumper"-->
    <!--      :total="total"-->
    <!--      @size-change="handleSizeChange"-->
    <!--      @current-change="handleCurrentChange"-->
    <!--    />-->
    <el-dialog title="用户信息" :visible.sync="dialog">
      <el-form ref="dictData" :model="dictData" label-width="80px" :rules="dictRules">
        <el-form-item label="用户账号" prop="username">
          <el-input v-model="dictData.username" autocomplete="off" :disabled="showFlag" />
        </el-form-item>
        <el-form-item label="名称" prop="name">
          <el-input v-model="dictData.name" autocomplete="off" :disabled="showFlag" />
        </el-form-item>
        <el-form-item v-if="showFlag" label="头像">
          <el-image
            style="width: 50px; height: 50px"
            :src="dictData.avatar"
            :preview-src-list="dictData.avatars"
          />
        </el-form-item>
        <el-form-item v-if="!showFlag" label="头像地址">
          <el-input v-model="dictData.avatar" autocomplete="off" :disabled="showFlag" />
        </el-form-item>
        <el-form-item label="生日">
          <el-input v-model="dictData.birthday" autocomplete="off" :disabled="showFlag" />
        </el-form-item>
        <el-form-item label="性别">
          <template>
            <el-radio-group v-model="dictData.sex">
              <el-radio :label="true">男</el-radio>
              <el-radio :label="false">女</el-radio>
            </el-radio-group>
          </template>
        </el-form-item>
        <el-form-item label="电话">
          <el-input v-model="dictData.phone" autocomplete="off" />
        </el-form-item>
        <el-form-item label="邮箱">
          <el-input v-model="dictData.email" autocomplete="off" />
        </el-form-item>
        <el-form-item label="描述">
          <el-input v-model="dictData.introduction" autocomplete="off" />
        </el-form-item>
        <el-form-item v-if="showFlag" label="创建信息">
          <el-col :span="8">
            <el-input v-model="dictData.createTime" :disabled="true" style="width: 100%;" />
          </el-col>
          <el-col :span="8">
            <el-input v-model="dictData.createBy" :disabled="true" style="width: 100%;" />
          </el-col>
        </el-form-item>
        <el-form-item label="角色" prop="roleCode">
          <el-select v-model="dictData.roleCode" placeholder="请选择角色">
            <el-option
              v-for="item in options"
              :key="item.role_code"
              :label="item.role_name"
              :value="item.role_code"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="状态">
          <el-switch v-model="switchStatus" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="resetForm('dictData')">取 消</el-button>
        <el-button type="primary" @click="confimEdit('dictData')">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { get, updateOrSaveData, del } from '@/api/users'
import { list } from '@/api/menus'

export default {
  data() {
    return {
      loading: true,
      currentPage: 1,
      total: 0,
      dialog: false,
      dateRange: [],
      queryParam: {
        title: '',
        beginTime: '',
        endTime: '',
        pageNum: 1,
        pageSize: 10
      },
      tableData: [],
      dictData: {},
      showFlag: true,
      dictRules: {
        username: [{ required: true, message: '请输入用户账号', trigger: 'blur' }],
        name: [{ required: true, message: '请输入名称', trigger: 'blur' }],
        roleCode: [{ required: true, message: '请选择角色', trigger: 'change' }]
      },
      switchStatus: true,
      dialogValue: '',
      options: []
    }
  },
  watch: {
  },
  created() {
    this.getList()
    this.getListTypeGroup()
  },
  methods: {
    handleSizeChange(val) {
      this.queryParam.pageSize = val
      this.getList()
    },
    handleCurrentChange(val) {
      this.queryParam.pageNum = val
      this.getList()
    },
    handleEdit(row) {
      this.showFlag = true
      this.dialog = true
      this.getTypeById(row.id)
    },
    confimEdit(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.updateTypeByIdOrSave()
        } else {
          return false
        }
      })
    },
    getListTypeGroup() {
      // roleGroup().then(response => {
      //   this.options = response.data
      // })
    },
    resetForm(formName) {
      this.dialog = false
      this.$refs[formName].resetFields()
    },
    handleQuery() {
      // 搜索框有新的输入就调用
    },
    handleAdd() {
      // 新增记录
      this.showFlag = false
      this.dialog = true
      this.$refs['dictData'].resetFields()
      this.dictData = {}
      this.dialogValue = ''
    },
    queryList() {
      this.queryParam.pageNum = 1
      if (this.dateRange && this.dateRange.length > 1) {
        this.queryParam.beginTime = this.dateRange[0]
        this.queryParam.endTime = this.dateRange[1]
      }
      this.getList()
    },
    resetQuery() {
      this.queryParam.roleCode = ''
      this.queryParam.roleName = ''
      this.queryParam.beginTime = ''
      this.queryParam.endTime = ''
      this.dateRange = []
    },
    handleDel(row) {
      this.$confirm('此操作将删除该数据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 这里写删除请求
        del(row.id).then(response => {
          if (response.success) {
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
            this.getList()
          } else {
            this.$message({
              type: 'error',
              message: '删除失败!'
            })
          }
        })
      }).catch(() => {
        // this.$message({
        //   type: 'info',
        //   message: '已取消删除'
        // })
      })
    },
    getList() {
      this.loading = true
      list(this.queryParam).then(response => {
        this.tableData = response.data
        for (let i = 0; i < this.tableData.length; i++) {
          if (this.tableData[i].status) {
            this.tableData[i].status = '停用'
          } else {
            this.tableData[i].status = '正常'
          }
        }
        this.loading = false
      }
      )
    },
    getTypeById(id) {
      get(id).then(response => {
        this.dictData = response.data
        this.dictData.avatars = [this.dictData.avatar]
        this.switchStatus = !this.dictData.status
        this.dialogValue = this.dictData.roleCode
      })
    },
    updateTypeByIdOrSave() {
      this.dictData.status = !this.switchStatus
      updateOrSaveData(this.dictData).then(response => {
        if (response.success) {
          this.$message({
            type: 'success',
            message: '操作成功!'
          })
          this.dialog = false
          this.getList()
        } else {
          this.$message({
            type: 'error',
            message: '操作失败!'
          })
        }
      })
    }
  }
}
</script>

<style scoped>
.tab-container {
  margin: 30px;
}
</style>
