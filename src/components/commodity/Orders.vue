<template>
  <div>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item>首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card id='ordersCard'>
      <el-row>
        <el-col :span='8'>
          <el-input v-model="querInfo.query" clearable placeholder="请输入内容">
            <el-button slot="append" icon="el-icon-search" @click="getOrdersList"></el-button>
          </el-input>
        </el-col>
      </el-row>
      <el-table :data="tableDataOrders" id="ordersTab" border style="width: 100%">
        <el-table-column type="index"></el-table-column>
        <el-table-column label="订单编号" prop="order_number"></el-table-column>
        <el-table-column label="订单价格" prop="order_price"></el-table-column>
        <el-table-column label="是否付款">
          <template slot-scope="scope">
            <el-tag v-if='scope.row.order_pay === 0'>已付款</el-tag>
            <el-tag v-else type="danger">未付款</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="是否发货" prop="is_send"></el-table-column>
        <el-table-column label="下单时间" prop="create_time"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button type="primary" icon="el-icon-edit" circle @click='modifyAddress'></el-button>
            <el-button type="success" icon="el-icon-map-location" circle @click="logistics"></el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="querInfo.pagenum"
      :page-size="querInfo.pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total='total'>
      </el-pagination>
    </el-card>
    <el-dialog
    title="修改地址"
    :visible.sync="ordersDialogVisible"
    width="50%"
    @close='handleClose'
    >
      <el-form 
      :model="addForm" 
      :rules="addFormRules" 
      ref="addFormRef"
      label-width="100px">
        <el-form-item label="省市区/县" prop="address1">
          <el-cascader v-model="addForm.address1" :options="cityData">
          </el-cascader>
        </el-form-item>
        <el-form-item label="详细地址" prop="address2"> 
          <el-input v-model="addForm.address2">
          </el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="ordersDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="ordersDialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog
    title="物流信息"
    :visible.sync="logisticsDialogVisible"
    width="50%">
      <el-timeline>
        <el-timeline-item
          v-for="(activity, index) in activities"
          :key="index"
          :icon="activity.icon"
          :type="activity.type"
          :color="activity.color"
          :size="activity.size"
          :timestamp="activity.ftime">
          {{activity.context}}
        </el-timeline-item>
      </el-timeline>
    </el-dialog>
  </div>
</template>

<script>
import cityData from './citydata'

export default {
  name: "",
  data() {
    return {
      tableDataOrders: [],
      total:0,
      querInfo: {
        query: "",
        pagenum: 1,
        pagesize: 5
      },
      addForm:{
        address1: [],
        address2: ''
      },
      cityData,
      ordersDialogVisible:false,
      logisticsDialogVisible:false,
      addFormRules: {
        address1: [
          { required: true, message: '请选择省市区县', trigger: 'blur' }
        ],
        address2: [
          { required: true, message: '请填写详细地址', trigger: 'blur' }
        ]
      },
      activities:[]
    };
  },
  created() {
    this.getOrdersList();
  },
  methods: {
    async getOrdersList() {
      const { data: res } = await this.$http.get("orders", {
        params: this.querInfo
      });
      console.log(res);
      if (res.meta.status !== 200) {
        return this.$message.error("获取订单数据失败");
      }
      this.$message.success("获取订单数据成功");
      this.tableDataOrders = res.data.goods;
      this.total = res.data.total
    },
    handleSizeChange(newSize){
      this.querInfo.pagesize = newSize
      this.getOrdersList();
    },
    handleCurrentChange(newPage){
      this.querInfo.pagenum = newPage
      this.getOrdersList();
    },
    modifyAddress(){
      this.ordersDialogVisible = true
    },
    handleClose(){
      this.addForm.address1 = [];
      this.addForm.address2 = ''
    },
    async logistics(){
      const {data:res} = await this.$http.get(`/kuaidi/${804909574412544580}`);
      console.log(res);
      if(res.meta.status !== 200){
        return this.$message.error('获取物流信息失败')
      }
      this.$message.success('获取物流信息成功')
      this.activities = res.data
      this.logisticsDialogVisible = true
    }
  }
};
</script>
<style scoped>
</style>