<template>
  <div>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item>首页</el-breadcrumb-item>
      <el-breadcrumb-item>数据统计</el-breadcrumb-item>
      <el-breadcrumb-item>数据报表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card id="reportsCard">
      <div id="main" style="width: 750px;height:400px;"></div>
    </el-card>
  </div>
</template>

<script>
import echarts from "echarts";
import _ from 'lodash'
export default {
  name: "",
  data() {
    return {
      // 需要合并的数据
      options: {
        title: {
          text: '用户来源'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: '#E9EEF3'
            }
          }
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: [
          {
            boundaryGap: false
          }
        ],
        yAxis: [
          {
            type: 'value'
          }
        ]
      }
    };
  },
  created() {
   
  },
  async mounted(){
    //3、基于Dom来渲染拆线图
    var myChart = echarts.init(document.getElementById("main"));
    const { data: res } = await this.$http.get("reports/type/1");
    console.log(res);
    if (res.meta.status !== 200) {
      return this.$message.error("获取折线图数据失败！");
    }

    // 4. 准备数据和配置项
    const result = _.merge(res.data, this.options);

    // 5. 展示数据
    myChart.setOption(result);
    
  }
};
</script>
<style scoped>
</style>