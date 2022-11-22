<template>
  <div>
    <el-button type="primary" size="default" @click="addTradeMark">+添加</el-button>
    <el-table :data="tradeMarkList" border stripe>
      <el-table-column prop="id" label="序号" width="100px" align="center"> </el-table-column>
      <el-table-column prop="tmName" label="品牌名称" width="auto"> </el-table-column>
      <el-table-column prop="logoUrl" label="品牌Logo" width="auto"> 
        <template v-slot="{ row }">
          <img style="width:180px;height:100px;" :src="row.logoUrl">
        </template>
      </el-table-column>
      <el-table-column label="操作" width="auto">
        <template v-slot="{ row }">
          <el-button type="warning " icon="el-icon-edit"  size="medium" @click="updateTradeMark(row)">修改</el-button>
          <el-button type="danger" icon="el-icon-delete" size="medium" @click="deleteTradeMark(row)">删除</el-button>
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
    <el-dialog
      :title="dialogTitle"
      :visible.sync="dialogVisible"
      width="50%"
      @close="handleDialogClose"
      >
      <el-form :model="tmForm" ref="tmForm" :rules="rules" style="width:80%;" label-width="100px" size="normal">
        <el-form-item label="品牌名称" prop="tmName">
          <el-input v-model="tmForm.tmName"></el-input>
        </el-form-item>
        <el-form-item label="品牌Logo" prop="logoUrl">
          <el-upload
            class="avatar-uploader"
            action="/dev-api/admin/product/fileUpload"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
            >
            <img v-if="tmForm.logoUrl" :src="tmForm.logoUrl" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            <div slot="tip" class="el-upload__tip">只能上传jpg/png文件,且大小不超过500kb</div>
          </el-upload>
          
        </el-form-item>
      </el-form>
      
      <span slot="footer">
        <el-button @click="cancel">取 消</el-button>
        <el-button type="primary" @click="submitTmForm('tmForm')">确 定</el-button>
      </span>
    </el-dialog>
    
  </div>
</template>

<script>
export default {
  name: "TradeMark",
  data() {
    // 品牌名称的验证规则
    var validateTmName = (rule, value, callback) =>{
      if (value.length<2 || value.length>10) {
        callback(new Error('长度在 2 到 10 个字符'))
      }else{
        callback()
      }
    }
    return {
      // 当前第几页
      page:1,
      // 每页显示的条数
      limit:5,
      total:0,
      // 品牌数据
      tradeMarkList:[],
      // 控制对话框显隐
      dialogVisible:false,
      // 对话框标题
      dialogTitle:'',
      // 要提交的品牌表单
      tmForm:{
        logoUrl:'',
        tmName:''
      },

      rules:{
        tmName:[
          {required:true,message: '请输入品牌名称',trigger:'blur'},
          {validator:validateTmName, trigger: 'change'}
        ],
        logoUrl:[
          {required:true,message:'请上传图片',trigger:'change'}
        ]
      }

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
    },
    // 表单框取消按钮
    cancel(){
      this.handleDialogClose()
    },
    // 添加品牌
    addTradeMark(){
      this.dialogTitle = '添加品牌'
      this.dialogVisible = true
    },
    // 修改品牌
    updateTradeMark(row){
      this.dialogTitle = '修改品牌'
      this.dialogVisible = true
      //不能直接this.tmForm=row，用深拷贝开辟新内存空间
      // 两种实现深拷贝：1.JSON的序列化和反序列化来实现深拷贝
      // 2.对象扩展运算符：一层深拷贝，二层及以上浅拷贝
      // $nextTick解决resetFields()将表单重置为初始值bug
      this.$nextTick(()=>{
        // this.tmForm = JSON.parse(JSON.stringify(row))
        this.tmForm = {...row}
      })
    },
    // 删除品牌
    deleteTradeMark(row){
      this.$confirm('确定要删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
        await this.$API.tradeMark.reqDeleteTradeMark(row.id)
        this.$message.success('删除成功')
        // 重新请求品牌数据
        this.getTradeMarkData()
      }).catch(() => {
        this.$message.info('已取消删除')         
      });
    },

    // 关闭表单框时的回调，对整个表单进行重置
    handleDialogClose(){
      this.$refs.tmForm.resetFields()
      this.dialogVisible = false
    },
    // 上传图片成功时的回调
    handleAvatarSuccess(res) {
      this.tmForm.logoUrl = res.data
    },
    // 上传图片前的回调
    beforeAvatarUpload(file) {
      const isJPG = file.type === 'image/jpeg' || 'image/png';
      // 1MB=1024KB,1KB=1024B
      const isLt500KB = file.size / 1024  < 500;
      if (!isJPG) {
        this.$message.error('上传LOGO图片只能是 jpg或png 格式!');
      }
      if (!isLt500KB) {
        this.$message.error('上传LOGO图片大小不能超过 500KB!');
      }
      return isJPG && isLt500KB;
    },
    // 提交品牌表单（添加或修改品牌信息）
    submitTmForm(tmForm){
      this.$refs[tmForm].validate(async(valid) => {
        // 表单检验成功
        if (valid) {
          await this.$API.tradeMark.reqAddOrUpdateTradeMark(this.tmForm)
          this.$message.success(!this.dialogTitle=='添加品牌'?'添加品牌成功':'修改品牌成功')
          // 重置表单
          this.handleDialogClose()
          // 重新请求品牌列表数据
          this.getTradeMarkData()
        } else {
          this.$message.warning('提交失败，不符合检验规则！')
          return false;
        }
      });
    }    
  },
  created() {},
};
</script>

<style  scoped>
 .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
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
  
  
</style>
