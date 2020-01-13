<template>
  <div>
    <!--按钮部分-->
    <Card>
      <p slot="title">酒店/民宿设施列表</p>
      <Row>
        <Col span="6">
          <Button type="primary" style="width: 30%" @click="openAddModal">添加</Button>
          <Button type="error" style="width: 30%;margin-left: 3%" @click="batchDel">批量删除</Button>
          <!--<div style="width: 100px"  v-if="!viewAccessByUserAdd || !viewAccessByUserDelMany">&nbsp;</div>-->
        </Col>
        <Col span="3" offset="11">
          <Select clearable placeholder="选择标志查询" @on-change="handleSearchByFlag">
            <Option value="1">酒店</Option>
            <Option value="2">民宿</Option>
          </Select>
        </Col>
        <Col span="3" offset="1">
          <Select clearable filterable placeholder="请输入服务类型名称查询" @on-change="handleSearchByService">
            <Option v-for="(option, index) in typeData" :value="option.id" :key="index">{{option.name}}</Option>
          </Select>
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

    <!--添加设施Modal-->
    <Modal v-model="isAdd" @on-cancel="cancelAddModal" title="设施添加：" width="600">
      <Form :model="addForm" ref="addForm" :rules="rules" :label-width="110">
        <Card>
          <FormItem label="设施名：" prop="facilityServiceId">
            <Select clearable filterable v-model="addForm.facilityServiceId" placeholder="请输入设施名查询" >
              <Option v-for="(option, index) in typeData" :value="option.id" :key="index">{{option.name}}</Option>
            </Select>
          </FormItem>
          <FormItem label="所属类型：" prop="flag">
            <RadioGroup v-model="addForm.flag">
              <Radio label="1">
                <span>酒店</span>
              </Radio>
              <Radio label="2">
                <span>民宿</span>
              </Radio>
            </RadioGroup>
          </FormItem>
          <FormItem label="关联酒店：" prop="hotelId" v-if="addForm.flag === '1'">
            <Select clearable filterable v-model="addForm.hotelId" placeholder="请输入酒店名称查询" remote
                    :remote-method="v=>{remoteMethod(v)}" :loading="loading">
              <Option v-for="(option, index) in hotelData" :value="option.id" :key="index">{{option.name}}</Option>
            </Select>
          </FormItem>
          <FormItem label="关联民宿：" prop="hotelId" v-if="addForm.flag === '2'">
            <Select  clearable filterable v-model="addForm.hotelId" placeholder="请输入民宿名称查询" remote
                     :remote-method="v=>{remoteMethod2(v)}" :loading="loading2">
              <Option v-for="(option, index) in hostelData" :value="option.id" :key="index">{{option.name}}</Option>
            </Select>
          </FormItem>
        </Card>
      </Form>
      <!--自定义页脚-->
      <div slot="footer">
        <Button type="text" @click="cancelAddModal">取消</Button>
        <Button type="primary" @click="doHotelFacilitiesAdd">确认</Button>
      </div>
    </Modal>

    <!--编辑设施Modal-->
    <Modal v-model="isEdit" @on-cancel="cancelEditModal" title="设施编辑：" width="600">
      <Form :model="editForm" ref="editForm" :rules="rules" :label-width="110">
        <Card>
          <FormItem label="设施名：" prop="facilityServiceId">
            <Select clearable filterable v-model="editForm.facilityServiceId" placeholder="请输入设施名查询" >
              <Option v-for="(option, index) in typeData" :value="option.id" :key="index">{{option.name}}</Option>
            </Select>
          </FormItem>
          <FormItem label="所属类型：" prop="flag">
            <RadioGroup v-model="editForm.flag">
              <Radio label="1">
                <span>酒店</span>
              </Radio>
              <Radio label="2">
                <span>民宿</span>
              </Radio>
            </RadioGroup>
          </FormItem>
          <FormItem label="关联酒店：" prop="hotelId" v-if="editForm.flag === '1'">
            <Select clearable filterable v-model="editForm.hotelId" placeholder="请输入酒店名称查询" remote
                    :remote-method="v=>{remoteMethod(v)}" :loading="loading">
              <Option v-for="(option, index) in hotelData" :value="option.id" :key="index">{{option.name}}</Option>
            </Select>
          </FormItem>
          <FormItem label="关联民宿：" prop="hotelId" v-if="editForm.flag === '2'">
            <Select  clearable filterable v-model="editForm.hotelId" placeholder="请输入民宿名称查询" remote
                     :remote-method="v=>{remoteMethod2(v)}" :loading="loading2">
              <Option v-for="(option, index) in hostelData" :value="option.id" :key="index">{{option.name}}</Option>
            </Select>
          </FormItem>
        </Card>
      </Form>
      <!--自定义页脚-->
      <div slot="footer">
        <Button type="text" @click="cancelEditModal">取消</Button>
        <Button type="primary" @click="doHotelFacilitiesEdit">确认</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
  import {
    findHotelFacilitiesData,
    doHotelFacilitiesAdd,
    doHotelFacilitiesEdit,
    doHotelFacilitiesDel,
    doHotelFacilitiesDelMany
  } from "@/libs/api/facilities";
  import {findHotelData} from "@/libs/api/hotel";
  import {findHostelData} from "@/libs/api/hostel";
  import {findFacilitiesData} from "@/libs/api/facilities";
  import {facRules} from "@/libs/check";

  export default {
    name: "facilities-hotel-list",
    data() {
      return {
        isAdd:false,
        isEdit:false,
        columnsList:[
          {
            type: 'selection',
            width: 60,
            align: 'center'
          },
          {
            title: '设施名',
            align: 'center',
            key: 'facilityServiceName'
          },
          {
            title: '标志',
            align: 'center',
            key: 'flag',
            render: (h, params) => {
              return h('span', [
                params.row.flag === 2 ? '民宿' : '酒店'
              ])
            }
          },
          {
            title: '关联酒店/民宿',
            align: 'center',
            key: 'hotelName',
            render: (h, params) => {
              return h('span', [
                params.row.flag === 1 ? params.row.hotelName : (params.row.flag === 2?params.row.homeStayName:'')
              ])
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
                      let data = Object.assign({}, params.row)
                      data.flag = String(data.flag)
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
                        content: `<p>删除数据: ${params.row.facilityServiceName} 后无法恢复,确认删除?</p>`,
                        okText: '确认',
                        onOk: () => {
                          let id = {id: params.row.id}
                          this.doHotelFacilitiesDel(id)
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
        facData:[],
        hotelData:[],
        hostelData:[],
        typeData:[],
        loading:false,
        loading2:false,
        loading3:false,
        addForm:{},
        editForm:{},
        rules:{},
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
      }
    },
    created(){
      this.rules = facRules
      this.findFacilitiesData()
    },
    mounted(){
      this.findHotelFacilitiesData()
    },
    methods:{
      // 获取列表数据
      async findHotelFacilitiesData(params) {
        let res = await findHotelFacilitiesData(params)
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
      //获取设施类型
      async findFacilitiesData(){
        let params = {
          size:100
        }
        let res = await findFacilitiesData(params)
        if (res.code === 200) {
          this.typeData = res.data.list
        }else {
          this.$Message.error(res.data)
        }
      },
      //添加设施
      async doHotelFacilitiesAdd(){
        this.$refs.addForm.validate(async (valid) => { // 表单校验
          if (valid) { // 表单验证成功
            let form = this.addForm
            let res = await doHotelFacilitiesAdd(form)
            if (res.code === 200) { // 添加成功
              this.$Message.success('添加成功')
              this.findHotelFacilitiesData(this.searchOption)
              this.cancelAddModal()
            } else { // 添加失败
              this.$Message.error(res.data)
            }
          } else {
            this.$Message.error('请正确填写表单')
          }
        })
      },
      //编辑设施
      async doHotelFacilitiesEdit(){
        this.$refs.editForm.validate(async (valid) => { // 表单校验
          if (valid) { // 校验成功
            let form = this.editForm
            let data = {}
            if (this.formCopy.hotelId !== form.hotelId) data.hotelId = form.hotelId
            if (this.formCopy.facilityServiceId !== form.facilityServiceId) data.facilityServiceId = form.facilityServiceId
            if (this.formCopy.flag !== form.flag) data.flag = form.flag
            if (Object.keys(data).length !== 0) { // 有修改
              data.id = form.id
              let res = await doHotelFacilitiesEdit(data)
              if (res.code === 200) { // 修改成功
                this.$Message.success('编辑成功')
                this.findHotelFacilitiesData(this.searchOption)
                this.cancelEditModal()
              } else { // 修改失败
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
      // 删除设施
      async doHotelFacilitiesDel(params) {
        let res = await doHotelFacilitiesDel(params)
        if (res.code === 200) {
          this.$Message.success('删除成功')
          this.findHotelFacilitiesData(this.searchOption)
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
              let res = await doHotelFacilitiesDelMany(this.delId)
              if (res.code === 200) {
                this.$Message.success('删除成功')
                this.delId.ids = ''
                this.findHotelFacilitiesData(this.searchOption)
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
      // 获取酒店数据
      remoteMethod (query, status) {
        if (query !== '') {
          let params = {
            name: query,
            size:100
          }
          this.loading = true
          setTimeout(async () => {
            this.loading = false
            let res = await findHotelData(params)
            if (res.code === 200) {
              this.hotelData = res.data.list
            }
          }, 200)
        } else {
          this.hotelData = []
        }
      },
      // 获取民宿数据
      remoteMethod2 (query, status) {
        if (query !== '') {
          let params = {
            name: query,
            size:100
          }
          this.loading2 = true
          setTimeout(async () => {
            this.loading2 = false
            let res = await findHostelData(params)
            if (res.code === 200) {
              this.hostelData = res.data.list
            }
          }, 200)
        } else {
          this.hotelData = []
        }
      },
      // 添加modal打开
      openAddModal () {
        this.addForm = {}
        this.isAdd = true
      },
      // 添加modal关闭
      cancelAddModal () {
        this.$refs.addForm.resetFields()// 重置表单
        this.hotelData=[]
        this.hostelData=[]
        this.addForm = {}
        this.isAdd = false
      },
      // 编辑modal打开
      openEditModal (params) {
        if(params.flag === '1'){
          this.remoteMethod(params.hotelName)
        }else if(params.flag === '2'){
          this.remoteMethod2(params.homeStayName)
        }
        this.editForm = params
        this.isEdit = true
      },
      // 编辑modal关闭
      cancelEditModal(){
        this.$refs.editForm.resetFields()// 重置表单
        this.hotelData=[]
        this.hostelData=[]
        this.isEdit = false
      },
      // 页面翻页
      handlePageTurn(page) {
        this.searchOption.page = page
        this.findHotelFacilitiesData(this.searchOption)
      },
      //根据类型名称查询
      handleSearchByService(e) {
        if (e) { // 判断搜索条件是否为空
          this.searchOption.facilityServiceId = e
        } else { // 重置搜索内容
          this.searchOption.facilityServiceId = ''
        }
        this.searchOption.page = 1 // 初始化页数
        this.findHotelFacilitiesData(this.searchOption)
      },
      //根据标志查询
      handleSearchByFlag(e) {
        if (e) { // 判断搜索条件是否为空
          this.searchOption.flag = e
        } else { // 重置搜索内容
          this.searchOption.flag = ''
        }
        this.searchOption.page = 1 // 初始化页数
        this.findHotelFacilitiesData(this.searchOption)
      },
    }
  }
</script>

<style scoped>

</style>
