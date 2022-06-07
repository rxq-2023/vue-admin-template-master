<template>
  <div>
    <el-button type="primary" icon="el-icon-plus" style="margin: 10px 0px">添加</el-button>
    <el-table style="width: 100%" border :data="list">
      <el-table-column label="序号" type="index" width="80px" align="center"></el-table-column>
      <el-table-column prop="tmName" label="品牌名称" width="width"></el-table-column>
      <el-table-column  prop="logoUrl" label="品牌LOGO" width="width">
        <!--这里插槽是UI库定义好了的
        https://element.eleme.cn/#/zh-CN/component/table#table-column-scoped-slot
        -->
        <template slot-scope="{row,$index}">
          <img :src="row.logoUrl" style="width: 100px;height: 100px"></img>
        </template>
      </el-table-column>
      <el-table-column prop="prop" label="操作" width="width">
        <template slot-scope="{row,$index}">
          <el-button type="warning" icon="el-icon-edit" size="mini">修改</el-button>
          <el-button type="danger" icon="el-icon-delete" size="mini">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      style="margin-top: 20px;text-align: center"
      :current-page="page"
      :total="total"
      :page-size="limit"
      :pager-count="7"
      :page-sizes="[3,5,10]"
      layout="prev,pager,next,jumper,->,sizes,total"
      @current-change="getPageList"
      @size-change="handleSizeChange"
    ></el-pagination>
  </div>
</template>

<script>
export default {
  name: 'tradeMark',
  data(){
    return{
      page:1, //分页器当前第几页
      limit:3,  //当前页数展示数据条数
      total:0,  //  总数据条数
      list:[],  //列表展示的数据
    }
  },
  methods:{
    async getPageList(pager=1){
      //  修改当前页码
      this.page=pager
      const {page,limit}=this
      let result=await this.$API.tradeMark.reqTradeMarkList(page,limit)
      if(result.code==200){
        this.total=result.data.total
        this.list=result.data.records
      }
    },
    //  修改每页展示多少条
    handleSizeChange(limit){
      this.limit=limit
      this.getPageList()
    },
  },
  mounted() {
    this.getPageList()
  }
}
</script>

<style scoped>

</style>
