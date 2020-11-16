<template>
  <div>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item>首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>参数列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card id="paramsCard">
      <el-alert title="注意：只允许为第三级分类设置相关参数！" type="warning" show-icon></el-alert>
      <el-form id="paramsForm">
        <el-form-item label="选择商品名称：">
          <el-cascader
            v-model="selectedKeys"
            :options="cateList"
            :props="cascaderProps"
            @change="judgeClass"
          ></el-cascader>
        </el-form-item>
      </el-form>
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="动态参数" name="many">
          <el-button type="primary" :disabled="isClass" @click="paramsDialogVisible = true">添加参数</el-button>
          <el-table :data="manyTableData" border class="paramsTable">
            <el-table-column type="expand">
              <template slot-scope="scope">
                <el-tag v-for="(item,index) in scope.row.attr_vals" 
                :key="index" 
                closable @close="handleClose(index, scope.row)">
                {{item}}
                </el-tag>
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  size="small"
                  ref="saveTagInputRef"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                  >
                  </el-input>
                <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>
              </template>
            </el-table-column>
            <el-table-column type="index"></el-table-column>
            <el-table-column label="参数名称" prop="attr_name"></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button type="primary" @click="queryClick(scope.row.attr_id)">修改</el-button>
                <el-button type="danger" @click="deleteClick(scope.row.attr_id)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="静态属性" name="only">
          <el-button type="primary" :disabled="isClass" @click="paramsDialogVisible = true">添加属性</el-button>
          <el-table :data="onlyTableData" border class="paramsTable">
            <el-table-column type="expand">
              <template slot-scope="scope">
                <el-tag v-for="(item,index) in scope.row.attr_vals" 
                :key="index" 
                closable @close="handleClose(index, scope.row)">
                {{item}}
                </el-tag>
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  size="small"
                  ref="saveTagInputRef"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                  >
                  </el-input>
                <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>
              </template>
            </el-table-column>
            <el-table-column type="index"></el-table-column>
            <el-table-column label="属性名称" prop="attr_name"></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button type="primary" @click="queryClick(scope.row.attr_id)">修改</el-button>
                <el-button type="danger" @click="deleteClick(scope.row.attr_id)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>
    <!-- 添加分类弹出框 -->
    <el-dialog
      :title="'添加'+titleDialog"
      :visible.sync="paramsDialogVisible"
      width="50%"
      @close="handleClose"
    >
      <el-form :model="paramsForm" :rules="paramsFormRules" ref="paramsFormRef" label-width="110px">
        <el-form-item :label="titleDialog" prop="attr_name">
          <el-input v-model="paramsForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="paramsDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitClick">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 修改分类弹出框 -->
    <el-dialog
      :title="'修改'+titleDialog"
      :visible.sync="editDialogVisible"
      width="50%"
      @close="editClose"
    >
      <el-form :model="editForm" :rules="paramsFormRules" ref="editFormRef" label-width="110px">
        <el-form-item :label="titleDialog" prop="attr_name">
          <el-input v-model="editForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editClick">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "",
  data() {
    return {
      cateList: [],
      cascaderProps: {
        value: "cat_id",
        label: "cat_name",
        children: "children"
      },
      selectedKeys: [],
      activeName: "many",
      manyTableData: [],
      onlyTableData: [],
      paramsDialogVisible: false,
      editDialogVisible: false,
      paramsForm: {
        attr_name: ""
      },
      editForm: {},
      paramsFormRules: {
        attr_name: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          {
            min: 3,
            max: 10,
            message: "用户名的长度在3~10个字符之间",
            trigger: "blur"
          }
        ]
      },
      
    };
  },
  created() {
    this.getCateList();
  },

  computed: {
    //判断是否选择为三级分类，如果不是则让按钮禁止点击
    isClass() {
      if (this.selectedKeys.length !== 3) {
        return true;
      }
      return false;
    },
    // 拿到三级分类的id
    categoryId() {
      if (this.selectedKeys.length === 3) {
        return this.selectedKeys[2];
      }
      return null;
    },
    //弹框的title
    titleDialog() {
      if (this.activeName === "many") {
        return "动态参数";
      } else {
        return "静态属性";
      }
    }
  },
  methods: {
    //请求分类数据
    async getCateList() {
      const { data: res } = await this.$http.get("categories");
      console.log(res);
      if (res.meta.status !== 200) {
        return this.$message.error("获取分类数据失败");
      }
      this.cateList = res.data;
    },
    //联级菜单发生改变时触发，只允许操作三级分类
    judgeClass() {
      this.getParamsData();
    },
    //点击标签对应对应页面
    handleClick() {
      this.getParamsData();
    },
    //封装函数，让选择联级和点击标签时都可以获取到数据
    async getParamsData() {
      if (this.selectedKeys.length !== 3) {
        this.selectedKeys = [];
        return;
      }
      const { data: res } = await this.$http.get(
        `categories/${this.categoryId}/attributes`,
        {
          params: { sel: this.activeName }
        }
      );

      if (res.meta.status !== 200) {
        return this.$message.error("获取数据失败");
      }

      res.data.forEach(item => {
        item.attr_vals = item.attr_vals ? item.attr_vals.split(',') : [];
        item.inputVisible = false;
        item.inputValue = ''
      });
      console.log(res.data);

      if (this.activeName === "many") {
        this.manyTableData = res.data;
      } else {
        this.onlyTableData = res.data;
      }
    },
    //重置添加分类弹出框
    handleClose() {
      this.$refs.paramsFormRef.resetFields();
    },
    editClose() {
      this.$refs.editFormRef.resetFields();
    },
    //提交分类按钮
    submitClick() {
      this.$refs.paramsFormRef.validate(async valid => {
        if (!valid) return;
        const { data: res } = await this.$http.post(
          `categories/${this.categoryId}/attributes`,
          {
            attr_name: this.paramsForm.attr_name,
            attr_sel: this.activeName
          }
        );
        console.log(res);
        if (res.meta.status !== 201) {
          return this.$message.error("添加" + this.titleDialog + "失败");
        }
        this.$message.success("添加" + this.titleDialog + "成功");
        this.paramsDialogVisible = false;
        this.getCateList();
      });
    },
    //查询当前分类数据按钮
    async queryClick(id) {
      this.editDialogVisible = true;
      const {
        data: res
      } = await this.$http.get(
        `categories/${this.categoryId}/attributes/${id}`,
        { params: { attr_sel: this.activeName } }
      );
      console.log(res);
      if (res.meta.status !== 200) {
        return this.$message.error("查询分类数据失败");
      }
      this.editForm = res.data;
    },
    // 重新编辑按钮
    editClick() {
      this.$refs.editFormRef.validate(async valid => {
        if (!valid) return;
        const { data: res } = await this.$http.put(
          `categories/${this.categoryId}/attributes/${this.editForm.attr_id}`,
          {
            attr_name: this.editForm.attr_name,
            attr_sel: this.activeName
          }
        );
        console.log(res);
        if (res.meta.status !== 200) {
          return this.$message.error("更新分类数据失败");
        }
        this.editDialogVisible = false;
        this.$message.success("更新分类数据成功");
        this.getParamsData(); //这个？
      });
    },
    //删除数据
    async deleteClick(id) {
      const confirmResult = await this.$confirm(
        "此操作将永久删除该用户, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      ).catch(err => err);
      // 如果用户确认删除，则返回值为字符串 confirm
      // 如果用户取消了删除，则返回值为字符串 cancel
      if (confirmResult !== "confirm") {
        //判断里的return不要忘了，不然代码还是会向下执行
        return this.$message.info("已经取消删除操作");
      }
      const { data: res } = await this.$http.delete(
        `categories/${this.categoryId}/attributes/${id}`
      );
      console.log(res);
      if (res.meta.status !== 200) {
        return this.$message.error("删除数据失败");
      }
      this.$message.success("删除数据成功");
      this.getParamsData();
    },
    //编辑与删除标签的函数
    async saveAttrVals(row){
      const {data:res} = await this.$http.put(`categories/${this.categoryId}/attributes/${row.attr_id}`,
      {
        attr_name:row.attr_name,
        attr_sel:row.attr_sel,
        attr_vals:row.attr_vals.join('')
      })
      if(res.meta.status !== 200){
        return this.$message.error('编辑标签失败')
      }
      this.$message.success('编辑标签成功，已经成功保存')
    },
    //绑定close事件，用来删除标签
    handleClose(index,row){
      row.attr_vals.splice(index,1);
      this.saveAttrVals(row)
    },
    // 按回车和失去焦点时触发事件，添加标签
    handleInputConfirm(row){
      row.inputVisible = false
      if(row.inputValue.trim().length === 0){
        row.inputValue = ''
        return
      }
      row.attr_vals.push(row.inputValue);
      row.inputValue = ''
      this.saveAttrVals(row)
    },
    //点击按钮时变成文本输入框
    showInput(row){
      row.inputVisible = true
      //当dom渲染完成之后再执行回调函数
      //这里点击之后需要当input文本框出来之后再获取焦点
      this.$nextTick(()=>{
        this.$refs.saveTagInputRef.focus()
      })
    }
  }
};
</script>
<style scoped>
.el-tag {
  margin-right: 15px;
  margin-bottom: 15px
}

.input-new-tag{
  width: 100px;
}
</style>