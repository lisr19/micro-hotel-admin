<template>
  <div>
    <Modal v-model="isShow" @on-cancel="cancelModal" :title="'('+roomData.roomType+')设施'" width="1200">
      <!--按钮部分-->
      <Card>
        <p slot="title">房间服务列表</p>
        <Row>
          <Col span="6">
            <Button type="primary" style="width: 30%" @click="openAddModal">添加</Button>
            <Button type="error" style="width: 30%;margin-left: 3%" @click="batchDel">批量删除</Button>
            <!--<div style="width: 100px"  v-if="!viewAccessByUserAdd || !viewAccessByUserDelMany">&nbsp;</div>-->
          </Col>
        </Row>
      </Card>

      <!--表格部分-->
      <Card>
        <div>
          <Table :columns="columnsList" :data="facData" border @on-selection-change="batchSelect"
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


    <!--添加服务Modal-->
    <Modal v-model="isAdd" @on-cancel="cancelAddModal" title="服务添加：" width="900">
      <Form :model="addForm" ref="addForm" :rules="rules" :label-width="110">
        <Card>
          <FormItem label="服务：" prop="facilityServiceId">
            <Select clearable filterable v-model="addForm.facilityServiceId" placeholder="请输入服务类型名称查询">
              <Option v-for="(option, index) in serviceData" :value="option.id" :key="index">{{option.name}}</Option>
            </Select>
          </FormItem>
          <FormItem label="所属类型：" prop="flag">
            <RadioGroup v-model="addForm.flag">
              <Radio label="1" disabled>
                <span>酒店/民宿</span>
              </Radio>
              <Radio label="2" disabled>
                <span>会议室</span>
              </Radio>
            </RadioGroup>
          </FormItem>
          <FormItem label="关联房间：" prop="roomType">
            <Input disabled v-model="addForm.roomType" placeholder="请填写房间名称"/>
          </FormItem>
        </Card>
      </Form>
      <!--自定义页脚-->
      <div slot="footer">
        <Button type="text" @click="cancelAddModal">取消</Button>
        <Button type="primary" @click="doRoomFacilitiesAdd">确认</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
  import {
    findRoomFacilitiesData,
    doRoomFacilitiesAdd,
    doRoomFacilitiesEdit,
    doRoomFacilitiesDel,
    doRoomFacilitiesDelMany
  } from "@/libs/api/facilities";
  import {findFacilitiesData} from "@/libs/api/facilities";
  import {facRules} from "@/libs/check";

  export default {
    name: "facilities-room",
    props:{
      flag:{
        type:String,
        default:''
      }
    },
    data() {
      return {
        isAdd: false,
        isShow:false,
        columnsList: [
          {
            type: 'selection',
            width: 60,
            align: 'center'
          },
          {
            title: '服务名称',
            align: 'center',
            key: 'facilityServiceName'
          },
          {
            title: '标志',
            align: 'center',
            key: 'flag',
            render: (h, params) => {
              return h('span', [
                params.row.flag === 2 ? '会议室' : '酒店/民宿'
              ])
            }
          },
          {
            title: '所属酒店/民宿',
            align: 'center',
            key: 'hotelName',
            render: (h, params) => {
              return h('span', [
                params.row.hotelName || params.row.homeStayName
              ])
            }
          },
          {
            title: '关联房间',
            align: 'center',
            key: 'roomType'
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
                    type: 'error'
                  },
                  // style: {
                  //   display: this.viewAccessByUserDel ? 'inline-block' : 'none'
                  // },
                  on: {
                    click: () => {
                      this.$Modal.confirm({
                        title: '请确认删除',
                        content: `<p>删除数据后无法恢复,确认删除?</p>`,
                        okText: '确认',
                        onOk: () => {
                          let id = {id: params.row.id}
                          this.doRoomFacilitiesDel(id)
                        },
                        // 取消删除
                        onCancel: () => {
                          this.$Message.info('取消删除！')
                        }
                      })
                    }
                  }
                }, '删除')
              ])
              // }else {
              //   return h('span', '您没有操作该表的权限')
              // }
            }
          }
        ],
        facData: [],
        roomData: {},
        serviceData: [],
        loading: false,
        addForm: {},
        editForm: {},
        rules: {},
        // 批量选择的id对象
        delId: {
          ids: ''
        },
        page: {// 页面翻页对象
          total: 1, // 数据总数
          currentPage: 1// 当前页面
        },
        formCopy: {}, // 表单对象复制
        searchOption: {}, // 查询用参数
        name: '',
      }
    },
    created() {
      this.rules = facRules
      this.findFacilitiesData()
    },
    mounted() {
      this.findRoomFacilitiesData()
    },
    methods: {
      // 获取列表数据
      async findRoomFacilitiesData(params) {
        let res = await findRoomFacilitiesData(params)
        if (res.code === 200) {
          this.facData = res.data.list
          this.page = {
            total: res.data.total,
            currentPage: res.data.pageNum
          }
        } else {
          this.$Message.error(res.data)
        }
      },
      //获取服务数据
      async findFacilitiesData() {
        let params = {
          size: 100
        }
        let res = await findFacilitiesData(params)
        if (res.code === 200) {
          this.serviceData = res.data.list
        } else {
          this.$Message.error(res.data)
        }
      },
      //添加服务
      async doRoomFacilitiesAdd() {
        this.$refs.addForm.validate(async (valid) => { // 表单校验
          if (valid) { // 表单验证成功
            let form = this.addForm
            // console.log(form)
            let res = await doRoomFacilitiesAdd(form)
            if (res.code === 200) { // 添加成功
              this.$Message.success('添加成功')
              this.findRoomFacilitiesData(this.searchOption)
              this.cancelAddModal()
            } else { // 添加失败
              this.$Message.error(res.data)
            }
          } else {
            this.$Message.error('请正确填写表单')
          }
        })
      },
      // 删除服务
      async doRoomFacilitiesDel(params) {
        let res = await doRoomFacilitiesDel(params)
        if (res.code === 200) {
          this.$Message.success('删除成功')
          this.findRoomFacilitiesData(this.searchOption)
        } else {
          this.$Message.error(res.data)
        }
      },
      // 批量删除
      batchDel() {
        if (this.delId.ids) {
          this.$Modal.confirm({ // 打开确认对话框
            title: '请确认删除',
            content: `<p>删除数据后无法恢复,确认删除?</p>`,
            okText: '确认',
            // 确认删除
            onOk: async () => {
              let res = await doRoomFacilitiesDelMany(this.delId)
              if (res.code === 200) {
                this.$Message.success('删除成功')
                this.delId.ids = ''
                this.findRoomFacilitiesData(this.searchOption)
              } else {
                this.$Message.error(res.data)
              }
            },
            // 取消删除
            onCancel: () => {
              this.$Message.info('取消删除！')
            }
          })
        } else {
          this.$Message.info('请选择需要删除的数据！')
        }
      },
      // 批量选择
      batchSelect(selection) {
        this.delId.ids = ''
        selection.forEach(row => {
          if (this.delId.ids === '') {
            this.delId.ids = row.id
          } else {
            this.delId.ids = this.delId.ids + ',' + row.id
          }
        })
      },
      // modal打开
      openModal (data) {
        // console.log(data)
        this.roomData = data
        this.searchOption.roomId = data.id
        this.findRoomFacilitiesData(this.searchOption)
        this.isShow = true
      },
      // modal关闭
      cancelModal(){
        this.isShow = false
      },
      // 添加modal打开
      openAddModal() {
        this.addForm = {
          flag:this.flag,
          roomType:this.roomData.roomType,
          roomId:this.roomData.id
        }
        this.isAdd = true
      },
      // 添加modal关闭
      cancelAddModal() {
        this.$refs.addForm.resetFields()// 重置表单
        this.addForm = {}
        this.isAdd = false
      },
      // 页面翻页
      handlePageTurn(page) {
        this.searchOption.page = page
        this.findRoomFacilitiesData(this.searchOption)
      },
    }
  }
</script>

<style scoped>

</style>
