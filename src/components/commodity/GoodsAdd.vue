<template>
  <div>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item>首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
      <el-breadcrumb-item>添加商品</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card id="goodsAddCard">
      <el-alert
      title="添加商品信息"
      type="info"
      center
      show-icon>
      </el-alert>
      <el-steps :space="300" :active="activeIndex - 0" finish-status="success" align-center>
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>
      <!-- :rules验证是根据前面:model绑定的对象的属性进行验证的 -->
        <el-form 
        :model="addForm" 
        :rules="addFormRules" 
        ref='addFormRef'
        label-width="100px" 
        label-position="top">
          <el-tabs 
          v-model="activeIndex" 
          id="goodsAddTabs" 
          :tab-position="tabPosition"
          :before-leave='beforeLeave'
          @tab-click='tabsActiveChange'>
          <el-tab-pane label="基本信息" name="0">
            <el-form-item label="商品分类">
               <el-cascader v-model="addForm.goods_cat" 
               :options='cateList' :props="cateProps" @change='judgeClass'>
                </el-cascader>
            </el-form-item>
            <el-form-item label="商品名称" prop="goods_name">
              <el-input v-model="addForm.goods_name"></el-input>
            </el-form-item>
            <el-form-item label="商品价格" prop="goods_price">
              <el-input v-model="addForm.goods_price"></el-input>
            </el-form-item>
            <el-form-item label="商品重量" prop="goods_weight">
              <el-input v-model="addForm.goods_weight"></el-input>
            </el-form-item>
            <el-form-item label="商品数量" prop="goods_number">
              <el-input v-model="addForm.goods_number"></el-input>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品参数" name="1">
            <el-form-item :label='item.attr_name' v-for="item in manyList" :key="item.attr_id">
              <el-checkbox-group v-model="item.attr_vals">
                <el-checkbox :label="cb" v-for='(cb,index) in item.attr_vals' :key='index' border></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品属性" name="2">
            <el-form-item :label="item2.attr_name" 
            v-for='item2 in onlyList' 
            :key="item2.attr_id" label-width="100px">
              <el-input v-model="item2.attr_vals"></el-input>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品图片" name="3">
            <el-upload 
            :action="uploadURL" 
            list-type="picture" 
            :headers="headerObj"
            :on-success='handelSuccess'
            :on-remove='handelRemove'
            :on-preview='handelPreview'>
              <el-button size="small" type="primary">点击上传</el-button>
            </el-upload>
          </el-tab-pane>
          <!-- 富文本编辑器包 -->
          <el-tab-pane label="商品内容" name="4">
            <quill-editor v-model='addForm.goods_introduce'>
            </quill-editor>
            <el-button class='addBut' type='primary' @click='addCommodity'>添加商品</el-button>
          </el-tab-pane>
        </el-tabs>
      </el-form>
    </el-card>
    <el-dialog
    title="图片预览"
    :visible.sync="dialogVisibleURL"
    width="50%">
    <img :src="previewImgUrl" alt="" class="previewImg">
    <span slot="footer" class="dialog-footer">
      <el-button @click="dialogVisibleURL = false">取 消</el-button>
      <el-button type="primary" @click="dialogVisibleURL = false">确 定</el-button>
  </span>
</el-dialog>
  </div>
</template>

<script>
import _ from 'lodash'

export default {
  name: "",
  data() {
    return {
      tabPosition: "left",
      activeIndex: "0",
      cateList: [],
      manyList: [],
      onlyList: [],
      cateProps: {
        label: "cat_name",
        value: "cat_id",
        children: "children"
      },
      uploadURL: "https://rambuild.cn/api/private/v1/upload",
      dialogVisibleURL:false,
      previewImgUrl:'',
      headerObj: {
        Authorization: window.sessionStorage.getItem("token")
      },
      addForm: {
        goods_name: "",
        goods_price: 0,
        goods_weight: 0,
        goods_number: 0,
        goods_cat: [],
        pics: [],
        goods_introduce:''
      },
      addFormRules: {
        goods_name: [
          { required: true, message: "请输入商品名称", trigger: "blur" }
        ],
        goods_price: [
          { required: true, message: "请输入商品价格", trigger: "blur" }
        ],
        goods_weight: [
          { required: true, message: "请输入商品重量", trigger: "blur" }
        ],
        goods_number: [
          { required: true, message: "请输入商品数量", trigger: "blur" }
        ]
      }
    };
  },
  created() {
    this.getGoodsAdd();
  },
  computed: {
    //获取三级分类的id
    cateId() {
      if (this.addForm.goods_cat.length === 3) {
        return this.addForm.goods_cat[2];
      }
      return null;
    }
  },
  methods: {
    //给级联选择器填充分类数据
    async getGoodsAdd() {
      const { data: res } = await this.$http.get("categories");
      if (res.meta.status !== 200) {
        return this.$message.error("获取商品信息失败");
      }
      this.cateList = res.data;
    },
    //根据点击的标签页的name值来确定请求动态参数还是静态属性，name值是字符串
    async tabsActiveChange() {
      if (this.activeIndex === "1") {
        const { data: res } = await this.$http.get(
          `categories/${this.cateId}/attributes`,
          {
            params: { sel: "many" }
          }
        );
        if (res.meta.status !== 200) {
          return this.$message.error("获取动态参数失败");
        }
        this.manyList = res.data;
        res.data.forEach(item => {
          item.attr_vals =
            item.attr_vals.length === 0 ? null : item.attr_vals.split(",");
        });
      } else if (this.activeIndex === "2") {
        const { data: res } = await this.$http.get(
          `categories/${this.cateId}/attributes`,
          {
            params: { sel: "only" }
          }
        );
        if (res.meta.status !== 200) {
          return this.$message.error("获取静态属性失败");
        }
        this.onlyList = res.data;

      }
    },
    //判断是否为三级分类
    judgeClass() {
      if (this.addForm.goods_cat.length !== 3) {
        this.addForm.goods_cat = [];
      }
    },
    // 切换页签
    beforeLeave(activeName, oldActiveName) {
      if (oldActiveName === "0" && this.addForm.goods_cat.length !== 3) {
        this.$message.error("请先选择分类后再切换页签！");
        return false;
      }
    },
    //上传图片时把token的tmp_path到临时路径中去
    handelSuccess(response) {
      const formPath = { pic: response.data.tmp_path };
      this.addForm.pics.push(formPath);
    },
    //删除图片及临时路径
    handelRemove(file) {
      const fildPath = file.response.data.tmp_path;
      const index = this.addForm.pics.findIndex(x => {
        return x.pic === fildPath;
      });
      this.addForm.pics.splice(index, 1);
    },
    //图片预览
    handelPreview(file){
      this.previewImgUrl = file.url
      this.dialogVisibleURL = true
    },
    //添加商品操作
    addCommodity(){
      this.$refs.addFormRef.validate(async valid =>{
        if(!valid) return
        //使用深拷贝复制一个新的数组出来，addForm.goods_cat给级联选择器使用。
        const form = _.cloneDeep(this.addForm);
        form.goods_cat = form.goods_cat.join(',')
        const {data:res} = await this.$http.post('goods',form);
        if(res.meta.status !== 201){
          return this.$message.error('添加商品操作失败')
        }
        this.$message.success('添加商品操作成功');
        this.$router.push('/goods')
        
      })
    }
  }
};
</script>
<style scoped>
.el-checkbox {
  margin: 0 10px 0 0 !important;
}

.previewImg {
  width: 100%;
}

.addBut{
  margin-top:15px;
}
</style>