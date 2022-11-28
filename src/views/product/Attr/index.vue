<template>
  <div>
    <el-card class="attr-header">
      <CategorySelect @getCategoryId="getCategoryId"></CategorySelect>
    </el-card>

    <el-card class="attr-main">
      <el-button type="primary" size="default" class="btn-add" @click="addAttr">+添加属性</el-button>
      <el-table :data="attrInfoList" border class="attr-table">
        <el-table-column label="序号" align="center" width="80px">
          <template v-slot="{ $index }">
            {{ $index + 1 }}
          </template>
        </el-table-column>
        <el-table-column prop="attrName" label="属性名称" width="300px"> </el-table-column>
        <el-table-column label="属性值列表" width="auto">
          <template v-slot="{ row }">
            <el-tag
              type="success"
              size="normal"
              v-for="attrValue in row.attrValueList"
              :key="attrValue.id"
              >{{ attrValue.valueName }}</el-tag
            >
          </template>
        </el-table-column>
        <el-table-column label="操作" width="250px">
          <template v-slot="{ row }">
            <el-button type="warning  " size="default" icon="el-icon-edit" @click="updateAttr(row)"></el-button>
            <el-button type="danger " size="default" icon="el-icon-delete" @click="deleteAttr(row)"></el-button>
          </template>
        </el-table-column>
      </el-table>
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
    };
  },
  methods: {
    getCategoryId({ categoryId, level }) {
      if (level == 1) {
        this.category1Id = categoryId;
        // 一级分类选择发生变化清空二三级id
        this.category2Id = "";
        this.category3Id = "";
      } else if (level == 2) {
        this.category2Id = categoryId;
        this.category3Id = "";
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
    // 更新商品属性
    updateAttr(row){

    },
    // 删除商品属性
    deleteAttr(row){

    }
  },
  mounted() {},
};
</script>

<style lang='scss' scoped>
.attr-header{
  margin: 20px 0;
}
.attr-main{
  .btn-add{
    margin: 20px 0;
  }
  .attr-table{
    
    .el-tag{
      margin:10px 20px;
    }
  }
  
}
</style>
