<template>
  <el-container class="home-container">
    <!-- 头部区域 -->
    <el-header >
      <img src="@/assets/tgb.jpg" alt="">
      <el-button type="info" @click="logoutClick">退出</el-button>
    </el-header>
    <el-container>
      <!-- 左侧边栏 -->
      <el-aside width="200px">
        <div class="toggle-button" @click="toggleCollapse">{{icon}}</div>
        <!-- 菜单组件 -->
        <el-menu unique-opened 
        :collapse='isCollapse'
        :collapse-transition='false'
        active-text-color="#409EFF"
        router
        :default-active="isActive">
          <!-- 一级菜单 -->
          <el-submenu :index="item.id + ''" v-for="item in menuList" :key="item.id">
            <template slot="title">
              <i :class="iconsObj[item.id]"></i>
              <span class="one">{{item.authName}}</span>
            </template>
            <!-- 二级菜单 -->
            <el-menu-item 
            :index="'/' + subItem.path" 
            v-for="subItem in item.children" 
            :key="subItem.id"
            @click="stateClick('/' + subItem.path)">
              <!-- template不能进行v-for循环 -->
              <template slot="title" >
                <i class="el-icon-menu"></i>
                <span>{{subItem.authName}}</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <!-- 右侧边栏 -->
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
  
</template>

<script>
export default {
  name: "Detail",
  data() {
    return {
      menuList: [],
      isCollapse: false,
      icon: "▼",
      iconsObj: {
        '125': 'iconfont el-icon-user-solid',
        '103': 'iconfont el-icon-view',
        '101': 'iconfont el-icon-s-goods',
        '102': 'iconfont el-icon-s-claim',
        '145': 'iconfont el-icon-edit-outline'
      },
      isActive:''
    };
  },
  created() {
    this.getMenuList();
    this.isActive = window.sessionStorage.getItem('isActive')
  },
  methods: {
    logoutClick() {
      window.sessionStorage.clear();
      this.$router.push("/login");
    },
    async getMenuList() {
      const { data: res } = await this.$http.get("menus");
      this.menuList = res.data;
      
    },
    toggleCollapse() {
      this.isCollapse = !this.isCollapse;
      this.isCollapse? this.icon = '◁':this.icon = '▼';
    },
    stateClick(isActive){
      window.sessionStorage.setItem('isActive',isActive);
      this.isActive = isActive
      console.log(isActive);
    }
  }
};
</script>
<style scoped>
.home-container {
  height: 100%;
}
.el-header {
  background-color: #373d41;
  display: flex;
  justify-content: space-between;
  padding-left: 0;
  align-items: center;
  color: #fff;
  font-size: 20px;
}

.el-header img{
  height: 100%;
}

.el-aside {
  background-color: #333744;
}

.el-submenu .one{
  margin-left: 7px 
}

.el-main {
  background-color: #eaedf1;
}

.toggle-button {
  background-color: #4a5064;
  font-size: 10px;
  line-height: 24px;
  color: #fff;
  text-align: center;
  letter-spacing: 0.2em;
  cursor: pointer;
}
</style>