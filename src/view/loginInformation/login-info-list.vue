<template>
  <div>
    <!--按钮部分-->
    <Card>
      <p slot="title">登录信息列表</p>
      <Row>
        <Col span="3" offset="17">
          <DatePicker type="datetime"  @on-change="handleSearchByStartTime" placeholder="请选择开始时间" style="width: 200px"></DatePicker>
        </Col>
        <Col span="3" offset="1">
          <DatePicker type="datetime"  @on-change="handleSearchByEndTime" placeholder="请选择结束时间" style="width: 200px"></DatePicker>
        </Col>
      </Row>
    </Card>
    <!--表格部分-->
    <Card>
      <div>
        <Table :columns="columnsList" :data="infoData" border disabled-hover></Table>
      </div>
      <div style="margin: 10px;overflow: hidden">
        <div style="float: right;">
          <Page show-total show-elevator :total="page.total" :current="page.currentPage"
                @on-change="handlePageTurn"></Page>
        </div>
      </div>
    </Card>
  </div>
</template>

<script>
  import {findLoginInfoData} from "@/libs/api/loginInfo";

  export default {
    name: "login-info-list",
    data() {
      return {
        //表头数组
        columnsList:[
          {
            title: '登录时间',
            align: 'center',
            key: 'loginTime'
          },
          {
            title: '登录者ID',
            align: 'center',
            key: 'managerId'
          },
          {
            title: '登录者用户名',
            align: 'center',
            key: 'managerUsername'
          },
          {
            title: '登录者姓名',
            align: 'center',
            key: 'managerName'
          }
        ],
        infoData:[],//日志数据
        searchOption: {}, // 查询用参数
        searchByName: '', // 根据名称查询
        page: {// 页面翻页对象
          total: 1, // 数据总数
          currentPage: 1// 当前页面
        },
      }
    },
    mounted(){
      this.findInfoData()
    },
    methods:{
      //获取日志数据
      async findInfoData(params){
        let res = await findLoginInfoData(params)
        if (res.code === 200) {
          this.infoData = res.data.list
          this.page = {
            total: res.data.total,
            currentPage: res.data.pageNum
          }
        } else {
          this.$Message.error(res.data)
        }
      },
      // 页面翻页
      handlePageTurn(page) {
        this.searchOption.page = page
        this.findInfoData(this.searchOption)
      },
      // 根据开始时间筛选日志列表数据
      handleSearchByStartTime(search) {
        if (search) { // 判断搜索条件是否为空
          this.searchOption.startTime = search
        } else { // 重置搜索内容
          this.searchOption.startTime = ''
        }
        this.searchOption.page = 1 // 初始化页数
        this.findInfoData(this.searchOption)
      },
      // 根据结束时间筛选日志列表数据
      handleSearchByEndTime(search) {
        if (search) { // 判断搜索条件是否为空
          this.searchOption.endTime = search
        } else { // 重置搜索内容
          this.searchOption.endTime = ''
        }
        this.searchOption.page = 1 // 初始化页数
        this.findInfoData(this.searchOption)
      },
    }
  }
</script>

<style scoped>

</style>
