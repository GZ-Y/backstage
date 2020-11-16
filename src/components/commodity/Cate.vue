<template>
  <div>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item>首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
      <el-breadcrumb-item>分类参数</el-breadcrumb-item>
      <el-breadcrumb-item>
        <a href="/">商品分类</a>
      </el-breadcrumb-item>
    </el-breadcrumb>
    <el-card id="cateCard">
      <el-row>
        <el-col>
          <el-button type="primary" @click="showAddCateDialog">添加分类</el-button>
        </el-col>
      </el-row>
      <zk-table 
      :data='cateList' 
      :columns='columns'
      show-index index-text='#'
      :selection-type='false'
      :expand-type="false"
      :show-row-hover="false"
      border>
        <template slot="isok" slot-scope="scope">
          <i class="el-icon-success" v-if="scope.row.cat_deleted === false"></i>
          <i class="el-icon-error" v-else></i>
        </template>
        <template slot="order" slot-scope="scope">
          <el-tag v-if="scope.row.cat_level === 0">一级</el-tag>
          <el-tag type="success" v-else-if='scope.row.cat_level === 1'>二级</el-tag>
          <el-tag type="warning" v-else>三级</el-tag>
        </template>
        <template slot="opt" slot-scope="scope">
          <el-button 
          type="primary" 
          icon="el-icon-edit" 
          size="mini" @click="editCate(scope.row.cat_id)">编辑</el-button>
          <el-button 
          type="danger" 
          icon="el-icon-delete" 
          size="mini" >删除</el-button>
        </template>
      </zk-table>
      <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="querInfo.pagenum"
      :page-size="querInfo.pagesize"
      layout="total, prev, pager, next,jumper"
      :total="total">
      </el-pagination>
    </el-card>
    <el-dialog 
    title="添加分类" 
    :visible.sync="addToDialogVisible" 
    @close='cateClose'>
      <el-form
      :model="add_Catr"
      :rules="addCateFormRules"
      ref="addCateFormRef"
      label-width="80px">
        <el-form-item label="分类名称" prop='cat_name'>
          <el-input v-model="add_Catr.cat_name" ></el-input>
        </el-form-item>
        <el-form-item label="父级分类" placeholder="请选择分类">
          <el-cascader 
          expandTrigger='hover'
          :options="parentCartList" 
          :props="cascaderProps"
          v-model="selectedKeys"
          @change="selectedIdChange"
          change-on-select>
          </el-cascader>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addToDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click='addCateClass'>确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog title="编辑分类" :visible.sync="editDialogVisible" >
      <el-form :v-model="add_Catr" label-width="100px">
        <el-form-item label="分类名称">
          <el-input v-model="add_Catr.cat_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editSubClick">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "",
  data() {
    return {
      querInfo: {
        type: 3,
        pagenum: 1,
        pagesize: 4
      },
      cateList: [],
      total: 0,
      columns: [
        { label: "分类名称", prop: "cat_name" },
        { label: "是否有效", type: "template", template: "isok" },
        { label: "排序", type: "template", template: "order" },
        { label: "操作", type: "template", template: "opt" }
      ],
      addToDialogVisible: false,
      editDialogVisible:false,
      add_Catr: {
        cat_id:0,
        cat_pid: 0,
        cat_name: "",
        cat_level: 0
      },
      parentCartList: [],
      selectedKeys: [],
      cascaderProps: {
        value: "cat_id",
        label: "cat_name",
        children: "children"
      },
      addCateFormRules: {
        cat_name: [
          { required: true, message: "请输入分类名称", trigger: "blur" }
        ]
      }
    };
  },
  created() {
    this.getCateList();
  },
  methods: {
    //get请求都要写params参数，把请求过来的数据渲染到zk-table组件当中
    async getCateList() {
      const { data: res } = await this.$http.get("categories", {
        params: this.querInfo
      });
      if (res.meta.status !== 200) {
        return this.$message.error("获取商品分类数据失败");
      }
      this.cateList = res.data.result;
      this.total = res.data.total;
    },
    //每页多少条数据
    handleSizeChange(newSize) {
      this.querInfo.pagesize = newSize;
      this.getCateList();
    },
    //总共有多少页
    handleCurrentChange(newPage) {
      this.querInfo.pagenum = newPage;
      this.getCateList();
    },
    //点击弹出框后直接渲染数据到下拉框中
    async showAddCateDialog() {
      this.addToDialogVisible = true;
      const { data: res } = await this.$http.get("categories", {
        params: { type: 2 }
      });
      if (res.meta.status !== 200) {
        return this.$message.error("获取分类的数据失败");
      }
      this.parentCartList = res.data;
    },
    //添加新分类
    addCateClass() {
      this.$refs.addCateFormRef.validate(async valid => {
        if(!valid) return //如果有值，但是没有通过正则，则直接return返回
        const {data:res} = await this.$http.post("categories",this.add_Catr);
        if(res.meta.status !== 201){
          return this.$message.error('添加商品分类失败');
        }
        this.$message.success('添加商品分类成功');
        this.getCateList();
        this.addToDialogVisible = false;
      });
    },
    //取消，重要表单区域
    cateClose() {
      this.$refs.addCateFormRef.resetFields();
      this.selectedKeys = [];
      this.add_Catr.cat_pid = 0;
      this.add_Catr.cat_level = 0
    },
    //联级菜单发生变化时触发，帮助我们确认选择的是第几级分类
    selectedIdChange(){
      console.log(this.selectedKeys);
      if(this.selectedKeys.length > 0){
        this.add_Catr.cat_pid = this.selectedKeys[this.selectedKeys.length-1];
        this.add_Catr.cat_level = this.selectedKeys[this.selectedKeys.length];
        return 
      }else{
        this.add_Catr.cat_pid = 0;
        this.add_Catr.cat_level = 0
      }
    },
    // 根据id查询分类
    async editCate(id){
      const {data:res} = await this.$http.get(`categories/${id}`)
      if(res.meta.status !== 200){
        return this.$message.error('查询商品信息失败')
      }
      this.add_Catr = res.data
      console.log(this.add_Catr);
      this.editDialogVisible = true
    },
    //重新编辑商品分类
    async editSubClick(){
      const {data:res} = await this.$http.put(`categories/${this.add_Catr.cat_id}`,{
        cat_name:this.add_Catr.cat_name
      })
      console.log(res);
      if(res.meta.status !== 200){
        return this.$message.error('重新编辑商品分类失败')
      }
      this.$message.success('编辑商品分类名称成功')
      this.add_Catr.cat_name = res.data.cat_name
      this.getCateList();
      this.editDialogVisible = false
    }
  }
};
</script>
<style scoped>
</style>