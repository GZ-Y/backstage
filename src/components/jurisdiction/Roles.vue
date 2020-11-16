<template>
  <div>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item><a href="/">权限管理</a></el-breadcrumb-item>
      <el-breadcrumb-item><a href="/rights">权限列表</a></el-breadcrumb-item>
    </el-breadcrumb>
    <el-card id="rolesCard" >
      <el-table :data='rolesList' border>
        <el-table-column type='expand'>
          <template slot-scope="scope">

            <el-row class="bdbottom"
            v-for="(item1,index1) in scope.row.children" :key='item1.id'>
              <el-col :span="5">
                <el-tag>
                  {{item1.authName}}
                </el-tag>
              </el-col>
              <el-col :span="19">
                <el-row class="bdtop"
                v-for="(item2,index2) in item1.children" :key='item2.id'>
                  <el-col :span="6">
                    <el-tag type="success">
                      {{item2.authName}}
                    </el-tag>
                  </el-col>
                  <el-col :span="18">
                    <el-tag type="warning"
                     v-for="(item3,index3) in item2.children" :key='item3.id'>
                      {{item3.authName}}
                    </el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <el-table-column type='index'></el-table-column>
        <el-table-column label='角色名称' prop="roleName"></el-table-column>
        <el-table-column label='角色列表' prop="roleDesc"></el-table-column>
        <el-table-column label='操作'>
          <template slot-scope="scope">
            <el-button size="mini" 
            type="primary" icon="el-icon-edit" @click="editRoles(scope.row.id)">编辑</el-button>
            <el-button size="mini" type="danger" icon="el-icon-delete" @click="deleteRoles(scope.row.id)">删除</el-button>
            <el-button size="mini" type="warning" icon="el-icon-setting" @click="showSetRightDialog(scope.row)">分配权限</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <el-dialog :visible.sync="rightsDialogVisible" @close='setRightDialogClosed'>
      <el-tree 
      :data='rightsList' 
      :props='treeProps' 
      show-checkbox
      node-key="id"
      default-expand-all
      :default-checked-keys='defKeys'
      ref='treeRef'>
      </el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="rightsDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="allotRights">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog title='角色信息' :visible.sync="editDialogVisible">
      <el-form 
      :model="editForm" 
      ref='editFormRef'
      label-width="100px">
        <el-form-item label="对应id值">
          <el-input v-model="editForm.roleId" disabled></el-input>
        </el-form-item>
        <el-form-item label="角色名称">
          <el-input v-model="editForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色列表">
          <el-input v-model="editForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editSubmit">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "",
  data() {
    return {
      //用户对应数据
      rolesList:[],
      //权限对应数据
      rightsList:[],
      roleId:'',
      rightsDialogVisible:false,
      editDialogVisible:false,
      treeProps: {
        label: 'authName',
        children: 'children'
      },
      defKeys:[],
      editForm:{}
    };
  },
  created(){
    this.getRolesList();
  },
  methods:{
    async getRolesList(){
      const{data:res} = await this.$http.get('roles');
      this.rolesList = res.data
    },
    //分配权限按钮
    async showSetRightDialog(role){
      this.roleId = role.id;
      console.log(this.roleId);
      const {data:res} = await this.$http.get('rights/tree');
      if(res.meta.status !== 200){
        return this.$message.error('获取权限失败')
      }
      this.rightsList = res.data
      this.getLeafKeys(role,this.defKeys)
      this.rightsDialogVisible = true
    },
    // 通过递归的形式，获取角色下所有三级权限的id，并保存到 defKeys 数组中
    getLeafKeys(node, arr) {
      // 如果当前 node 节点不包含 children 属性，则是三级节点
      if (!node.children) {
        return arr.push(node.id)
      }
      node.children.forEach(item => this.getLeafKeys(item, arr))
    },
    setRightDialogClosed(){
      this.defKeys = []
    },
    //分配权限到列表当中
    async allotRights(){
      const keys = [
        ...this.$refs.treeRef.getCheckedKeys(),
        ...this.$refs.treeRef.getHalfCheckedKeys()
      ];
      console.log(keys);
      const idStr = keys.join(',');
      const{data:res} = await this.$http.post(`roles/${this.roleId}/rights`,
      {rids:idStr});
      if(res.meta.status !== 200){
        return this.$message.error('添加权限失败');
      }
      console.log(res);
      this.$message.success('添加权限成功');
      this.getRolesList()
      this.rightsDialogVisible = false;
    },
    //根据id查询对应角色信息
    async editRoles(id){
      this.editDialogVisible = true
      const {data:res} = await this.$http.get(`roles/${id}`);
      console.log(res);
      if(res.meta.status !== 200){
        return this.$message.error('获取角色信息失败')
      }
      this.editForm = res.data;
      console.log(this.editForm);
    },
    //重新提交编辑信息
    async editSubmit(){
      const{data:res} = await this.$http.put(`roles/${this.editForm.roleId}`,{
        roleName:this.editForm.roleName,
        roleDesc:this.editForm.roleDesc
      });
      console.log(res);
      if(res.meta.status !== 200){
        return this.$message.error('重要编辑信息失败');
      }
      this.$message.success('重要编辑信息成功');
      this.getRolesList();
      this.editDialogVisible = false
    },
    //删除角色列表
    async deleteRoles(id){
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
      const {data:res} = await this.$http.delete(`roles/${id}`);
      console.log(res);
      if(res.meta.status !== 200){
        return this.$message.error('删除角色列表失败');

      }
      this.$message.success('删除角色列表成功');
      this.getRolesList();
    }

    
  }
};
</script>
<style scoped>
.el-tag {
  margin: 7px;
}

.bdtop {
  border-top: 1px solid #eee;
}

.bdbottom {
  border-bottom: 1px solid #eee;
}
</style>