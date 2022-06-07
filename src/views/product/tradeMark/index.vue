<template>
  <div>
    <el-button type="primary" icon="el-icon-plus" style="margin: 10px 0px" @click="showDialog">添加</el-button>
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
          <el-button type="warning" icon="el-icon-edit" size="mini" @click="updateTradeMark">修改</el-button>
          <el-button type="danger" icon="el-icon-delete" size="mini">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!--  分页器 -->
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
    <!--  对话框 -->
    <el-dialog title="添加品牌" :visible.sync="dialogFormVisible">
      <el-form :model="form" style="width: 80%">
        <el-form-item label="品牌名称" label-width="100px">
          <el-input autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="品牌LOGO" label-width="100px">
          <el-upload
            class="avatar-uploader"
            action="https://jsonplaceholder.typicode.com/posts/"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
          >
            <img v-if="imageUrl" :src="imageUrl" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogFormVisible = false">确 定</el-button>
      </div>
    </el-dialog>
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
      dialogFormVisible:false,//对话框隐藏
      imgUrl:'',//  上传图片
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
    //  显示对话框
    showDialog(){
      this.dialogFormVisible=true
    },
    //  修改某一品牌
    updateTradeMark(){
      this.dialogFormVisible=true
    },
    //  上传图片相关回调
    handleAvatarSuccess(res, file) {
      this.imageUrl = URL.createObjectURL(file.raw);
    },
    beforeAvatarUpload(file) {
      const isJPG = file.type === 'image/jpeg';
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG 格式!');
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!');
      }
      return isJPG && isLt2M;
    },
  },
  mounted() {
    this.getPageList()
  }
}
</script>

<style>
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
