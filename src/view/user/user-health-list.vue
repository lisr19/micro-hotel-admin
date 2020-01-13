<template>
    <div>
      <Modal v-model="isHealth" @on-cancel="cancelModal" :title="(userData.name||userData.username)+' 健康列表：'" width="1450">
        <!--按钮部分-->
        <!--<Card>-->
          <!--<Row>-->
            <!--<Col span="6" offset="18">-->
              <!--<Input clearable icon="search"-->
                     <!--placeholder="输入手机号码/用户名/姓名搜索"/>-->
            <!--</Col>-->
          <!--</Row>-->
        <!--</Card>-->

        <!--表格部分-->
        <Card>
          <div>
            <Table :columns="columnsList" :data="healthData" border
                   disabled-hover></Table>
          </div>
          <div style="margin: 10px;overflow: hidden">
            <div style="float: right;">
              <Page show-total show-elevator :total="page.total" :current="page.currentPage"
                    @on-change="handlePageTurn"></Page>
            </div>
          </div>
        </Card>
        <!--自定义页脚-->
        <div slot="footer"></div>
      </Modal>

      <Modal v-model="isDetail" @on-cancel="cancelDetailModal" title="健康详情：" width="600">
        <Card>
          <div class="data-show">
            <div class="data-show-item">
              状态：<span style="color: red">血压偏高</span>
            </div>
            <div class="data-show-item">
              体检时间：<span>{{detailData.addTime}}</span>
            </div>
          </div>
          <div class="data-show">
            <div class="data-show-item">
              身高(cm)：<span>{{detailData.height}}</span>
            </div>
            <div class="data-show-item">
              体重(kg)：<span>{{detailData.weight}}</span>
            </div>
          </div>
          <div class="data-show">
            <div class="data-show-item">
              BMI(kg/m²)：<span>{{detailData.height}}</span>
            </div>
            <div class="data-show-item">
              血氧饱和度(%)：<span>{{detailData.weight}}</span>
            </div>
          </div>
          <div class="data-show">
            <div class="data-show-item">
              脂肪率(%)：<span>{{detailData.fat}}</span>
            </div>
            <div class="data-show-item">
              基础代谢：<span>{{detailData.bmr}}</span>
            </div>
          </div>
          <div class="data-show">
            <div class="data-show-item">
              水分含量(%)：<span>{{detailData.water}}</span>
            </div>
            <div class="data-show-item">
              血氧饱和度(%)：<span>{{detailData.weight}}</span>
            </div>
          </div>
          <div class="data-show">
            <div class="data-show-item">
              血糖(mmol/L)：<span>{{detailData.glu}} ({{detailData.glhoursAfterMealu === 0?'空腹':'餐后'}})</span>
            </div>
            <div class="data-show-item">
              尿酸(mmol/L)：<span>{{detailData.ua}}</span>
            </div>
          </div>
          <div class="data-show">
            <div class="data-show-item">
              胆固醇(mmol/L)：<span>{{detailData.chol}}</span>
            </div>
            <div class="data-show-item">
              体温(℃)：<span>{{detailData.TT}}</span>
            </div>
          </div>
          <div class="data-show">
            <div class="data-show-item">
              动脉高压(mmHg)：<span style="color: red">{{detailData.Highpressure}}</span>
            </div>
            <div class="data-show-item">
              动脉低压(mmHg)：<span>{{detailData.Lowpressure}}</span>
            </div>
          </div>
        </Card>
        <!--自定义页脚-->
        <div slot="footer">
          <Button type="text" @click="cancelDetailModal">取消</Button>
        </div>
      </Modal>
    </div>
</template>

<script>
    export default {
        name: "user-health-list",
      data(){
          return{
            isHealth:false,
            isDetail:false,
            columnsList:[
              {
                title: '时间',
                align: 'center',
                key: 'addTime'
              },
              {
                title: '身高(cm)',
                align: 'center',
                key: 'height'
              },
              {
                title: '体重(kg)',
                align: 'center',
                key: 'weight'
              },
              {
                title: 'BMI(kg/m²)',
                align: 'center',
                key: 'bmi'
              },
              {
                title: '血糖(mmol/L)',
                align: 'center',
                key: 'glu'
              },
              {
                title: '尿酸(mmol/L)',
                align: 'center',
                key: 'ua'
              },
              {
                title: '胆固醇(mmol/L)',
                align: 'center',
                key: 'chol'
              },
              {
                title: '动脉高压(mmHg)',
                align: 'center',
                key: 'Highpressure'
              },
              {
                title: '动脉低压(mmHg)',
                align: 'center',
                key: 'Lowpressure'
              },
              {
                title: '操作',
                align: 'center',
                key: 'handle',
                render: (h, params) => {
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
                          let data = Object.assign({}, params.row)
                          this.openDetailModal(data)
                        }
                      }
                    }, '详情'),
                  ])
                }
              }
            ],
            userData:{},
            detailData:{},
            healthData:[],
            page: {// 页面翻页对象
              total: 1, // 数据总数
              currentPage: 1// 当前页面
            },
            showData:[
              {
                addTime:'2019-5-6 13:23:22',
                height:'175',
                weight:'65',
                bmi:'23',
                bo:'96',
                fat:'23',
                bmr:'1430',
                water:'60',
                glu:'6',
                glhoursAfterMealu:1,
                ua:'0.148',
                chol:'5',
                TT:'36.5',
                Highpressure:'135',
                Lowpressure:'85',
              }
            ]
          }
      },
      methods:{
        // modal打开
        openModal (data) {
          this.userData = data
          if(data.username === 'LSR')this.healthData = this.showData
          this.isHealth = true
        },
        // modal关闭
        cancelModal(){
          this.userData = {}
          this.healthData=[]
          this.isHealth = false
        },
        // modal打开
        openDetailModal (data) {
          this.detailData = data
          this.isDetail = true
        },
        // modal关闭
        cancelDetailModal(){
          this.detailData = {}
          this.isDetail = false
        },
        // 页面翻页
        handlePageTurn(page) {
          this.searchOption.page = page
          // this.findUserData(this.searchOption)
        },
      }
    }
</script>

<style lang="less" scoped>
 .data-show{
   display: flex;
   justify-content: space-around;
   margin-bottom: 20px;
   .data-show-item{
     width: 40%;
   }
 }
</style>
