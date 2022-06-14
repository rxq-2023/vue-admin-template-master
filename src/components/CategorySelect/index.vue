<template>
  <div>
    <el-form :inline="true" class="demo-form-inline" :model="cForm">
      <el-form-item label="一级分类">
        <el-select placeholder="请选择" v-model="cForm.category1Id" @change="handler1">
          <el-option :label="c1.name" :value="c1.id" v-for="(c1,index) in list1" :key="c1.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="二级分类">
        <el-select placeholder="请选择" v-model="cForm.category2Id" @change="handler2">
          <el-option :label="c2.name" :value="c2.id" v-for="(c2,index) in list2" :key="c2.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="三级分类">
        <el-select placeholder="请选择" v-model="cForm.category3Id" @change="handler3">
          <el-option :label="c3.name" :value="c3.id" v-for="(c3,index) in list3" :key="c3.id"></el-option>
        </el-select>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { reqCategory1List } from '@/api/product/attr'

export default {
  name: 'CategorySelect',
  mounted() {
    //  获取一级分类
    this.getCategory1List()
  },
  data(){
    return{
      list1:[],
      list2:[],
      list3:[],
      cForm:{
        category1Id:'',
        category2Id:'',
        category3Id:'',
      }
  }},
  methods:{
    //  获取1级分类目录
    async getCategory1List(){
      let result=await this.$API.attr.reqCategory1List()
      if(result.code==200){
        this.list1=result.data
      }
    },
    //  1级分类发生变化时回调
    async handler1(){
      const {category1Id}=this.cForm
      let result=await this.$API.attr.reqCategory2List(category1Id)
      if(result.code==200){
        this.list2=result.data
      }
    },
    //  2级分类发生变化时回调
    async handler2(){
      const {category2Id}=this.cForm
      let result=await this.$API.attr.reqCategory3List(category2Id)
      if(result.code==200){
        this.list3=result.data
      }
    },
    //  2级分类发生变化时回调
    handler3(){

    }
  },
}
</script>

<style scoped>

</style>
