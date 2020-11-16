<template>
  <div>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item><a href="/">权限管理</a></el-breadcrumb-item>
      <el-breadcrumb-item><a href="/rights">权限列表</a></el-breadcrumb-item>
    </el-breadcrumb>
    <el-card id="powerCard">
      <el-table :data='rightList' border style="width: 100%" stripe>
        <el-table-column type="index"></el-table-column>
        <el-table-column label="权限名称" prop="authName"></el-table-column>
        <el-table-column label="路径" prop="path"></el-table-column>
        <el-table-column label="权限等级" prop="level">
          <template slot-scope="scope">
            <!-- 这里的判断要注意是字符串的判断 -->
            <el-tag v-if="scope.row.level === '0'">标签一</el-tag>
            <el-tag type="success" v-else-if="scope.row.level === '1'">标签二</el-tag>
            <el-tag type='warning' v-else-if="scope.row.level === '2'">标签三</el-tag>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
export default {
  name: "",
  data() {
    return {
      rightList:[]
    };
  },
  created(){
    this.getRightList();
  },
  methods:{
    async getRightList(){
      const {data:res} = await this.$http.get('rights/list');
      console.log(res);
      if(res.meta.status !== 200){
        return this.$message.error('获取信息失败')
      }
      this.rightList = res.data
    }
  }

};
</script>
<style scoped>
</style>