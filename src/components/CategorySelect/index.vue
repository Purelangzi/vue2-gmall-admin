<template>
  <div>
    <el-form :inline="true" :model="form" class="demo-form-inline">
      <el-form-item label="一级分类">
        <el-select
          v-model="form.category1Id"
          placeholder="请选择"
          @change="doneCategory1(form.category1Id)"
          :disabled="show"
        >
          <el-option
            v-for="cg1 in category1Data"
            :key="cg1.id"
            :label="cg1.name"
            :value="cg1.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="二级分类">
        <el-select
          v-model="form.category2Id"
          placeholder="请选择"
          @change="doneCategory2(form.category2Id)"
          :disabled="show"
        >
          <el-option
            v-for="cg2 in category2Data"
            :key="cg2.id"
            :label="cg2.name"
            :value="cg2.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="三级分类">
        <el-select
          v-model="form.category3Id"
          placeholder="请选择"
          @change="doneCategory3(form.category3Id)"
          :disabled="show"
        >
          <el-option
            v-for="cg3 in category3Data"
            :key="cg3.id"
            :label="cg3.name"
            :value="cg3.id"
          ></el-option>
        </el-select>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: "CategorySelect",
  props: ["show"],
  data() {
    return {
      form: {
        category1Id: "",
        category2Id: "",
        category3Id: "",
      },
      // 分类数据
      category1Data: [],
      category2Data: [],
      category3Data: [],
    };
  },
  methods: {
    // 获取一级分类数据
    async getCategory1() {
      const { data } = await this.$API.attr.reqCategory1List();
      this.category1Data = data;
    },
    // 一级分类选好后发生变化的回调
    async doneCategory1(categoryId) {
      // 清空
      this.category2Data = [];
      this.category3Data = [];
      this.form.category2Id = "";
      this.form.category3Id = "";
      // 利用自定义事件给父组件传递当前选好分类的id,以及方便父组件区分哪一级分类的level
      this.$emit('getCategoryId',{categoryId,level:1})
      const { data } = await this.$API.attr.reqCategory2List(categoryId);
      this.category2Data = data;
    },

    async doneCategory2(categoryId) {
      this.category3Data = [];
      this.form.category3Id = "";
      this.$emit('getCategoryId',{categoryId,level:2})
      const { data } = await this.$API.attr.reqCategory3List(categoryId);
      this.category3Data = data;
    },
    async doneCategory3(categoryId) {
      // 利用自定义事件给父组件传递当前选好分类的id
      this.$emit('getCategoryId',{categoryId,level:3})
    },
  },
  mounted() {
    this.getCategory1();
  }
};
</script>

<style lang='less' scoped>
</style>
