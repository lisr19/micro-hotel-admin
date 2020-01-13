<template>
  <div>
    <!--按钮部分-->
    <Card>
      <p slot="title">房间政策列表</p>
      <Row>
        <Col span="6">
          <Button type="primary" style="width: 30%" @click="openAddModal">添加</Button>
          <Button type="error" style="width: 30%;margin-left: 3%" @click="batchDel">批量删除</Button>
          <!--<div style="width: 100px"  v-if="!viewAccessByUserAdd || !viewAccessByUserDelMany">&nbsp;</div>-->
        </Col>
        <!--<Col span="3" offset="11">-->
        <!--<Select clearable placeholder="选择标志查询" @on-change="handleSearchByFlag">-->
        <!--<Option value="1">酒店</Option>-->
        <!--<Option value="2">民宿</Option>-->
        <!--<Option value="3">会议室提供者</Option>-->
        <!--</Select>-->
        <!--</Col>-->
        <!--<Col span="3" offset="15">-->
        <!--<Input clearable icon="search" v-model="ruleTypeName" @on-change="handleSearchByName"-->
        <!--placeholder="输入政策类型名搜索"/>-->
        <!--</Col>-->
      </Row>
    </Card>

    <!--表格部分-->
    <Card>
      <div>
        <Table :columns="columnsList" :data="policyData" border @on-selection-change="batchSelect"
               disabled-hover></Table>
      </div>
      <div style="margin: 10px;overflow: hidden">
        <div style="float: right;">
          <Page show-total show-elevator :total="page.total" :current="page.currentPage"
                @on-change="handlePageTurn"></Page>
        </div>
      </div>
    </Card>

    <!--添加政策Modal-->
    <Modal v-model="isAdd" @on-cancel="cancelAddModal" title="政策添加：" width="900">
      <Form :model="addForm" ref="addForm" :rules="rules" :label-width="110">
        <Card>
          <FormItem label="内容：" prop="content">
            <editor ref="addEditor" :value="addForm.content" @on-change="handleChange"/>
          </FormItem>
          <FormItem label="政策类型：" prop="ruleType">
            <Select clearable filterable v-model="addForm.ruleType" placeholder="请输入政策类型名称查询">
              <Option v-for="(option, index) in typeData" :value="option.id" :key="index">{{option.name}}</Option>
            </Select>
          </FormItem>
          <FormItem label="关联房间：" prop="roomId">
            <Select clearable filterable v-model="addForm.roomId" placeholder="请输入房间名称查询" remote
                    :remote-method="v=>{remoteMethod(v)}" :loading="loading">
              <Option v-for="(option, index) in roomData" :value="option.id" :key="index">{{option.roomType}}</Option>
            </Select>
          </FormItem>
        </Card>
      </Form>
      <!--自定义页脚-->
      <div slot="footer">
        <Button type="text" @click="cancelAddModal">取消</Button>
        <Button type="primary" @click="doRoomPolicyAdd">确认</Button>
      </div>
    </Modal>

    <!--编辑政策Modal-->
    <Modal v-model="isEdit" @on-cancel="cancelEditModal" title="政策编辑：" width="900">
      <Form :model="editForm" ref="editForm" :rules="rules" :label-width="110">
        <Card>
          <FormItem label="内容：" prop="content">
            <editor ref="editEditor" :value="editForm.content" @on-change="handleChange"/>
          </FormItem>
          <FormItem label="政策类型：" prop="ruleType">
            <Select clearable filterable v-model="editForm.ruleType" placeholder="请输入政策类型名称查询">
              <Option v-for="(option, index) in typeData" :value="option.id" :key="index">{{option.name}}</Option>
            </Select>
          </FormItem>
          <FormItem label="关联房间：" prop="roomId">
            <Select clearable filterable v-model="editForm.roomId" placeholder="请输入房间名称查询" remote
                    :remote-method="v=>{remoteMethod(v)}" :loading="loading">
              <Option v-for="(option, index) in roomData" :value="option.id" :key="index">{{option.roomType}}</Option>
            </Select>
          </FormItem>
        </Card>
      </Form>
      <!--自定义页脚-->
      <div slot="footer">
        <Button type="text" @click="cancelEditModal">取消</Button>
        <Button type="primary" @click="doRoomPolicyEdit">确认</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
  import {
    findRoomPolicyData,
    doRoomPolicyAdd,
    doRoomPolicyEdit,
    doRoomPolicyDel,
    doRoomPolicyDelMany
  } from "@/libs/api/policy";
  import {findRoomData} from "@/libs/api/room";
  import {findPolicyTypeData} from "@/libs/api/policy";
  import {policyRules} from "@/libs/check";
  import Editor from '_c/editor'

  export default {
    name: "policy-room-list",
    components: {
      Editor
    },
    data() {
      return {
        isAdd: false,
        isEdit: false,
        columnsList: [
          {
            type: 'selection',
            width: 60,
            align: 'center'
          },
          {
            title: '政策类型名',
            align: 'center',
            key: 'ruleTypeName'
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
                    type: 'primary'
                  },
                  style: {
                    marginRight: '5px',
                    // display: this.viewAccessByUserEdit ? 'inline-block' : 'none'
                  },
                  on: {
                    click: () => {
                      let data = Object.assign({}, params.row)
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
                          let id = {id: params.row.id}
                          this.doRoomPolicyDel(id)
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
        policyData: [],
        roomData: [],
        typeData:[],
        loading: false,
        loading2: false,
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
        ruleTypeName: '',
      }
    },
    created(){
      this.rules = policyRules
      this.findPolicyTypeData()
    },
    mounted() {
      this.findRoomPolicyData()
    },
    methods: {
      // 获取列表数据
      async findRoomPolicyData(params) {
        let res = await findRoomPolicyData(params)
        if (res.code === 200) {
          this.policyData = res.data.list
          this.page = {
            total: res.data.total,
            currentPage: res.data.pageNum
          }
        } else {
          this.$Message.error(res.data)
        }
      },
      //获取服务类型数据
      async findPolicyTypeData(){
        let params = {
          size: 100
        }
        let res = await findPolicyTypeData(params)
        if (res.code === 200) {
          this.typeData = res.data.list
        } else {
          this.$Message.error(res.data)
        }
      },
      //添加政策
      async doRoomPolicyAdd() {
        this.$refs.addForm.validate(async (valid) => { // 表单校验
          if (valid) { // 表单验证成功
            let form = this.addForm
            // console.log(form)
            let res = await doRoomPolicyAdd(form)
            if (res.code === 200) { // 添加成功
              this.$Message.success('添加成功')
              this.findRoomPolicyData(this.searchOption)
              this.cancelAddModal()
            } else { // 添加失败
              this.$Message.error(res.data)
            }
          } else {
            this.$Message.error('请正确填写表单')
          }
        })
      },
      //编辑政策
      async doRoomPolicyEdit() {
        this.$refs.editForm.validate(async (valid) => { // 表单校验
          if (valid) { // 校验成功
            let form = this.editForm
            let data = {}
            if (this.formCopy.roomId !== form.roomId) data.roomId = form.roomId
            if (this.formCopy.ruleType !== form.ruleType) data.ruleType = form.ruleType
            if (this.formCopy.content !== form.content) data.content = form.content
            if (Object.keys(data).length !== 0) { // 有修改
              data.id = form.id
              let res = await doRoomPolicyEdit(data)
              if (res.code === 200) { // 修改成功
                this.$Message.success('编辑成功')
                this.findRoomPolicyData(this.searchOption)
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
      // 删除政策
      async doRoomPolicyDel(params) {
        let res = await doRoomPolicyDel(params)
        if (res.code === 200) {
          this.$Message.success('删除成功')
          this.findRoomPolicyData(this.searchOption)
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
              let res = await doRoomPolicyDelMany(this.delId)
              if (res.code === 200) {
                this.$Message.success('删除成功')
                this.delId.ids = ''
                this.findRoomPolicyData(this.searchOption)
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
      // 获取房间数据
      remoteMethod(query, status) {
        if (query !== '') {
          let params = {
            roomType: query,
            size: 100
          }
          this.loading = true
          setTimeout(async () => {
            this.loading = false
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
      openAddModal() {
        this.$refs.addEditor.setHtml('')
        this.addForm = {}
        this.isAdd = true
      },
      // 添加modal关闭
      cancelAddModal() {
        this.$refs.addForm.resetFields()// 重置表单
        this.addForm = {}
        this.roomData = []
        this.isAdd = false
      },
      // 编辑modal打开
      openEditModal(params) {
        this.$refs.editEditor.setHtml(params.content)
        this.remoteMethod(params.roomName)
        this.editForm = params
        this.isEdit = true
      },
      // 编辑modal关闭
      cancelEditModal() {
        this.$refs.editForm.resetFields()// 重置表单
        this.roomData = []
        this.isEdit = false
      },
      // 页面翻页
      handlePageTurn(page) {
        this.searchOption.page = page
        this.findRoomPolicyData(this.searchOption)
      },
      handleChange(html, text) {
        this.addForm.content = text
        this.editForm.content = text
        // console.log(html, text)
      },
      //根据类型名称查询
      handleSearchByName() {
        if (this.ruleTypeName) { // 判断搜索条件是否为空
          this.searchOption.ruleTypeName = this.ruleTypeName
        } else { // 重置搜索内容
          this.searchOption.ruleTypeName = ''
        }
        this.searchOption.page = 1 // 初始化页数
        this.findRoomPolicyData(this.searchOption)
      },
      //根据标志查询
      handleSearchByFlag(e) {
        if (e) { // 判断搜索条件是否为空
          this.searchOption.flag = e
        } else { // 重置搜索内容
          this.searchOption.flag = ''
        }
        this.searchOption.page = 1 // 初始化页数
        this.findRoomPolicyData(this.searchOption)
      },
    }
  }
</script>

<style scoped>

</style>
