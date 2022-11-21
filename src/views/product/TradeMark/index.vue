<template>
  <div>
    <el-button type="primary" size="default">+添加</el-button>
    <el-table :data="tradeMarkList" border stripe>
      <el-table-column prop="id" label="序号" width="100px" align="center"> </el-table-column>
      <el-table-column prop="tmName" label="品牌名称" width="auto"> </el-table-column>
      <el-table-column prop="logoUrl" label="品牌Logo" width="auto"> 
        <template v-slot="{ row }">
          <img style="height:100px;" :src="row.logoUrl">
        </template>
      </el-table-column>
      <el-table-column label="操作" width="auto">
        <template v-slot="{ row,$index }">
          <el-button type="warning " icon="el-icon-edit"  size="medium" @click="handleEdit(row,$index)">修改</el-button>
          <el-button type="danger" icon="el-icon-delete" size="medium" @click="handleDelete(row,$index)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      style="margin-top:20px;text-align:center"
      @size-change="limitChange"
      @current-change="pageChange"
      :current-page.sync="page"
      :page-sizes="[3, 5, 7, 10]"
      :page-size="limit"
      layout=" prev, pager, next, jumper,->,sizes,total"
      :total="total" background>
      :pager-count="7">
    </el-pagination>
    
  </div>
</template>

<script>
export default {
  name: "TradeMark",
  data() {
    return {
      // 当前第几页
      page:1,
      // 每页显示的条数
      limit:5,
      total:0,
      tradeMarkList:[]        
    };
  },
  mounted() {
    this.getTradeMarkData()
  },
  methods: {
    // 请求品牌列表数据
    async getTradeMarkData(){
      const {page, limit} = this
      const {data} = await this.$API.tradeMark.reqTradeMark(page,limit)
      this.total = data.total
      this.tradeMarkList = data.records
    },
    // 每页显示的条数改变时会触发
    limitChange(limit){
      this.limit = limit
      this.getTradeMarkData()
    },
    // 	当前页码改变时会触发
    pageChange(page){
      this.page = page
      this.getTradeMarkData()
    }
  },
  created() {},
};
</script>

<style lang='less' scoped>
</style>
