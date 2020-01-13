<template>
  <div>
    <!--按钮部分-->
    <Card>
      <p slot="title">预定订单列表</p>
      <Row>
        <Col span="6">
          <Button type="primary" style="width: 30%" @click="openAddModal">添加</Button>
          <Button type="error" style="width: 30%;margin-left: 3%" @click="batchDel">批量删除</Button>
          <!--<div style="width: 100px"  v-if="!viewAccessByUserAdd || !viewAccessByUserDelMany">&nbsp;</div>-->
        </Col>
        <Col span="3" offset="7">
          <Input clearable v-model="userName" placeholder="请输入用户姓名查询" @on-change="handleSearchByUserName"/>
        </Col>
        <Col span="3" offset="1">
          <DatePicker type="datetime" placeholder="请选择下单时间查询" @on-change="handleSearchByAddTime"
                      style="width: 200px"></DatePicker>
        </Col>
        <Col span="3" offset="1">
          <Select clearable placeholder="请选择订单状态查询" @on-change="handleSearchByStatus">
            <Option value="0">待付款</Option>
            <Option value="1">未出行</Option>
            <Option value="2">入住中</Option>
            <Option value="3">未评价</Option>
            <Option value="4">已评价</Option>
            <Option value="5">取消</Option>
          </Select>
        </Col>
      </Row>
    </Card>

    <!--表格部分-->
    <Card>
      <div>
        <Table :columns="columnsList" :data="orderData" border @on-selection-change="batchSelect"
               disabled-hover></Table>
      </div>
      <div style="margin: 10px;overflow: hidden">
        <div style="float: right;">
          <Page show-total show-elevator :total="page.total" :current="page.currentPage"
                @on-change="handlePageTurn"></Page>
        </div>
      </div>
    </Card>

    <!--添加订单Modal-->
    <Modal v-model="isAdd" @on-cancel="cancelAddModal" title="订单添加：" width="600">
      <Form :model="addForm" ref="addForm" :rules="rules" :label-width="110">
        <Card>
          <FormItem label="订单用户：" prop="userId">
            <Select clearable filterable v-model="addForm.userId" placeholder="请输入用户姓名查询" remote
                    :remote-method="v=>{remoteMethod(v)}" :loading="loading">
              <Option v-for="(option, index) in userData" :value="option.id" :key="index">{{option.name}}</Option>
            </Select>
          </FormItem>
          <FormItem label="联系人：" prop="linkman">
            <Input clearable v-model="addForm.linkman" placeholder="请填写联系人"/>
          </FormItem>
          <FormItem label="联系电话：" prop="phone">
            <Input clearable v-model="addForm.phone" placeholder="请填写联系电话"/>
          </FormItem>
          <FormItem label="整体出租：" prop="singleRental">
            <RadioGroup v-model="addForm.singleRental">
              <Radio label="0">
                <span>否</span>
              </Radio>
              <Radio label="1">
                <span>是</span>
              </Radio>
            </RadioGroup>
          </FormItem>
          <FormItem label="房型：" prop="roomId">
            <Select :disabled="addForm.singleRental === '1'" clearable filterable v-model="addForm.roomId"
                    placeholder="请输入房间号查询" remote
                    :remote-method="v=>{remoteMethod2(v)}" :loading="loading2">
              <Option v-for="(option, index) in roomData" :value="option.id" :key="index">{{option.roomType}}</Option>
            </Select>
          </FormItem>
          <FormItem label="住宿天数（晚）：" prop="livingPeriod">
            <Input clearable v-model="addForm.livingPeriod" placeholder="请填写住宿天数（晚）">
            <span slot="append">晚</span>
            </Input>
          </FormItem>
          <FormItem label="入住时间：" prop="startTime">
            <DatePicker type="datetime" ref="addDate" placeholder="请选择入住时间" @on-change="handleSearchByStartTime"
                        style="width: 300px"></DatePicker>
          </FormItem>
          <FormItem label="离开时间：" prop="endTime">
            <DatePicker type="datetime" ref="addDate2" placeholder="请选择离开时间" @on-change="handleSearchByEndTime"
                        style="width: 300px"></DatePicker>
          </FormItem>
          <FormItem label="总金额：" prop="totalPrice">
            <Input v-model="addForm.totalPrice" placeholder="请填写总金额">
            <span slot="append">元</span>
            </Input>
          </FormItem>
          <FormItem label="订单状态：" prop="status">
            <Select clearable v-model="addForm.status" placeholder="请选择订单状态">
              <Option value="0">待付款</Option>
              <Option value="1">未出行</Option>
              <Option value="2">入住中</Option>
              <Option value="3">未评价</Option>
              <Option value="4">已评价</Option>
              <Option value="5">取消</Option>
            </Select>
          </FormItem>
        </Card>
      </Form>
      <!--自定义页脚-->
      <div slot="footer">
        <Button type="text" @click="cancelAddModal">取消</Button>
        <Button type="primary" @click="doOrderAdd">确认</Button>
      </div>
    </Modal>
    <!--编辑订单Modal-->
    <Modal v-model="isEdit" @on-cancel="cancelEditModal" title="订单编辑：" width="600">
      <Form :model="editForm" ref="editForm" :rules="rules" :label-width="110">
        <Card>
          <FormItem label="订单用户：" prop="userId">
            <Select clearable filterable v-model="editForm.userId" placeholder="请输入用户姓名查询" remote
                    :remote-method="v=>{remoteMethod(v)}" :loading="loading">
              <Option v-for="(option, index) in userData" :value="option.id" :key="index">{{option.name}}</Option>
            </Select>
          </FormItem>
          <FormItem label="联系人：" prop="linkman">
            <Input clearable v-model="editForm.linkman" placeholder="请填写联系人"/>
          </FormItem>
          <FormItem label="联系电话：" prop="phone">
            <Input clearable v-model="editForm.phone" placeholder="请填写联系电话"/>
          </FormItem>
          <FormItem label="整体出租：" prop="singleRental">
            <RadioGroup v-model="editForm.singleRental">
              <Radio label="0">
                <span>否</span>
              </Radio>
              <Radio label="1">
                <span>是</span>
              </Radio>
            </RadioGroup>
          </FormItem>
          <FormItem label="房型：" prop="roomId">
            <Select :disabled="editForm.singleRental === '1'" clearable filterable v-model="editForm.roomId"
                    placeholder="请输入房间号查询" remote
                    :remote-method="v=>{remoteMethod2(v)}" :loading="loading2">
              <Option v-for="(option, index) in roomData" :value="option.id" :key="index">{{option.roomType}}</Option>
            </Select>
          </FormItem>
          <FormItem label="住宿天数（晚）：" prop="livingPeriod">
            <Input clearable v-model="editForm.livingPeriod" placeholder="请填写住宿天数（晚）">
            <span slot="append">晚</span>
            </Input>
          </FormItem>
          <FormItem label="入住时间：" prop="startTime">
            <DatePicker type="datetime" ref="editDate" placeholder="请选择入住时间" v-model="editForm.startTime"
                        style="width: 300px"></DatePicker>
          </FormItem>
          <FormItem label="离开时间：" prop="endTime">
            <DatePicker type="datetime" ref="editDate2" placeholder="请选择离开时间" v-model="editForm.endTime"
                        style="width: 300px"></DatePicker>
          </FormItem>
          <FormItem label="总金额：" prop="totalPrice">
            <Input clearable v-model="editForm.totalPrice" placeholder="请填写总金额">
            <span slot="append">元</span>
            </Input>
          </FormItem>
          <FormItem label="订单状态：" prop="status">
            <Select clearable v-model="editForm.status" placeholder="请选择订单状态">
              <Option value="0">待付款</Option>
              <Option value="1">未出行</Option>
              <Option value="2">入住中</Option>
              <Option value="3">未评价</Option>
              <Option value="4">已评价</Option>
              <Option value="5">取消</Option>
            </Select>
          </FormItem>
        </Card>
      </Form>
      <!--自定义页脚-->
      <div slot="footer">
        <Button type="text" @click="cancelEditModal">取消</Button>
        <Button type="primary" @click="doOrderEdit">确认</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
import {
  findOrderData,
  doOrderAdd,
  doOrderEdit,
  doOrderDel,
  doOrderDelMany
} from '@/libs/api/order'
import { findUserData } from '@/libs/api/user'
import { findRoomData } from '@/libs/api/room'
import { orderRules } from '@/libs/check'

export default {
  name: 'order-list',
  data () {
    return {
      isAdd: false,
      isEdit: false,
      columnsList: [
        {
          type: 'selection',
          width: 60,
          align: 'center'
        },
        // {
        //   title: '订单ID',
        //   align: 'center',
        //   key: 'id'
        // },
        {
          title: '预订人',
          align: 'center',
          key: 'userName'
        },
        {
          title: '联系人',
          align: 'center',
          key: 'linkman'
        },
        {
          title: '联系电话',
          align: 'center',
          key: 'phone'
        },
        {
          title: '酒店/民宿',
          align: 'center',
          render: (h, params) => {
            return h('span', [
              params.row.flag === 1 ? params.row.hotelName : params.row.homeStayName
            ])
          }
        },
        {
          title: '房型',
          align: 'center',
          key: 'roomType'
        },
        // {
        //   title: '预定时长（晚）',
        //   align: 'center',
        //   key: 'livingPeriod'
        // },
        {
          title: '订单金额',
          align: 'center',
          key: 'totalPrice'
        },
        {
          title: '订单状态',
          align: 'center',
          key: 'status',
          render: (h, params) => {
            let status = ''
            switch (params.row.status) {
              case (0):
                status = '待付款'
                break
              case (1):
                status = '未出行'
                break
              case (2):
                status = '入住中'
                break
              case (3):
                status = '未评价'
                break
              case (4):
                status = '已评价'
                break
              case (5):
                status = '取消'
                break
            }
            return h('span', [status])
          }
        },
        {
          title: '下单时间',
          align: 'center',
          key: 'addTime'
        },
        {
          title: '操作',
          align: 'center',
          key: 'handle',
          width: 180,
          render: (h, params) => {
            // if (this.viewAccessByUserEdit || this.viewAccessByUserDel) {
            return h('div', [
              h('Button', {
                props: {
                  type: 'primary'
                },
                style: {
                  marginRight: '5px'
                  // display: this.viewAccessByUserEdit ? 'inline-block' : 'none'
                },
                on: {
                  click: () => {
                    let data = Object.assign({}, params.row)
                    data.status = String(data.status)
                    data.totalPrice = String(data.totalPrice)
                    data.singleRental = String(data.singleRental)
                    this.formCopy = Object.assign({}, data)
                    this.openEditModal(data)
                  }
                }
              }, '编辑'),
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
                        let id = { id: params.row.id }
                        this.doOrderDel(id)
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
      orderData: [],
      userData: [],
      hotelData: [],
      hostelData: [],
      roomData: [],
      loading: false,
      loading2: false,
      loading3: false,
      loading4: false,
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
      userName: ''
    }
  },
  created () {
    this.rules = orderRules
  },
  mounted () {
    this.findOrderData()
  },
  methods: {
    // 获取列表数据
    async findOrderData (params) {
      // console.log(params)
      let res = await findOrderData(params)
      if (res.code === 200) {
        this.orderData = res.data.list
        this.page = {
          total: res.data.total,
          currentPage: res.data.pageNum
        }
      } else {
        this.$Message.error(res.data)
      }
    },
    // 添加订单
    async doOrderAdd () {
      this.$refs.addForm.validate(async (valid) => { // 表单校验
        if (valid) { // 表单验证成功
          let form = this.addForm
          let res = await doOrderAdd(form)
          if (res.code === 200) { // 添加成功
            this.$Message.success('添加成功')
            this.findOrderData(this.searchOption)
            this.cancelAddModal()
          } else { // 添加失败
            this.$Message.error(res.data)
          }
        } else {
          this.$Message.error('请正确填写表单')
        }
      })
    },
    // 编辑订单
    async doOrderEdit () {
      this.$refs.editForm.validate(async (valid) => { // 表单校验
        if (valid) { // 校验成功
          let form = this.editForm
          let data = {}
          if (this.formCopy.userId !== form.userId) data.userId = form.userId
          if (this.formCopy.roomId !== form.roomId) data.roomId = form.roomId
          if (this.formCopy.linkman !== form.linkman) data.linkman = form.linkman
          if (this.formCopy.phone !== form.phone) data.phone = form.phone
          if (this.formCopy.totalPrice !== form.totalPrice) data.totalPrice = form.totalPrice
          if (this.formCopy.status !== form.status) data.status = form.status
          if (this.formCopy.startTime !== this.$refs.editDate.publicStringValue) data.startTime = this.$refs.editDate.publicStringValue
          if (this.formCopy.endTime !== this.$refs.editDate2.publicStringValue) data.endTime = this.$refs.editDate2.publicStringValue
          if (this.formCopy.livingPeriod !== form.livingPeriod) data.livingPeriod = form.livingPeriod
          if (this.formCopy.singleRental !== form.singleRental) data.singleRental = form.singleRental
          // console.log(data)
          if (Object.keys(data).length !== 0) { // 有修改
            data.id = form.id
            let res = await doOrderEdit(data)
            if (res.code === 200) { // 编辑成功
              this.$Message.success('编辑成功')
              this.findOrderData(this.searchOption)
              this.cancelEditModal()
            } else { // 添加失败
              this.$Message.error(res.data)
            }
          } else {
            this.$Message.warning('没有改动')
          }
        } else {
          this.$Message.error('请正确填写表单')
        }
      })
    },
    // 删除订单
    async doOrderDel (params) {
      let res = await doOrderDel(params)
      if (res.code === 200) {
        this.$Message.success('删除成功')
        this.findOrderData(this.searchOption)
      } else {
        this.$Message.error(res.data)
      }
    },
    // 批量删除
    batchDel () {
      if (this.delId.ids) {
        this.$Modal.confirm({ // 打开确认对话框
          title: '请确认删除',
          content: `<p>删除数据后无法恢复,确认删除?</p>`,
          okText: '确认',
          // 确认删除
          onOk: async () => {
            let res = await doOrderDelMany(this.delId)
            if (res.code === 200) {
              this.$Message.success('删除成功')
              this.delId.ids = ''
              this.findOrderData(this.searchOption)
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
    batchSelect (selection) {
      this.delId.ids = ''
      selection.forEach(row => {
        if (this.delId.ids === '') {
          this.delId.ids = row.id
        } else {
          this.delId.ids = this.delId.ids + ',' + row.id
        }
      })
    },
    // 获取用户数据
    remoteMethod (query, status) {
      if (query !== '') {
        let params = {
          search: query,
          size: 100
        }
        this.loading = true
        setTimeout(async () => {
          this.loading = false
          let res = await findUserData(params)
          if (res.code === 200) {
            this.userData = res.data.list
          }
        }, 200)
      } else {
        this.userData = []
      }
    },
    // 获取房型数据
    remoteMethod2 (query, status) {
      if (query !== '') {
        let params = {
          roomType: query,
          size: 100
        }
        this.loading2 = true
        setTimeout(async () => {
          this.loading2 = false
          let res = await findRoomData(params)
          if (res.code === 200) {
            this.roomData = res.data.list
          }
        }, 200)
      } else {
        this.roomData = []
      }
    },
    // 添加modal打开
    openAddModal () {
      this.$refs.addDate.handleClear()
      this.$refs.addDate2.handleClear()
      this.addForm = {
        singleRental: '0'
      }
      this.isAdd = true
    },
    // 添加modal关闭
    cancelAddModal () {
      this.$refs.addForm.resetFields()// 重置表单
      this.addForm = {}
      this.userData = []
      this.hotelData = []
      this.hostelData = []
      this.roomData = []
      this.isAdd = false
    },
    // 编辑modal打开
    openEditModal (params) {
      this.remoteMethod(params.userName)
      this.remoteMethod2(params.roomType)
      this.editForm = params
      this.isEdit = true
    },
    // 编辑modal关闭
    cancelEditModal () {
      this.$refs.editForm.resetFields()// 重置表单
      this.userData = []
      this.hotelData = []
      this.hostelData = []
      this.roomData = []
      this.isEdit = false
    },
    // 页面翻页
    handlePageTurn (page) {
      this.searchOption.page = page
      this.findOrderData(this.searchOption)
    },
    // 获取入住时间
    handleSearchByStartTime (e) {
      this.addForm.startTime = e
    },
    // 获取离开时间
    handleSearchByEndTime (e) {
      this.addForm.endTime = e
    },
    handleSearchByUserName () {
      if (this.userName) { // 判断搜索条件是否为空
        this.searchOption.userName = this.userName
      } else { // 重置搜索内容
        this.searchOption.userName = ''
      }
      this.searchOption.page = 1 // 初始化页数
      this.findOrderData(this.searchOption)
    },
    handleSearchByAddTime (e) {
      // console.log(e)
      if (e) { // 判断搜索条件是否为空
        this.searchOption.addTime = e
      } else { // 重置搜索内容
        this.searchOption.addTime = ''
      }
      this.searchOption.page = 1 // 初始化页数
      this.findOrderData(this.searchOption)
    },
    handleSearchByStatus (e) {
      if (e) { // 判断搜索条件是否为空
        this.searchOption.status = e
      } else { // 重置搜索内容
        this.searchOption.status = ''
      }
      this.searchOption.page = 1 // 初始化页数
      this.findOrderData(this.searchOption)
    }
  }
}
</script>

<style scoped>

</style>
