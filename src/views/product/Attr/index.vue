<template>
  <div>
    <el-card style="margin: 20px 0px">
      <CategorySelect @getCategoryId="getCategoryId" :show="!isShowTable"></CategorySelect>
    </el-card>
    <el-card>
      <div v-show="isShowTable" >
        <el-button type="primary" icon="el-icon-plus" :disabled="!category3Id" @click="addAttr">添加属性</el-button>
        <el-table style="width: 100%" border :data="attrList">
          <el-table-column type="index" align="center" label="序号" width="80">
          </el-table-column>
          <el-table-column prop="attrName" label="属性名称" width="150">
          </el-table-column>
          <el-table-column prop="prop" label="属性值列表" width="width">
            <template slot-scope="{row,$index}">
              <el-tag type="success" v-for="(attrValue,index) in row.attrValueList" :key="attrValue.id" style="margin: 0px 20px">{{attrValue.valueName}}</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="prop" label="操作" width="150">
            <template slot-scope="{row,$index}">
              <el-button type="warning" icon="el-icon-edit" size="mini" @click="updateAttr(row)"></el-button>
              <el-button type="danger" icon="el-icon-delete" size="mini"></el-button>
            </template>
          </el-table-column>
        </el-table>

      </div>
      <div v-show="!isShowTable">
        <el-form :inline="true" ref="form" label-width="80px" :model="attrInfo">
          <el-form-item label="属性名">
            <el-input placeholder="请输入属性名" v-model="attrInfo.attrName"></el-input>
          </el-form-item>
        </el-form>
        <el-button type="primary" icon="el-icon-plus" @click="addAttrValue" :disabled="!attrInfo.attrName">添加属性值</el-button>
        <el-button @click="isShowTable=true">取消</el-button>
        <el-table style="width: 100%;margin: 20px 0px" border :data="attrInfo.attrValueList">
          <el-table-column type="index" label="序号" width="80" align="center"></el-table-column>
          <el-table-column label="属性值名称" width="width" prop="prop">
            <template slot-scope="{row,$index}">
              <el-input v-if="row.flag" @blur="toLook(row)" @keyup.native.enter="row.flag=false"
                        placeholder="请输入属性值名称" v-model="row.valueName" size="mini" :ref="$index"></el-input>
              <span v-else @click="toEdit(row,$index)" style="display: block">{{row.valueName}}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="width" align="center" prop="prop">
            <template slot-scope="{row,$index}">
              <el-popconfirm :title="`确定删除${row.valueName}？`" @onConfirm="deleteAttrValue($index)">
                <el-button type="danger" icon="el-icon-delete" size="mini" slot="reference"></el-button>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
        <el-button type="primary" @click="addOrUpdateAttr" :disabled="attrInfo.attrValueList.length<1">保存</el-button>
        <el-button @click="isShowTable=true">取消</el-button>
      </div>
    </el-card>
  </div>
</template>

<script>
import cloneDeep from 'lodash/cloneDeep'
import { reqAddOrUpdateAttr } from '@/api/product/attr'
export default {
  name: 'Attr',
  data(){
    return{
      category1Id:'',
      category2Id:'',
      category3Id:'',
      attrList:[],
      isShowTable:true,//控制表格显示与隐藏
      attrInfo:{
        attrName:'',
        attrValueList:[
        ],
        categoryId:0,
        categoryLevel:3,
      },
    }
  },
  methods:{
    getCategoryId({categoryId,level}){
      if(level==1){
        this.category1Id=categoryId
        this.category2Id=''
        this.category3Id=''
      }else if(level==2){
        this.category2Id=categoryId
        this.category3Id=''
      }else {
        this.category3Id=categoryId
        this.getAttrList()
      }
    },
    //  发请求获取平台属性数据
    async getAttrList(){
      const{category1Id,category2Id,category3Id}=this
      let result=await this.$API.attr.reqAttrList(category1Id,category2Id,category3Id)
      if(result.code==200){
        this.attrList=result.data
      }
    },
    //  添加属性值
    addAttrValue(){
      this.attrInfo.attrValueList.push({
        attrId:this.attrInfo.id,
        valueName:'',
        flag:true,
      })
      this.$nextTick(()=>{
        this.$refs[this.attrInfo.attrValueList.length-1].focus()
      })
    },
    //  添加属性
    addAttr(){
      this.isShowTable=false
      this.attrInfo= {
        attrName: '',
        attrValueList: [],
        categoryId: this.category3Id,
        categoryLevel: 3,
      }
    },
    //  修改某个属性
    updateAttr(row){
      this.isShowTable=false
      //  深拷贝
      this.attrInfo=cloneDeep(row)
      this.attrInfo.attrValueList.forEach(item=>{
        //  响应式添加 Vue.set
        this.$set(item,'flag',false)
      })
    },
    //  添加属性值 失焦时回调
    toLook(row) {
      //  属性值为空
      if(row.valueName.trim()==''){
        this.$message('属性值不能为空')
        return
      }
      // 属性值重复
      let isRepeat=this.attrInfo.attrValueList.some(item=>{
        if(row!==item){
          return row.valueName==item.valueName
        }
      })
      if(isRepeat){
        this.$message('属性值不能重复')
        return
      }
      row.flag=false
    },
    //  修改属性值（点击span变成input 编辑模式）
    toEdit(row,index){
      row.flag=true
      //  nextTick 当节点渲染完毕了 会执行一次
      this.$nextTick(()=>{
        this.$refs[index].focus()
      })

    },
    //  修改属性值——删除属性值——删除
    deleteAttrValue(index){
      this.attrInfo.attrValueList.splice(index,1)
    },
    //  保存(提交至服务器)
    async addOrUpdateAttr(){
      //  过滤掉空的属性值，并删除flag
      this.attrInfo.attrValueList=this.attrInfo.attrValueList.filter(item=>{
        if(item.valueName!=''){
          delete item.flag
          return true
        }
      })
      //  发请求
      try {
        await this.$API.attr.reqAddOrUpdateAttr(this.attrInfo)
        this.isShowTable=true
        this.$message({type:'success',message:'保存成功'})
        this.getAttrList()
      }catch (e){
        console.log(e)
      }
    }
  },
}
</script>

<style scoped>

</style>
