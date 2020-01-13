<template>
  <div>
    <!--按钮部分-->
    <Card>
      <p slot="title">日志列表</p>
      <Row>
        <Col span="3" offset="13">
          <DatePicker type="datetime"  @on-change="handleSearchByStartTime" placeholder="请选择开始时间" style="width: 200px"></DatePicker>
        </Col>
        <Col span="3" offset="1">
          <DatePicker type="datetime"  @on-change="handleSearchByEndTime" placeholder="请选择结束时间" style="width: 200px"></DatePicker>
        </Col>
        <Col span="3" offset="1">
          <Select clearable @on-change="handleSearchByLevel" placeholder="请选择日志级别">
            <Option value="INFO">INFO</Option>
            <Option value="WARN">WARN</Option>
            <Option value="ERROR">ERROR</Option>
          </Select>
        </Col>
      </Row>
    </Card>
    <!--表格部分-->
    <Card>
      <div>
        <Table :columns="columnsList" :data="logData" border disabled-hover></Table>
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

  export default {
    name: "log",
    data() {
      return {
        //表头数组
        columnsList:[
          {
            title: '添加时间',
            align: 'center',
            key: 'addTime'
          },
          {
            title: '日志等级',
            align: 'center',
            key: 'levelString'
          },
          {
            title: '记录内容',
            align: 'center',
            render: (h, params) => {
              if(params.row.loggerName){
                let texts = '';//表格列显示文字
                if (params.row.loggerName) {
                  if (params.row.loggerName.length > 35) {//进行截取列显示字数
                    texts = params.row.loggerName.substring(0, 35) + ".....";
                  } else {
                    texts = params.row.loggerName;
                  }
                }
                return h('p', [
                  h('Poptip', {
                    props: {
                      trigger:"hover",
                      placement: 'top',
                    },
                  }, [//这个中括号表示是Tooltip标签的子标签
                    texts,//表格列显示文字
                    h('p', {
                      slot: 'content',
                      style: {
                        maxWidth:'300px',
                        fontSize:'14px',
                        whiteSpace: 'normal'
                      },
                    }, params.row.loggerName)//整个的信息即气泡内文字
                  ])
                ])
              }else{
                return h('span',[
                  params.row.loggerName === ''? '无':params.row.loggerName
                ])
              }
            }
          },
          {
            title: '详细信息',
            align: 'center',
            render: (h, params) => {
              if(params.row.formattedMessage){
                let texts = '';//表格列显示文字
                if (params.row.formattedMessage) {
                  if (params.row.formattedMessage.length > 40) {//进行截取列显示字数
                    texts = params.row.formattedMessage.substring(0, 40) + ".....";
                  } else {
                    texts = params.row.formattedMessage;
                  }
                }
                return h('p', [
                  h('Poptip', {
                    props: {
                      trigger:"hover",
                      placement: 'top',
                    },
                  }, [//这个中括号表示是Tooltip标签的子标签
                    texts,//表格列显示文字
                    h('p', {
                      slot: 'content',
                      style: {
                        maxWidth:'300px',
                        fontSize:'14px',
                        whiteSpace: 'normal'
                      },
                    }, params.row.formattedMessage)//整个的信息即气泡内文字
                  ])
                ])
              }else{
                return h('span',[
                  params.row.formattedMessage === ''? '无':params.row.formattedMessage
                ])
              }
            }
          },
        ],
        logData:[],//日志数据
        searchOption: {}, // 查询用参数
        searchByName: '', // 根据名称查询
        page: {// 页面翻页对象
          total: 1, // 数据总数
          currentPage: 1// 当前页面
        },
      }
    },
    methods:{
      //获取日志数据
      async findLogData(params){
        // let res = await findLogData(params)
        // if (res.code === 200) {
        //   this.logData = res.data.list
        //   this.page = {
        //     total: res.data.total,
        //     currentPage: res.data.pageNum
        //   }
        // } else {
        //   this.$Message.error(res.message)
        // }
      },
      // 页面翻页
      handlePageTurn(page) {
        this.searchOption.page = page
        this.findLogData(this.searchOption)
      },
      // 根据日志级别筛选日志列表数据
      handleSearchByLevel(search) {
        if (search) { // 判断搜索条件是否为空
          this.searchOption.levelString = search
        } else { // 重置搜索内容
          this.searchOption.levelString = ''
        }
        this.searchOption.page = 1 // 初始化页数
        this.findLogData(this.searchOption)
      },
      // 根据开始时间筛选日志列表数据
      handleSearchByStartTime(search) {
        if (search) { // 判断搜索条件是否为空
          this.searchOption.startTime = search
        } else { // 重置搜索内容
          this.searchOption.startTime = ''
        }
        this.searchOption.page = 1 // 初始化页数
        this.findLogData(this.searchOption)
      },
      // 根据结束时间筛选日志列表数据
      handleSearchByEndTime(search) {
        if (search) { // 判断搜索条件是否为空
          this.searchOption.endTime = search
        } else { // 重置搜索内容
          this.searchOption.endTime = ''
        }
        this.searchOption.page = 1 // 初始化页数
        this.findLogData(this.searchOption)
      },
    },
    created(){
      this.findLogData()
    }
  }
</script>

<style scoped>

</style>
