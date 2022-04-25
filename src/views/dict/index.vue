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
    </el-form>
    <el-row>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="el-icon-plus"
          size="mini"
          style="margin-bottom:20px;"
          @click="handleAdd"
        >新增</el-button>
      </el-col>
    </el-row>

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
        width="180"
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
          <el-button type="text" size="small" @click="handleEdit(scope.row)">编辑</el-button>
          <el-button type="text" size="small" @click="handleDel(scope.row)">删除</el-button>
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
  </div>
</template>

<script>
import { listType, delType } from '@/api/dict'

export default {
  data() {
    return {
      loading: true,
      currentPage: 1,
      total: 0,
      dateRange: [],
      queryParam: {
        dictName: '',
        dictType: '',
        beginTime: '',
        endTime: '',
        pageNum: 1,
        pageSize: 5
      },
      tableData: []
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
      console.log(row)
    },
    handleQuery() {
      // 搜索框有新的输入就调用
    },
    handleAdd() {
      // 新增记录
    },
    queryList() {
      this.queryParam.pageNum = 1
      if (this.dateRange.length > 1) {
        this.queryParam.beginTime = this.dateRange[0]
        this.queryParam.endTime = this.dateRange[1]
      }
      this.getList()
    },
    resetQuery() {
      this.queryParam.dictName = ''
      this.queryParam.dictType = ''
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
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
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
    }
  }
}
</script>

<style scoped>
.tab-container {
  margin: 30px;
}
</style>
