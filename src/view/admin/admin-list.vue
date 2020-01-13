<template>
  <div>
    <!--按钮部分-->
    <Card>
      <p slot="title">管理员列表</p>
      <Row>
        <Col span="6">
          <Button type="primary" style="width: 30%" @click="openAddModal">添加</Button>
          <Button type="error" style="width: 30%;margin-left: 3%" @click="batchDel">批量删除</Button>
          <!--<div style="width: 100px"  v-if="!viewAccessByUserAdd || !viewAccessByUserDelMany">&nbsp;</div>-->
        </Col>
        <Col span="3" offset="15">
          <Input clearable icon="search" v-model="hotelName" @on-change="handleSearchByName"
                 placeholder="输入酒店名称搜索"/>
        </Col>
      </Row>
    </Card>

    <!--表格部分-->
    <Card>
      <div>
        <Table :columns="columnsList" :data="adminData" border @on-selection-change="batchSelect"
               disabled-hover></Table>
      </div>
      <div style="margin: 10px;overflow: hidden">
        <div style="float: right;">
          <Page show-total show-elevator :total="page.total" :current="page.currentPage"
                @on-change="handlePageTurn"></Page>
        </div>
      </div>
    </Card>

    <!--添加管理员Modal-->
    <Modal v-model="isAdd" @on-cancel="cancelAddModal" title="管理员添加：" width="600">
      <Form :model="addForm" ref="addForm" :rules="addRules" :label-width="80">
        <Card>
          <FormItem label="用户名：" prop="username">
            <Input clearable v-model="addForm.username" placeholder="请填写用户名姓名"/>
          </FormItem>
          <FormItem label="姓名：" prop="name">
            <Input clearable v-model="addForm.name" placeholder="请填写姓名"/>
          </FormItem>
          <FormItem label="电话：" prop="phone">
            <Input clearable v-model="addForm.phone" placeholder="请填写电话"/>
          </FormItem>
          <FormItem label="角色：" prop="role">
            <Select v-model="addForm.role">
              <Option value="0">超级管理员</Option>
              <Option value="1">系统监管</Option>
              <Option value="2">酒店管理</Option>
            </Select>
          </FormItem>
          <FormItem label="邮箱：" prop="mail">
            <Input clearable v-model="addForm.mail" placeholder="请填写邮箱"/>
          </FormItem>
          <FormItem label="关联酒店：" prop="hotelId">
            <Select clearable filterable v-model="addForm.hotelId" placeholder="请输入酒店名称查询" remote
                    :remote-method="v=>{remoteMethod(v)}" :loading="loading">
              <Option v-for="(option, index) in hotelData" :value="option.id" :key="index">{{option.name}}</Option>
            </Select>
          </FormItem>
          <!--<FormItem label="关联民宿：" prop="hotelId2">-->
            <!--<Select :disabled="addForm.hotelId != null" clearable filterable v-model="addForm.hotelId2" placeholder="请输入民宿名称查询" remote-->
                    <!--:remote-method="v=>{remoteMethod2(v)}" :loading="loading2">-->
              <!--<Option v-for="(option, index) in hostelData" :value="option.id" :key="index">{{option.name}}</Option>-->
            <!--</Select>-->
          <!--</FormItem>-->
          <FormItem label="密码：" prop="password">
            <Input clearable v-model="addForm.password" type="password" placeholder="请输入密码"/>
          </FormItem>
          <FormItem label="确认密码：" prop="rePassword">
            <Input clearable v-model="addForm.rePassword" type="password" placeholder="请确认密码"/>
          </FormItem>
        </Card>
      </Form>
      <!--自定义页脚-->
      <div slot="footer">
        <Button type="text" @click="cancelAddModal">取消</Button>
        <Button type="primary" @click="doAdminAdd">确认</Button>
      </div>
    </Modal>
    <!--编辑管理员Modal-->
    <Modal v-model="isEdit" @on-cancel="cancelEditModal" title="管理员编辑：" width="600">
      <Form :model="editForm" ref="editForm" :rules="editRules" :label-width="80">
        <Card>
          <FormItem label="用户名：" prop="username">
            <Input disabled v-model="editForm.username" placeholder="请填写用户名姓名"/>
          </FormItem>
          <FormItem label="姓名：" prop="name">
            <Input clearable v-model="editForm.name" placeholder="请填写姓名"/>
          </FormItem>
          <FormItem label="电话：" prop="phone">
            <Input clearable v-model="editForm.phone" placeholder="请填写电话"/>
          </FormItem>
          <FormItem label="角色：" prop="role">
            <Select v-model="editForm.role">
              <Option value="0">超级管理员</Option>
              <Option value="1">系统监管</Option>
              <Option value="2">酒店管理</Option>
            </Select>
          </FormItem>
          <FormItem label="邮箱：" prop="mail">
            <Input clearable v-model="editForm.mail" placeholder="请填写邮箱"/>
          </FormItem>
          <FormItem label="关联酒店：" prop="hotelId">
            <Select clearable filterable v-model="editForm.hotelId" placeholder="请输入酒店名称查询" remote
                    :remote-method="v=>{remoteMethod(v)}" :loading="loading">
              <Option v-for="(option, index) in hotelData" :value="option.id" :key="index">{{option.name}}</Option>
            </Select>
          </FormItem>
          <!--<FormItem label="关联民宿：" prop="hotelId2">-->
            <!--<Select :disabled="editForm.hotelId != null" clearable filterable v-model="editForm.hotelId2" placeholder="请输入民宿名称查询" remote-->
                    <!--:remote-method="v=>{remoteMethod2(v)}" :loading="loading2">-->
              <!--<Option v-for="(option, index) in hostelData" :value="option.id" :key="index">{{option.name}}</Option>-->
            <!--</Select>-->
          <!--</FormItem>-->
          <FormItem label="密码：" prop="password">
            <Input clearable v-model="editForm.password" type="password" placeholder="若不修改则可不填"/>
          </FormItem>
          <FormItem label="确认密码：" prop="rePassword">
            <Input clearable v-model="editForm.rePassword" type="password" placeholder="请确认密码"/>
          </FormItem>
        </Card>
      </Form>
      <!--自定义页脚-->
      <div slot="footer">
        <Button type="text" @click="cancelEditModal">取消</Button>
        <Button type="primary" @click="doAdminEdit">确认</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
  import {
    findManagerData,
    doManagerAdd,
    doManagerEdit,
    doManagerDel,
    doManagerDelMany
  } from "@/libs/api/manager";

  import {findHotelData} from "@/libs/api/hotel";
  // import {findHostelData} from "@/libs/api/hostel";
  import {adminRules} from "@/libs/check";

  export default {
    name: "admin-list",
    data() {
      // 校验
      const validatePassCheck = (rule, value, callback) => {
        if(value){
          if ((this.addForm.password !== '' && this.addForm.password != null)||(this.editForm.password !== '' && this.editForm.password != null)) {
            if (value !== this.addForm.password) {
              if(value !== this.editForm.password){
                callback(new Error('两次密码输入不一致'))
              }else{
                callback()
              }
            } else {
              callback()
            }
          } else {
            callback()
          }
        }else{
          callback()
        }
      };
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
            title: '用户名',
            align: 'center',
            key: 'username'
          },
          {
            title: '姓名',
            align: 'center',
            key: 'name'
          },
          {
            title: '手机',
            align: 'center',
            key: 'phone'
          },
          {
            title: '角色',
            align: 'center',
            key: 'role',
            render: (h, params) => {
              return h('span', [
                params.row.role === 2 ? '酒店管理' : (params.row.role === 1 ? '系统监管' : '超级管理员')
              ])
            }
          },
          {
            title: '邮箱',
            align: 'center',
            key: 'mail'
          },
          {
            title: '关联酒店',
            align: 'center',
            key: 'hotelName'
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
                      data.role = String(data.role)
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
                          this.doAdminDel(id)
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
        adminData: [],
        addForm: {},
        editForm: {},
        addRules:{
          rePassword: [{ validator: validatePassCheck, trigger: 'blur' },
            { required: true, message: '请输入确认密码', trigger: 'blur' },],
        },
        editRules:{
          password: [
            {
              pattern: /^[^~# $……^。，；：“”‘’{}()[`%*&|+<>/,.;:'"=\]\\]{6,20}$/,
              message: '密码格式不正确,密码由6-20位大小写字母、数字、符号：?、!、@组成',
              trigger: 'blur'
            }
          ],
          rePassword: [{ validator: validatePassCheck, trigger: 'blur' }],
        },
        hotelData:[],
        // hostelData:[],
        loading:false,
        // loading2:false,
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
        hotelName:''
      }
    },
    created(){
      this.addRules.username = adminRules.username
      this.addRules.name = adminRules.name
      this.addRules.phone = adminRules.phone
      this.addRules.role = adminRules.role
      this.addRules.mail = adminRules.mail
      this.addRules.password = adminRules.password
      this.editRules.username = adminRules.username
      this.editRules.name = adminRules.name
      this.editRules.phone = adminRules.phone
      this.editRules.role = adminRules.role
      this.editRules.mail = adminRules.mail
    },
    mounted(){
      this.findAdminData()
    },
    methods:{
      // 获取列表数据
      async findAdminData(params) {
        let res = await findManagerData(params)
        if (res.code === 200) {
          this.adminData = res.data.list
          this.page = {
            total: res.data.total,
            currentPage: res.data.pageNum
          }
        } else {
          this.$Message.error(res.message)
        }
      },
      //添加管理员
      async doAdminAdd(){
        this.$refs.addForm.validate(async (valid) => { // 表单校验
          if (valid) { // 表单验证成功
            let form = this.addForm
            // console.log(form)
            let res = await doManagerAdd(form)
            if (res.code === 200) { // 添加成功
              this.$Message.success('添加成功')
              this.findAdminData(this.searchOption)
              this.cancelAddModal()
            } else { // 添加失败
              this.$Message.error(res.data)
            }
          } else {
            this.$Message.error('请正确填写表单')
          }
        })
      },
      //编辑管理员
      async doAdminEdit(){
        this.$refs.editForm.validate(async (valid) => { // 表单校验
          if (valid) { // 校验成功
            let form = this.editForm
            let data = {}
            if (this.formCopy.name !== form.name) data.name = form.name
            if (this.formCopy.phone !== form.phone) data.phone = form.phone
            if (this.formCopy.role !== form.role) data.role = form.role
            if (form.password !== '' && form.password != null) data.password = form.password
            if (this.formCopy.hotelId !== form.hotelId) data.hotelId = form.hotelId
            if (this.formCopy.mail !== form.mail) data.mail = form.mail
            // console.log(data)
            if (Object.keys(data).length !== 0) { // 有修改
              data.id = form.id
              let res = await doManagerEdit(data)
              if (res.code === 200) { // 修改成功
                this.$Message.success('修改成功')
                this.findAdminData(this.searchOption)
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
      // 删除管理员
      async doAdminDel(params) {
        let res = await doManagerDel(params)
        if (res.code === 200) {
          this.$Message.success('删除成功')
          this.findAdminData(this.searchOption)
        } else {
          this.$Message.error(res.data)
        }
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
      // 批量删除
      batchDel() {
        if (this.delId.ids) {
          this.$Modal.confirm({ // 打开确认对话框
            title: '请确认删除',
            content: `<p>删除数据后无法恢复,确认删除?</p>`,
            okText: '确认',
            // 确认删除
            onOk: async () => {
              let res = await doManagerDelMany(this.delId)
              if (res.code === 200) {
                this.$Message.success('删除成功')
                this.delId.ids = ''
                this.findAdminData(this.searchOption)
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
      // 添加modal打开
      openAddModal () {
        this.addForm = {}
        this.isAdd = true
      },
      // 添加modal关闭
      cancelAddModal () {
        this.$refs.addForm.resetFields()// 重置表单
        this.addForm = {}
        this.hotelData = []
        this.isAdd = false
      },
      // 编辑modal打开
      openEditModal (params) {
        this.remoteMethod(params.hotelName)
        this.editForm = params
        this.isEdit = true
      },
      // 编辑modal关闭
      cancelEditModal(){
        this.$refs.editForm.resetFields()// 重置表单
        this.hotelData = []
        this.isEdit = false
      },
      // 页面翻页
      handlePageTurn(page) {
        this.searchOption.page = page
        this.findAdminData(this.searchOption)
      },
      //根据主题
      handleSearchByName(){
        if (this.hotelName) { // 判断搜索条件是否为空
          this.searchOption.hotelName = this.hotelName
        } else { // 重置搜索内容
          this.searchOption.hotelName = ''
        }
        this.searchOption.page = 1 // 初始化页数
        this.findAdminData(this.searchOption)
      },
    }
  }
</script>

<style scoped>

</style>
