<template>
  <div class="login_container">
    <div class="login_box">
      <!-- LOGO图片 -->
      <div class="avatar_box">
        <img src="@/assets/logo.png" alt="">
      </div>
      <el-form 
      ref="loginFormRef"
      :model="loginForm" 
      :rules="loginFormRules"  
      class="login_form" 
      label-width="0px">
        <!-- 登陆框 -->
        <el-form-item prop="username">
          <el-input v-model="loginForm.username" type="text" prefix-icon='el-icon-user'>
            
          </el-input>
        </el-form-item>
        <!-- 密码框 -->
        <el-form-item prop="password">
          <el-input v-model="loginForm.password" type="password" prefix-icon='el-icon-lock'>
            
          </el-input>
        </el-form-item>
        <el-form-item class="btns">
          <el-button type="primary" @click="langClick">登陆</el-button>
          <el-button type="info" @click="resetClick">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  name: "Login",
  data() {
    return {
      //双向数据绑定
      loginForm:{
        username:'admin',
        password:'123456'
      },
      //验证输入是否合法
      loginFormRules:{
        username:[
          { required: true, message: '请输入登录名称', trigger: 'blur' },
          { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
        ],
        password:[
           { required: true, message: '请输入登录密码', trigger: 'blur' },
          { min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur' }
        ]
      }
    };
  },
  methods:{
    //登陆
    langClick(){
      this.$refs.loginFormRef.validate(async date=>{
        //如果验证错误，则终止
        if(!date) return
        //await后面一般跟promise对象，但是使用await要是在异步函数当中使用的
        const {data:res} = await this.$http.post('login',this.loginForm);
        //如果状态码status不是200则报错，反之则登陆成功
        if(res.meta.status !== 200) return this.$message.error('登陆失败')
        this.$message.success('登陆成功！');
        setTimeout(()=>{
          //本地储存接口当中的token值，命名为token;
          window.sessionStorage.setItem('token',res.data.token);
          //这里使用定时器，3秒后跳转
          this.$router.push('/detail')
        },2500)
      })
    },
    //重置
    resetClick(){
      this.$refs.loginFormRef.resetFields()
    }
  }
};
</script>

<style scoped>
.login_container {
  background-color: #2b4b6b;
  height: 100%;
}

.login_box {
  width: 450px;
  height: 300px;
  background-color: #fff;
  border-radius: 3px;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}

.avatar_box {
  height: 130px;
  width: 130px;
  border: 1px solid #eee;
  border-radius: 50%;
  padding: 10px;
  box-shadow: 0 0 10px #ddd;
  position: absolute;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: #fff;
}

.avatar_box img {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background-color: #eee;
}

.login_form {
  position: absolute;
  bottom: 0;
  width: 100%;
  padding: 0 20px;
  box-sizing: border-box;
}

.btns {
  display: flex;
  justify-content: flex-end;
} 
</style>