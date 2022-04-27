<template>
  <div class="tab-container">
    <el-form ref="queryForm" :model="queryParam" size="small" :inline="true" label-width="68px">
      <el-form-item label="字典名称" prop="dictName">
        <el-input
          v-model="queryParam.dictName"
          placeholder="请输入字典名称"
          clearable
          style="width: 240px"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="字典类型" prop="dictType">
        <el-input
          v-model="queryParam.dictType"
          placeholder="请输入字典类型"
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
<!--    <el-row>-->
<!--      <el-col :span="1.5">-->
<!--        <el-button-->
<!--          type="danger"-->
<!--          plain-->
<!--          icon="el-icon-plus"-->
<!--          size="mini"-->
<!--          style="margin-bottom:20px;"-->
<!--          @click="handleAdd"-->
<!--        >新增</el-button>-->
<!--      </el-col>-->
<!--    </el-row>-->

    <el-table
      v-loading="loading"
      :data="tableData"
      border
      style="width: 100%"
    >
      <el-table-column
        type="index"
        label="序号"
        width="50"
      />
      <el-table-column
        prop="dictName"
        label="字典名称"
        width="180"
      />
      <el-table-column
        prop="dictType"
        label="字典类型"
        width="180"
      />
      <el-table-column
        prop="remark"
        label="字典描述"
        width="400"
      />
      <el-table-column
        prop="status"
        label="字典状态"
        width="180"
      />
      <el-table-column
        prop="createTime"
        label="创建时间"
      />
      <el-table-column
        prop="createBy"
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
    <el-pagination
      :current-page="currentPage"
      :page-sizes="[5, 10, 15]"
      :page-size="100"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
    <el-dialog title="字典信息" :visible.sync="dialog">
      <el-form :model="dictData" ref="dictData" label-width="80px" :rules="dictRules">
        <el-form-item label="字典名称" prop="dictName">
          <el-input v-model="dictData.dictName" autocomplete="off" />
        </el-form-item>
        <el-form-item label="字典类型" prop="dictType">
          <el-input v-model="dictData.dictType" autocomplete="off" />
        </el-form-item>
        <el-form-item label="字典描述">
          <el-input v-model="dictData.remark" autocomplete="off" />
        </el-form-item>
        <el-form-item label="字典状态">
          <el-switch v-model="switchStatus" />
        </el-form-item>
        <el-form-item v-if="showFlag" label="创建信息">
          <el-col :span="8">
            <el-input v-model="dictData.createTime" :disabled="true" style="width: 100%;" />
          </el-col>
          <el-col :span="8">
            <el-input v-model="dictData.createBy" :disabled="true" style="width: 100%;" />
          </el-col>
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
import { listType, delType, getType, updateOrSaveType } from '@/api/dict'

export default {
  data() {
    return {
      loading: true,
      currentPage: 1,
      total: 0,
      dialog: false,
      dateRange: [],
      queryParam: {
        dictName: '',
        dictType: '',
        beginTime: '',
        endTime: '',
        pageNum: 1,
        pageSize: 5
      },
      tableData: [],
      dictData: {},
      switchStatus: true,
      showFlag: true,
      dictRules: {
        dictName: [{ required: true, message: '请输入字典名称', trigger: 'blur' }],
        dictType: [{ required: true, message: '请输入字典类型', trigger: 'blur' }]
      }
    }
  },
  watch: {
  },
  created() {
    this.getList()
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
      this.getTypeById(row.dictId)
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
      this.dictData = {}
      this.switchStatus = true
      this.dialog = true
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
      this.queryParam.dictName = ''
      this.queryParam.dictType = ''
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
        delType(row.dictType).then(response => {
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
      listType(this.queryParam).then(response => {
        this.tableData = response.data.records
        let i
        for (i = 0; i < this.tableData.length; i++) {
          const data = this.tableData[i]
          if (data.status === '1') {
            data.status = '正常'
          } else {
            data.status = '停用'
          }
        }
        this.total = response.data.total
        this.currentPage = response.data.current
        this.loading = false
      }
      )
    },
    getTypeById(dictId) {
      getType(dictId).then(response => {
        this.dictData = response.data
        if (this.dictData.status === '0') {
          this.switchStatus = false
        } else {
          this.switchStatus = true
        }
      })
    },
    updateTypeByIdOrSave() {
      if (this.switchStatus) {
        this.dictData.status = '1'
      } else {
        this.dictData.status = '0'
      }
      updateOrSaveType(this.dictData).then(response => {
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
