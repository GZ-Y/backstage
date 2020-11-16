<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item>首页</el-breadcrumb-item>
      <el-breadcrumb-item>
        <a href="/">活动管理</a>
      </el-breadcrumb-item>
      <el-breadcrumb-item>活动列表</el-breadcrumb-item>
      <el-breadcrumb-item>活动详情</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片区域 -->
    <el-card id="card">
      <el-row :gutter="6">
        <el-col :span="7">
          <!-- 搜索 -->
          <el-input placeholder="请输入内容" 
          v-model="queryInfo.query" clearable @clear='getUserList'>
            <el-button slot="append" icon="el-icon-search" @click="getUserList"></el-button>
          </el-input>
        </el-col>
        <el-col :span="2">
          <el-button type="primary" @click='addDialogVisible=true'>添加用户</el-button>
        </el-col>
      </el-row>
      <!-- 表格渲染数据 -->
      <el-table :data='userList' border style="width: 100%" id="table" >
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column prop="username" label="姓名"></el-table-column>
        <el-table-column prop="email" label="邮箱"></el-table-column>
        <el-table-column prop="mobile" label="电话"></el-table-column>
        <el-table-column prop="role_name" label="角色"></el-table-column>
        <el-table-column label="状态">
          <template slot-scope='scope'>
            <el-switch v-model="scope.row.mg_state"
            @change='userStateChanged(scope.row)'></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope='scope'>
            <el-tooltip effect="dark" content="编辑用户" placement="top">
              <el-button type="primary" icon="el-icon-edit" circle @click="editClick(scope.row.id)"></el-button>
            </el-tooltip>
            <el-tooltip effect="dark" content="删除用户" placement="top">
              <el-button type="danger" icon="el-icon-message" circle @click="removeUserById(scope.row.id)"></el-button>
            </el-tooltip>
            <el-tooltip effect="dark" content="分配用户" placement="top">
             <el-button type="warning" icon="el-icon-setting" circle @click='powerClick(scope.row)'></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分布区域 -->
      <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="queryInfo.pagenum"
      :page-size="queryInfo.pagesize"
      layout="total, prev, pager, next,jumper"
      :total="total">
      </el-pagination>
    </el-card>
    <el-dialog 
    :visible.sync="addDialogVisible" 
    width="50%"  
    @close='addDialogClosed'>
      <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="100px">
        <el-form-item label="用户名" prop="username">
        <el-input v-model="addForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="addForm.password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="addForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addToClick">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 修改用户信息表单 -->
    <el-dialog :visible.sync="editDialogVisible" @close='editClose'>
      <el-form 
      :model="editForm" 
      :rules="editFormRules" 
      ref='editFormRef'
      label-width="100px">
        <el-form-item label="用户名">
          <el-input v-model="editForm.username" disabled></el-input>
        </el-form-item>
        <el-form-item prop="email" label="邮箱">
          <el-input v-model="editForm.email"></el-input>
        </el-form-item>
        <el-form-item prop="mobile" label="手机">
          <el-input v-model="editForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveRoleInfo">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog title='分配权限' :visible.sync="powerDialogVisible">
      <div>
        <p>当前的用户名:{{usersInfo.username}}</p>
        <p>当前的角色名:{{usersInfo.role_name}}</p>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="powerDialogVisible = false">取 消</el-button>
        <el-button type="primary" >确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "Users",
  data() {
    var checkEmail = (rule, value, cb) => {
      const emailRex = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/;

      if (emailRex.test(value)) {
        return cb();
      }
      cb(new Error("请输入正确的字符"));
    };
    var checkMobile = (rule, value, cb) => {
      const mobileRex = /^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/;

      if (mobileRex.test(value)) {
        return cb();
      }
      cb(new Error("请输入正确的字符"));
    };

    return {
      queryInfo: {
        query: "",
        // 当前的页数
        pagenum: 1,
        // 当前每页显示多少条数据
        pagesize: 2
      },
      userList: [],
      usersInfo:{},
      total: 0,
      addDialogVisible: false,
      editDialogVisible: false,
      powerDialogVisible:false,
      //添加用户的请求参数
      addForm: {
        username: "",
        password: "",
        email: "",
        mobile: ""
      },
      //添加用户的正则表达式
      addFormRules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          {
            min: 3,
            max: 10,
            message: "用户名的长度在3~10个字符之间",
            trigger: "blur"
          }
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          {
            min: 6,
            max: 15,
            message: "用户名的长度在6~15个字符之间",
            trigger: "blur"
          }
        ],
        email: [
          { required: true, message: "请输入邮箱", trigger: "blur" },
          { validator: checkEmail, trigger: "blur" }
        ],
        mobile: [
          { required: true, message: "请输入手机号", trigger: "blur" },
          { validator: checkMobile, trigger: "blur" }
        ]
      },
      editForm: {},
      editFormRules: {
        email: [
          { required: true, message: '请输入用户邮箱', trigger: 'blur' },
          { validator: checkEmail, trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '请输入用户手机', trigger: 'blur' },
          { validator: checkMobile, trigger: 'blur' }
        ]
      },
    };
  },
  created() {
    this.getUserList();
  },
  methods: {
    //初始化页面
    async getUserList() {
      const { data: res } = await this.$http.get("users", {
        params: this.queryInfo
      });
      if (res.meta.status !== 200)
        return this.$message.error("获取用户列表失败");
      this.userList = res.data.users;
      this.total = res.data.total; //总共显示多少条数据
    },
    //传递当面每页显示多少条数据
    handleSizeChange(newSize) {
      console.log(newSize);
      this.queryInfo.pagesize = newSize;
      this.getUserList();
    },
    //传递点击显示当前页面数
    handleCurrentChange(newSize) {
      console.log(newSize);
      this.queryInfo.pagenum = newSize;
      this.getUserList();
    },
    //改变状态栏开关
    async userStateChanged(userInfo) {
      const { data: res } = await this.$http.put(
        "users/" + userInfo.id + "/state/" + userInfo.mg_state
      ); //这里的路径的冒号不要加
      console.log(res);
      if (res.meta.status !== 200) {
        userInfo.mg_state = !userInfo.mg_state;
        return this.$message.error("更新状态失败");
      }
      this.$message.success("更新状态成功");
    },
    //清空表单
    addDialogClosed() {
      // this.$refs.addFormRef.resetFields();
      this.$refs.addFormRef.resetFields();
    },
    //添加新用户
    addToClick() {
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) return; //正则不成功则停止
        const { data: res } = await this.$http.post("users", this.addForm);
        console.log(res);
        if (res.meta.status !== 201) {
          this.$message.error("添加用户失败！");
        }
        this.$message.success("添加用户成功");
        this.addDialogVisible = false;
        this.getUserList();
      });
    },
    //根据对应的id弹出对应用户的信息框
    async editClick(id) {
      this.editDialogVisible = true;
      const { data: res } = await this.$http.get("users/" + id);
      if (res.meta.status !== 200) {
        return this.$message.error("获取当前用户失败");
      }
      this.editForm = res.data;
      console.log(this.editForm);
    },
    //重置用户信息
    editClose(){
      this.$refs.editFormRef.resetFields()
    },
    //提交新的用户信息
    saveRoleInfo(){
      this.$refs.editFormRef.validate(async valid=>{
        if(!valid) return 
        const {data:res} = await this.$http.put('users/' + this.editForm.id,{
          email:this.editForm.email,
          mobile:this.editForm.mobile
        });
        console.log(res);
        if(res.meta.status !== 200){
          return this.$message.error('编辑用户信息失败')
        }
        this.editDialogVisible = false;
        this.getUserList();
        this.$message.success('更新用户信息成功')
      })
    },
    //删除点击的用户信息
    async removeUserById(id){
      //使用confirm插件来进行提示
      const confirmResult = await this.$confirm(
        '此操作将永久删除该用户, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).catch(err=>err);
      // 如果用户确认删除，则返回值为字符串 confirm
      // 如果用户取消了删除，则返回值为字符串 cancel
      if(confirmResult !== 'confirm'){
        //判断里的return不要忘了，不然代码还是会向下执行
        return this.$message.info('已经取消删除操作')
      }
      const {data:res} = await this.$http.delete('users/' +id);
      if(res.meta.status !== 200){
        return this.$message.error('删除用户信息失败')
      }
      this.$message.success('删除用户信息成功');
      this.getUserList();
    },
    powerClick(usersInfo){
      this.powerDialogVisible = true
      this.usersInfo = usersInfo;
      console.log(usersInfo);
    }
  }
};
</script>

<style scoped>
</style>
