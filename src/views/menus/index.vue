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
          <svg-icon v-if="scope.row.isEl === '2'" :icon-class="scope.row.icon" />
          <i v-if="scope.row.isEl === '1'" :class="scope.row.icon" />
        </template>
      </el-table-column>
      <el-table-column
        prop="type"
        label="类型"
        align="center"
        width="150"
      />
      <el-table-column
        prop="name"
        label="菜单编码"
        align="center"
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
    <el-dialog title="菜单信息" :visible.sync="dialog">
      <el-form ref="dictData" :model="dictData" label-width="80px" :rules="dictRules" :inline="true">
        <el-row>
          <el-form-item label="父级菜单" prop="parentId">
            <el-tree ref="menuTree" node-key="id" :data="groupData" :props="defaultProps" show-checkbox check-strictly :default-expanded-keys="openId" style="font-weight: bold;" @node-click="handleNodeClick" @check-change="handleCheckChange" />
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="菜单名称" prop="title">
            <el-input v-model="dictData.title" autocomplete="off" />
          </el-form-item>
          <el-form-item label="菜单排序" prop="sort">
            <el-input v-model="dictData.sort" autocomplete="off" />
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="菜单图标" prop="icon">
            <el-input v-model="dictData.icon" autocomplete="off" />
          </el-form-item>
          <el-form-item label="权限" prop="permission">
            <el-input v-model="dictData.permission" autocomplete="off" />
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="菜单类型" prop="type">
            <template>
              <el-radio-group v-model="type" @change="groupRadioChange">
                <el-radio :label="'M'">目录</el-radio>
                <el-radio :label="'C'">菜单</el-radio>
                <el-radio :label="'O'">按钮</el-radio>
              </el-radio-group>
            </template>
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="状态">
            <el-switch v-model="dictData.status" />
          </el-form-item>
        </el-row>
        <el-row v-if="showFlag">
          <el-form-item label="菜单编码" prop="name">
            <el-input v-model="dictData.name" autocomplete="off" />
          </el-form-item>
          <el-form-item label="页面路径" prop="component">
            <el-input v-model="dictData.component" autocomplete="off" />
          </el-form-item>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="resetForm('dictData')">取 消</el-button>
        <el-button type="primary" @click="confimEdit('dictData')">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { list, getMenusGroup, getPermission, updateOrSaveData, delPermission } from '@/api/menus'

export default {
  data() {
    const validateTree = (rule, value, callback) => {
      const arr = this.$refs.menuTree.getCheckedKeys()
      if (arr.length === 0 || !arr) {
        callback(new Error('请选择父级菜单'))
      } else {
        callback()
      }
    }
    return {
      groupData: [],
      defaultProps: {
        children: 'children',
        label: 'label'
      },
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
      type: 'M',
      dictData: {},
      showFlag: true,
      dictRules: {
        parentId: [{ required: true, validator: validateTree, trigger: 'change' }],
        title: [{ required: true, message: '请输入菜单名称', trigger: 'blur' }],
        sort: [{ required: true, message: '请输入菜单排序', trigger: 'blur' }],
        icon: [{ required: true, message: '请输入菜单图标', trigger: 'blur' }],
        permission: [{ required: true, message: '请输入权限', trigger: 'blur' }],
        name: [{ required: true, message: '请输入菜单编码', trigger: 'blur' }],
        component: [{ required: true, message: '请输入页面路径', trigger: 'blur' }]
      },
      switchStatus: true,
      dialogValue: '',
      options: [],
      treeId: 0,
      openId: [0]
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
    handleNodeClick(data) {
      console.log(data)
    },
    handleCheckChange(item, checked, self) {
      if (checked) {
        this.treeId = item.id
        this.$refs.menuTree.setCheckedKeys([item.id])
      }
    },
    handleEdit(row) {
      getMenusGroup(1).then(response => {
        this.groupData = response.data
        this.getPermissionById(row.id)
        this.dialog = true
      })
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
      this.dictData = {}
      this.dictData.status = true
      this.type = 'M'
      this.dialog = true
      getMenusGroup(1).then(response => {
        this.groupData = response.data
        this.$refs.menuTree.setCheckedKeys([0])
      })
    },
    groupRadioChange(value) {
      if (value === 'O') {
        this.showFlag = false
      } else {
        this.showFlag = true
      }
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
      this.$confirm('此操作将删除该数据及其子数据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 这里写删除请求
        delPermission(row.id).then(response => {
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
        this.loading = false
      }
      )
    },
    getPermissionById(id) {
      getPermission(id).then(response => {
        this.dictData = response.data
        if (this.dictData.parentId === 0) {
          this.$refs.menuTree.setCheckedKeys([response.data.parentId])
        } else {
          const arr = [response.data.parentId]
          this.openId = arr
          this.$refs.menuTree.setCheckedKeys([response.data.parentId])
        }
        this.treeId = response.data.parentId
        if (this.dictData.status === '1') {
          this.dictData.status = true
        } else {
          this.dictData.status = false
        }
        this.type = this.dictData.type
        if (this.type === 'O') {
          this.showFlag = false
        } else {
          this.showFlag = true
        }
      })
      this.getChild(id, this.groupData)
    },
    getChild(id, arr) {
      for (let i = 0; i < arr.length; i++) {
        if (id === arr[i].id) {
          arr[i].disabled = true
        } else {
          if (arr[i].children !== undefined && arr[i].children.length > 0) {
            this.getChild(id, arr[i].children)
          }
        }
      }
    },
    updateTypeByIdOrSave() {
      if (this.dictData.status) {
        this.dictData.status = '1'
      } else {
        this.dictData.status = '0'
      }
      this.dictData.type = this.type
      this.dictData.parentId = this.treeId
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
