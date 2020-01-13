<template>
  <div>
    <Row :gutter="20">
      <i-col :xs="12" :md="8" :lg="4" v-for="(infor, i) in inforCardData" :key="`infor-${i}`" style="height: 120px;padding-bottom: 10px;">
        <infor-card shadow :color="infor.color" :icon="infor.icon" :icon-size="36">
          <count-to :end="infor.count" count-class="count-style"/>
          <p>{{ infor.title }}</p>
        </infor-card>
      </i-col>
    </Row>
    <Row :gutter="20" style="margin-top: 10px;">
      <i-col :md="24" :lg="8" style="margin-bottom: 20px;">
        <Card shadow>
          <chart-pie style="height: 300px;" :value="pieData" text="优选房型"></chart-pie>
        </Card>
      </i-col>
      <i-col :md="24" :lg="16" style="margin-bottom: 20px;">
        <Card shadow>
          <chart-bar style="height: 300px;" :value="barData" text="每周交易数（单）"/>
        </Card>
      </i-col>
    </Row>
    <Row>
      <Card shadow>
        <example style="height: 310px;"/>
      </Card>
    </Row>
  </div>
</template>

<script>
import InforCard from '_c/info-card'
import CountTo from '_c/count-to'
import { ChartPie, ChartBar } from '_c/charts'
import Example from './example.vue'
export default {
  name: 'home',
  components: {
    InforCard,
    CountTo,
    ChartPie,
    ChartBar,
    Example
  },
  data () {
    return {
      inforCardData: [
        { title: '累计用户', icon: 'md-chatbubbles', count: 803, color: '#2d8cf0' },
        { title: '累计酒店', icon: 'md-home', count: 232, color: '#19be6b' },
        { title: '累计民宿', icon: 'md-home', count: 142, color: '#ff9900' },
        { title: '累计房型', icon: 'md-map', count: 1450, color: '#9A66E4' },
        { title: '累计交易（单）', icon: 'md-checkmark', count: 1203, color: '#ed3f14' },
        { title: '新增房东', icon: 'md-person-add', count: 35, color: '#E46CBB' },
      ],
      pieData: [
        { value: 335, name: '标准双人房' },
        { value: 310, name: '标准大床房' },
        { value: 234, name: '豪华双人房' },
        { value: 135, name: '家庭母子房' },
        { value: 210, name: '其他' }
      ],
      barData: {
        Mon: 100,
        Tue: 210,
        Wed: 106,
        Thu: 310,
        Fri: 232,
        Sat: 142,
        Sun: 103
      }
    }
  },
  mounted () {
    //
  }
}
</script>

<style lang="less">
.count-style{
  font-size: 50px;
}
</style>
