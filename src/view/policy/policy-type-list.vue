<template>
  <div>
    <!--按钮部分-->
    <Card>
      <p slot="title">政策类型列表</p>
      <Row>
        <Col span="6">
          <Button type="primary" style="width: 30%" @click="openAddModal">添加</Button>
          <Button type="error" style="width: 30%;margin-left: 3%" @click="batchDel">批量删除</Button>
          <!--<div style="width: 100px"  v-if="!viewAccessByUserAdd || !viewAccessByUserDelMany">&nbsp;</div>-->
        </Col>
        <Col span="3" offset="7">
          <Select clearable placeholder="选择所属类型查询" @on-change="handleSearchByType">
            <Option value="0">全部</Option>
            <Option value="1">酒店</Option>
            <Option value="2">房间</Option>
            <Option value="3">会议室</Option>
          </Select>
        </Col>
        <Col span="3" offset="1">
          <Select clearable placeholder="选择标志查询" @on-change="handleSearchByFlag">
            <Option value="0">全部</Option>
            <Option value="1">酒店</Option>
            <Option value="2">民宿</Option>
            <Option value="3">会议室提供者</Option>
          </Select>
        </Col>
        <Col span="3" offset="1">
          <Input clearable icon="search" v-model="typeName" @on-change="handleSearchByName"
                 placeholder="输入类型名称搜索"/>
        </Col>
      </Row>
    </Card>

    <!--表格部分-->
    <Card>
      <div>
        <Table :columns="columnsList" :data="typeData" border @on-selection-change="batchSelect"
               disabled-hover></Table>
      </div>
      <div style="margin: 10px;overflow: hidden">
        <div style="float: right;">
          <Page show-total show-elevator :total="page.total" :current="page.currentPage"
                @on-change="handlePageTurn"></Page>
        </div>
      </div>
    </Card>

    <!--添加政策类型Modal-->
    <Modal v-model="isAdd" @on-cancel="cancelAddModal" title="类型添加：" width="600">
      <Form :model="addForm" ref="addForm" :rules="rules" :label-width="90">
        <Card>
          <FormItem label="类型名：" prop="name">
            <Input v-model="addForm.name" placeholder="请填写类型名"/>
          </FormItem>
          <FormItem label="所属类型：" prop="type">
            <Select clearable v-model="addForm.type">
              <Option value="0">全部</Option>
              <Option value="1">酒店</Option>
              <Option value="2">房间</Option>
              <Option value="3">会议室</Option>
            </Select>
          </FormItem>
          <FormItem label="标志：" prop="flag">
            <Select clearable v-model="addForm.flag">
              <Option value="0">全部</Option>
              <Option value="1">酒店</Option>
              <Option value="2">民宿</Option>
              <Option value="3">会议室提供者</Option>
            </Select>
          </FormItem>
        </Card>
      </Form>
      <!--自定义页脚-->
      <div slot="footer">
        <Button type="text" @click="cancelAddModal">取消</Button>
        <Button type="primary" @click="doPolicyTypeAdd">确认</Button>
      </div>
    </Modal>

    <!--编辑政策类型Modal-->
    <Modal v-model="isEdit" @on-cancel="cancelEditModal" title="类型编辑：" width="600">
      <Form :model="editForm" ref="editForm" :rules="rules" :label-width="90">
        <Card>
          <FormItem label="类型名：" prop="name">
            <Input v-model="editForm.name" placeholder="请填写类型名"/>
          </FormItem>
          <FormItem label="所属类型：" prop="type">
            <Select clearable v-model="editForm.type ">
              <Option value="0">全部</Option>
              <Option value="1">酒店</Option>
              <Option value="2">房间</Option>
              <Option value="3">会议室</Option>
            </Select>
          </FormItem>
          <FormItem label="标志：" prop="flag">
            <Select clearable v-model="editForm.flag">
              <Option value="0">全部</Option>
              <Option value="1">酒店</Option>
              <Option value="2">民宿</Option>
              <Option value="3">会议室提供者</Option>
            </Select>
          </FormItem>
        </Card>
      </Form>
      <!--自定义页脚-->
      <div slot="footer">
        <Button type="text" @click="cancelEditModal">取消</Button>
        <Button type="primary" @click="doPolicyTypeEdit">确认</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
  import {
    findPolicyTypeData,
    doPolicyTypeAdd,
    doPolicyTypeEdit,
    doPolicyTypeDel,
    doPolicyTypeDelMany
  } from "@/libs/api/policy";

  import {policyTypeRules} from "@/libs/check";

  export default {
    name: "policy-type-list",
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
            title: '政策类型',
            align: 'center',
            key: 'name'
          },
          {
            title: '所属类型',
            align: 'center',
            key: 'type',
            render: (h, params) => {
              return h('span', [
                params.row.type === 3 ? '会议室' : (params.row.type === 2?'房间':(params.row.type === 1?'酒店':'全部'))
              ])
            }
          },
          {
            title: '标志',
            align: 'center',
            key: 'flag',
            render: (h, params) => {
              return h('span', [
                params.row.flag === 3 ? '会议室提供者' : (params.row.flag === 2?'民宿':(params.row.flag === 1?'酒店':'全部'))
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
                      data.type = String(data.type)
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
                        content: `<p>删除数据: ${params.row.name} 后无法恢复,确认删除?</p>`,
                        okText: '确认',
                        onOk: () => {
                          let id = {id: params.row.id}
                          this.doPolicyTypeDel(id)
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
        typeData: [],
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
        typeName:''
      }
    },
    created(){
      this.rules = policyTypeRules
    },
    mounted(){
      this.findPolicyTypeData()
    },
    methods: {
      // 获取列表数据
      async findPolicyTypeData(params) {
        let res = await findPolicyTypeData(params)
        if (res.code === 200) {
          this.typeData = res.data.list
          this.page = {
            total: res.data.total,
            currentPage: res.data.pageNum
          }
        } else {
          this.$Message.error(res.data)
        }
      },
      //添加政策
      async doPolicyTypeAdd() {
        this.$refs.addForm.validate(async (valid) => { // 表单校验
          if (valid) { // 表单验证成功
            let form = this.addForm
            let res = await doPolicyTypeAdd(form)
            if (res.code === 200) { // 添加成功
              this.$Message.success('添加成功')
              this.findPolicyTypeData(this.searchOption)
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
      async doPolicyTypeEdit() {
        this.$refs.editForm.validate(async (valid) => { // 表单校验
          if (valid) { // 校验成功
            let form = this.editForm
            let data = {}
            if (this.formCopy.name !== form.name) data.name = form.name
            if (this.formCopy.flag !== form.flag) data.flag = form.flag
            if (this.formCopy.type !== form.type) data.type = form.type
            if (Object.keys(data).length !== 0) { // 有修改
              data.id = form.id
              let res = await doPolicyTypeEdit(data)
              if (res.code === 200) { // 编辑成功
                this.$Message.success('编辑成功')
                this.findPolicyTypeData(this.searchOption)
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
      // 删除政策
      async doPolicyTypeDel(params) {
        let res = await doPolicyTypeDel(params)
        if (res.code === 200) {
          this.$Message.success('删除成功')
          this.findPolicyTypeData(this.searchOption)
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
              let res = await doPolicyTypeDelMany(this.delId)
              if (res.code === 200) {
                this.$Message.success('删除成功')
                this.delId.ids = ''
                this.findPolicyTypeData(this.searchOption)
              } else {
                this.$Message.error(res.message)
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
      // 添加modal打开
      openAddModal() {
        this.addForm = {}
        this.isAdd = true
      },
      // 添加modal关闭
      cancelAddModal() {
        this.$refs.addForm.resetFields()// 重置表单
        this.addForm = {}
        this.isAdd = false
      },
      // 编辑modal打开
      openEditModal(params) {
        this.editForm = params
        this.isEdit = true
      },
      // 编辑modal关闭
      cancelEditModal() {
        this.$refs.editForm.resetFields()// 重置表单
        this.isEdit = false
      },
      // 页面翻页
      handlePageTurn(page) {
        this.searchOption.page = page
        this.findPolicyTypeData(this.searchOption)
      },
      //根据类型名称查询
      handleSearchByName(){
        if (this.typeName) { // 判断搜索条件是否为空
          this.searchOption.name = this.typeName
        } else { // 重置搜索内容
          this.searchOption.name = ''
        }
        this.searchOption.page = 1 // 初始化页数
        this.findPolicyTypeData(this.searchOption)
      },
      //根据类型名称查询
      handleSearchByType(e){
        if (e) { // 判断搜索条件是否为空
          this.searchOption.type = e
        } else { // 重置搜索内容
          this.searchOption.type = ''
        }
        this.searchOption.page = 1 // 初始化页数
        this.findPolicyTypeData(this.searchOption)
      },
      //根据标志查询
      handleSearchByFlag(e){
        if (e) { // 判断搜索条件是否为空
          this.searchOption.flag = e
        } else { // 重置搜索内容
          this.searchOption.flag = ''
        }
        this.searchOption.page = 1 // 初始化页数
        this.findPolicyTypeData(this.searchOption)
      },
    }
  }
</script>

<style scoped>

</style>
