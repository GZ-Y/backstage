<template>
  <div>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item>首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>参数列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card id="goodsCard">
      <el-row :gutter="6">
        <el-col :span="7">
          <el-input v-model="querInfo.query" placeholder="请输入内容" clearable>
            <el-button slot="append" icon="el-icon-search" @click="getGoodsList"></el-button>
          </el-input>
        </el-col>
        <el-col :span="2">
          <el-button type="primary" @click="addClick">添加商品</el-button>
        </el-col>
      </el-row>
      <el-table id="goodsTable" :data='goodsList' border>
        <el-table-column type='index'></el-table-column>
        <el-table-column label='商品名称' prop="goods_name"></el-table-column>
        <el-table-column label='商品价格（元）' prop="goods_price"></el-table-column>
        <el-table-column label='商品重量' prop="goods_weight"></el-table-column>
        <el-table-column label='创建时间' prop="upd_time"></el-table-column>
        <el-table-column label='操作'>
          <template slot-scope="scope">
            <el-button type="primary">修改</el-button>
            <el-button type="danger">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="querInfo.pagenum"
      :page-size="querInfo.pagesize"
      layout="total, prev, pager, next,jumper"
      :total="total" >
      </el-pagination>
    </el-card>
  </div>
</template>

<script>
export default {
  name: "",
  data() {
    return {
      goodsList:[],
      total:0,
      querInfo:{
        query:'',
        pagenum:1,
        pagesize:10
      }
    };
  },
  created(){
    this.getGoodsList()
  },
  methods:{
    async getGoodsList(){
      const {data:res} = await this.$http.get('goods',{
        params:this.querInfo
      });
      console.log(res);
      if(res.meta.status !== 200){
        return this.$message.error('获取商品列表数据失败')
      }
      this.goodsList = res.data.goods
      this.total = res.data.total
    },
    handleSizeChange(newSize){
      this.querInfo.pagesize = newSize;
      this.getGoodsList();
    },
    handleCurrentChange(newPage){
      this.querInfo.pagenum = newPage;
      this.getGoodsList();
    },
    addClick(){
      this.$router.push('goods/add')
    }
  }
};
</script>
<style scoped>
</style>