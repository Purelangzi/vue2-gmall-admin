<template>
  <div>
    <el-card class="attr-header">
      <CategorySelect @getCategoryId="getCategoryId" :show="showCategory"></CategorySelect>
    </el-card>

    <el-card class="attr-main">
      <div v-show="isShowTable">
        <el-button type="primary" class="btn-add el-icon-plus" @click="addAttr" :disabled="!category3Id">添加属性
        </el-button>
        <el-table :data="attrInfoList" border class="attr-table">
          <el-table-column type="index" label="序号" align="center" width="80px">
          </el-table-column>
          <el-table-column prop="attrName" label="属性名称" width="300px">
          </el-table-column>
          <el-table-column label="属性值列表" width="auto">
            <template v-slot="{ row }">
              <el-tag type="success" v-for="attrValue in row.attrValueList" :key="attrValue.id">{{
                  attrValue.valueName
              }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="250px">
            <template v-slot="{ row }">
              <el-button type="warning  " icon="el-icon-edit" @click="updateAttr(row)"></el-button>
              <el-button type="danger " icon="el-icon-delete" @click="deleteAttr(row)"></el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div v-show="!isShowTable">
        <el-form ref="form" :inline="true">
          <el-form-item label="属性名">
            <el-input v-model.trim="addOrUpdateAttrList.attrName" placeholder="请输入属性名"></el-input>
          </el-form-item>
        </el-form>
        <el-button type="primary" class="btn-add el-icon-plus" @click="addAttrValue"
          :disabled="showAddAttrValueBtn">添加属性值
        </el-button>
        <el-button @click="cancel()">取消</el-button>
        <el-table :data="addOrUpdateAttrList.attrValueList" border class="attr-table">
          <el-table-column type="index" label="序号" align="center" width="80px">
          </el-table-column>
          <el-table-column label="属性值名称" width="800px">
            <template v-slot="{ row }">
              <el-input v-show="row.showValueName" v-model.trim="row.valueName" @blur="saveAttrValue(row)"
                @keyup.native.enter="saveAttrValue(row)" size="mini" placeholder="请输入属性值名称"></el-input>
              <p v-show="!row.showValueName" @click="row.showValueName = true">{{ row.valueName }}</p>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="auto">
            <template v-slot="{ row }">
              <el-button type="danger" class="el-icon-delete" @click="deleteAttrValue(row)"></el-button>
            </template>
          </el-table-column>

        </el-table>
        <div class="btn-save-cancel">
          <el-button type="primary" @click="saveAttr()">保存</el-button>
          <el-button @click="cancel()">取消</el-button>
        </div>

      </div>
    </el-card>
  </div>
</template> 

<script>
export default {
  name: "Attr",
  data() {
    return {
      category1Id: "",
      category2Id: "",
      category3Id: "",
      attrInfoList: [],
      // 控制各级分类禁用
      showCategory: false,
      // 控制属性表格隐藏
      isShowTable: true,
      // 要添加或修改属性名和属性值的数据
      addOrUpdateAttrList: {
        attrName: '',// 属性名
        attrValueList: [], //属性值列表
        categoryId: '', // 三级分类的id
        categoryLevel: 3 // 区分哪级分类的id
      },

    };
  },
  methods: {
    getCategoryId({ categoryId, level }) {
      if (level == 1) {
        this.category1Id = categoryId;
        // 一级分类选择发生变化清空二三级id和属性数据
        this.category2Id = "";
        this.category3Id = "";
        this.attrInfoList = [];
      } else if (level == 2) {
        this.category2Id = categoryId;
        this.category3Id = "";
        this.attrInfoList = [];
      } else {
        this.category3Id = categoryId;
        // 有三级分类id才能发请求获取商品属性的数据
        this.getAttrInfoList();
      }
    },
    // 请求获取商品属性的数据
    async getAttrInfoList() {
      let { category1Id, category2Id, category3Id } = this;
      const { data } = await this.$API.attr.reqAttrInfoList(
        category1Id,
        category2Id,
        category3Id
      );
      this.attrInfoList = data;
    },
    // 添加商品属性
    addAttr() {
      this.isShowTable = false
      this.showCategory = true
      // 清空之前的属性名和属性值的数据和收集三级分类的id
      this.addOrUpdateAttrList = {
        attrName: '',
        attrValueList: [],
        categoryId: this.category3Id,
        categoryLevel: 3
      }
    },
    // 添加属性值
    addAttrValue() {
      //向属性值列表追加属性值名称和id
      this.addOrUpdateAttrList.attrValueList.push({
        // 修改属性的基础上添加新的属性值，要加上已有属性的id。添加属性值获取不到id，attrId为undefined
        attrId: this.addOrUpdateAttrList.id,
        valueName: '',
        // 切换查看或编辑模式，每一个属性值控制自己的模式切换
        showValueName: true
      })
    },
    // 保存添加或修改的属性值
    saveAttrValue(row) {
      // 属性值不允许为空
      if(!row.valueName){
        this.$message.warning('属性值不允许为空')
        return
      }
      // 属性值不允许重复
      let flag = this.addOrUpdateAttrList.attrValueList.some((el)=>{
        // 去除自身
        if(row!==el)
        return el.valueName ==row.valueName
      })
      if(flag){
        this.$message.warning('属性值不能重复！')
        row.valueName = ''
        return
      }
      row.showValueName = false
    },
    // 删除添加的属性值表格列
    deleteAttrValue() {

    },
    // 保存添加的属性名和属性值表格
    saveAttr() {

    },
    // 取消添加
    cancel() {
      this.isShowTable = true
      this.showCategory = false
    },

    // 更新商品属性
    updateAttr(row) {
      this.isShowTable = false;
      // 深拷贝
      this.addOrUpdateAttrList = JSON.parse(JSON.stringify(row))
    },
    // 删除商品属性
    deleteAttr(row) { },

  },
  computed: {
    showAddAttrValueBtn(){
      return !this.category3Id || !this.addOrUpdateAttrList.attrName
    }
  },
};
</script>

<style lang="scss" scoped>
.attr-header {
  margin: 20px 0;
}

.attr-main {
  .btn-add {
    margin: 20px 0;
  }

  .attr-table {
    .el-tag {
      margin: 10px 20px;
    }
  }

  .btn-save-cancel {
    margin-top: 20px;
  }
}
</style>
