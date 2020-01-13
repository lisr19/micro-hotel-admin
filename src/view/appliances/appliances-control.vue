<template>
  <div>
    <!--按钮部分-->
    <Card>
      <p slot="title">家电控制列表</p>
      <Row>
        <Col span="3" offset="21">
          <Input clearable icon="search"
                 placeholder="输入民宿/酒店名称搜索"/>
        </Col>
      </Row>
    </Card>
    <!--表格部分-->
    <Card>
      <div>
        <Table :columns="columnsList" :data="hotelData" border
               disabled-hover></Table>
      </div>
      <div style="margin: 10px;overflow: hidden">
        <div style="float: right;">
          <Page show-total show-elevator :total="page.total" :current="page.currentPage"
                @on-change="handlePageTurn"></Page>
        </div>
      </div>
    </Card>

    <Modal v-model="isControl" @on-cancel="cancelModal" title="家电控制" width="1000">
      <Card>
        <iframe src="http://wanfanji.3322.org:8123" class="control"></iframe>
      </Card>
      <!--自定义页脚-->
      <div slot="footer"></div>
    </Modal>
  </div>
</template>

<script>
  export default {
    name: "appliances-control",
    data() {
      return {
        isControl:false,
        columnsList:[
          {
            title: '关联酒店/民宿',
            align: 'center',
            key: 'hotelName'
          },
          {
            title: '图片',
            align: 'center',
            key: 'imgUrl',
            render: (h, params) => {
              return h('img', {
                style: {
                  margin: '5px',
                  display: 'inline-block',
                  height: '40px',
                  width: '40px',
                  borderRadius: '5px'
                },
                attrs: {
                  src: params.row['imgUrl']
                    ? params.row['imgUrl'] + '?imageView2/1/w/45/h/45'
                    : 'http://sdcmi.halohealth.cn/images/1552373693998.jpg'
                }
              })
            }
          },
          {
            title: '操作',
            align: 'center',
            key: 'handle',
            width: 200,
            render: (h, params) => {
              // if (this.viewAccessByUserEdit || this.viewAccessByUserDel) {
              return h('div', [
                  h('Button', {
                    props: {
                      type: 'primary'
                    },
                    style: {
                      marginRight: '5px',
                      // display: this.viewAccessByUserEdit ? 'inline-block' : 'none'
                    },
                    on: {
                      click: () => {
                        this.openModal()
                      }
                    }
                  }, '控制')
              ])
            }
          }
        ],
        hotelData:[
          {
            hotelId:22,
            hotelName:'桂林百悦酒店',
            imgUrl:'http://micro-hotel.halohealth.cn/images/1562054945988.jpg'
          }
        ],
        page: {// 页面翻页对象
          total: 1, // 数据总数
          currentPage: 1// 当前页面
        },
      }
    },
    methods:{
      // modal打开
      openModal () {
        this.isControl = true
      },
      // modal关闭
      cancelModal(){
        this.isControl = false
      },
      // 页面翻页
      handlePageTurn(page) {
        this.searchOption.page = page
      },
    }
  }
</script>

<style lang="less" scoped>
  .control{
    width: 100%;
    height: 800px;
  }
</style>
