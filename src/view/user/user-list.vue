<template>
  <div>
    <!--按钮部分-->
    <Card>
      <p slot="title">用户列表</p>
      <Row>
        <Col span="6">
          <Button type="primary" style="width: 30%" @click="openAddModal" v-if="viewAccessByUserAdd">添加</Button>
          <Button type="error" style="width: 30%;margin-left: 3%" @click="batchDel" v-if="viewAccessByUserDelMany">批量删除</Button>
          <div style="width: 100px"  v-if="!viewAccessByUserAdd || !viewAccessByUserDelMany">&nbsp;</div>
        </Col>
        <Col span="8" offset="10">
          <Input clearable icon="search" v-model="search" @on-change="handleSearch"
                 placeholder="输入手机号码/身份证/用户名/姓名搜索"/>
        </Col>
      </Row>
    </Card>
    <!--表格部分-->
    <Card>
      <div>
        <Table :columns="columnsList" :data="userData" border @on-selection-change="batchSelect"
               disabled-hover></Table>
      </div>
      <div style="margin: 10px;overflow: hidden">
        <div style="float: right;">
          <Page show-total show-elevator :total="page.total" :current="page.currentPage"
                @on-change="handlePageTurn"></Page>
        </div>
      </div>
    </Card>

    <!--添加用户Modal-->
    <Modal v-model="isAdd" @on-cancel="cancelAddModal" title="用户添加：" width="700">
      <Form :model="userAddForm" ref="userAddForm" :rules="rules" :label-width="120">
        <Card>
          <p slot="title">用户基本信息：</p>
          <FormItem label="头像：" prop="avatar">
            <img-upload ref="imgUpload" @imgUpload="getUploadImg"></img-upload>
          </FormItem>
          <FormItem label="用户名：" prop="username">
            <Input clearable v-model="userAddForm.username" placeholder="请填写用户名" style="width: 200px"/>
          </FormItem>
          <FormItem label="姓名：" prop="name">
            <Input clearable v-model="userAddForm.name" placeholder="请填写姓名" style="width: 200px"/>
          </FormItem>
          <FormItem label="性别：" prop="gender">
            <Select clearable v-model="userAddForm.gender" placeholder="请选择性别" style="width: 200px">
              <Option value="0" key="0">无</Option>
              <Option value="1" key="1">男</Option>
              <Option value="2" key="2">女</Option>
            </Select>
          </FormItem>
          <FormItem label="出生日期：">
            <DatePicker type="date" placeholder="出生日期" ref="dateAdd" :options="options" @on-change="getBirthday" style="width: 200px"></DatePicker>
          </FormItem>
          <FormItem label="手机：" prop="phone">
            <Input v-model="userAddForm.phone" placeholder="请填写电话"/>
          </FormItem>
          <FormItem label="启用：" prop="status">
            <RadioGroup v-model="userAddForm.status">
              <Radio label="1">
                <span>正常</span>
              </Radio>
              <Radio label="0">
                <span>禁用</span>
              </Radio>
            </RadioGroup>
          </FormItem>
          <FormItem label="邮箱：" prop="email">
            <Input v-model="userAddForm.email" placeholder="请填写邮箱"/>
          </FormItem>
          <FormItem label="身份证：" prop="idNumber">
            <Input clearable v-model="userAddForm.idNumber" placeholder="请填写身份证"/>
          </FormItem>
          <FormItem label="紧急联系人：" prop="emergencyContact">
            <Input v-model="userAddForm.emergencyContact" placeholder="请填写紧急联系人"/>
          </FormItem>
          <FormItem label="紧急联系人电话：" prop="emergencyContactPhone">
            <Input v-model="userAddForm.emergencyContactPhone" placeholder="请填写紧急联系人电话"/>
          </FormItem>
          <FormItem label="密码：" prop="password">
            <Input clearable v-model="userAddForm.password" type="password" placeholder="默认密码为手机号后四位"/>
          </FormItem>
          <FormItem label="确认密码：" prop="rePassword">
            <Input clearable v-model="userAddForm.rePassword" type="password" placeholder="请确认密码"/>
          </FormItem>
        </Card>
      </Form>
      <!--自定义页脚-->
      <div slot="footer">
        <Button type="text" @click="cancelAddModal">取消</Button>
        <Button type="primary" @click="doUserAdd">确认</Button>
      </div>
    </Modal>


    <!--编辑用户Modal-->
    <Modal v-model="isEdit" @on-cancel="cancelEditModal" title="用户编辑：" width="700">
      <Form :model="userEditForm" ref="userEditForm" :rules="rules" :label-width="120">
        <Card>
          <p slot="title">用户基本信息：</p>
          <FormItem label="头像：" prop="avatar">
            <img-upload ref="imgUploadByEdit" @imgUpload="getUploadImg"></img-upload>
          </FormItem>
          <FormItem label="用户名：" prop="username">
            <Input v-model="userEditForm.username" placeholder="请填写用户名" style="width: 200px"/>
          </FormItem>
          <FormItem label="姓名：" prop="name">
            <Input clearable v-model="userEditForm.name" placeholder="请填写姓名" style="width: 200px"/>
          </FormItem>
          <FormItem label="性别：" prop="gender">
            <Select clearable v-model="userEditForm.gender" placeholder="请选择性别" style="width: 200px">
              <Option value="0" key="0">无</Option>
              <Option value="1" key="1">男</Option>
              <Option value="2" key="2">女</Option>
            </Select>
          </FormItem>
          <FormItem label="出生日期：">
            <DatePicker type="date" placeholder="出生日期" ref="dateEdit" :options="options" v-model="userEditForm.birthday" @on-change="getBirthday" style="width: 200px"></DatePicker>
          </FormItem>
          <FormItem label="邮箱：" prop="email">
            <Input v-model="userEditForm.email" placeholder="请填写邮箱"/>
          </FormItem>
          <FormItem label="身份证：" prop="idNumber">
            <Input clearable v-model="userEditForm.idNumber" placeholder="请填写身份证"/>
          </FormItem>
          <FormItem label="手机：" prop="phone">
            <Input v-model="userEditForm.phone" placeholder="请填写电话"/>
          </FormItem>
          <FormItem label="启用：" prop="status">
            <RadioGroup v-model="userEditForm.status">
              <Radio label="1">
                <span>正常</span>
              </Radio>
              <Radio label="0">
                <span>禁用</span>
              </Radio>
            </RadioGroup>
          </FormItem>
          <FormItem label="紧急联系人：" prop="emergencyContact">
            <Input v-model="userEditForm.emergencyContact" placeholder="请填写紧急联系人"/>
          </FormItem>
          <FormItem label="紧急联系人电话：" prop="emergencyContactPhone">
            <Input v-model="userEditForm.emergencyContactPhone" placeholder="请填写紧急联系人电话"/>
          </FormItem>
          <FormItem label="密码：" prop="password">
            <Input clearable v-model="userEditForm.password" type="password" placeholder="默认密码为手机号后四位"/>
          </FormItem>
          <FormItem label="确认密码：" prop="rePassword">
            <Input clearable v-model="userEditForm.rePassword" type="password" placeholder="请确认密码"/>
          </FormItem>
        </Card>
      </Form>
      <!--自定义页脚-->
      <div slot="footer">
        <Button type="text" @click="cancelEditModal">取消</Button>
        <Button type="primary" @click="doUserEdit">确认</Button>
      </div>
    </Modal>
    <!--用户健康-->
    <user-health ref="userHealth"></user-health>
  </div>
</template>

<script>

  import {
    findUserData,
    doUserAdd,
    doUserEdit,
    doUserDel,
    doUserDelMany
  } from "@/libs/api/user";
  import ImgUpload from '../components/img-upload/img-upload'
  import {userRules} from "@/libs/check";
  import {hasOneOf} from '@/libs/tools'
  import userHealth from './user-health-list'

  export default {
    name: "user-list",
    components:{
      ImgUpload,
      userHealth
    },
    computed: {
      access () {
        return this.$store.state.user.access
      },
      viewAccessByUserAdd () { // 该用户是否拥有用户添加权限
        // return hasOneOf(['user-add'], this.access)
        return true
      },
      viewAccessByUserEdit () { // 该用户是否拥有用户信息编辑权限
        // return hasOneOf(['user-edit'], this.access)
        return true
      },
      viewAccessByUserDel () { // 该用户是否拥有用户删除权限
        // return hasOneOf(['user-del'], this.access)
        return true
      },
      viewAccessByUserDelMany () { // 该用户是否拥有用户删除权限
        // return hasOneOf(['user-delMany'], this.access)
        return true
      },
      viewAccessByPushuMany () {
        // return hasOneOf(['user-pushMany'], this.access)
        return true
      }
    },
    data() {
      // 校验
      const validatePassCheck = (rule, value, callback) => {
        if(value){
          if ((this.userAddForm.password !== '' && this.userAddForm.password != null)||(this.userEditForm.password !== '' && this.userEditForm.password != null)) {
            if (value !== this.userAddForm.password) {
              if(value !== this.userEditForm.password){
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
      const validateContactCheck = (rule, value, callback) => {
        if(value){
          if ((this.userAddForm.phone !== '' && this.userAddForm.phone != null)||(this.userEditForm.phone !== '' && this.userEditForm.phone != null)) {
            if (value === this.userAddForm.phone) {
              callback(new Error('紧急联系人电话与账号绑定电话不能相同'))
            } else if(value === this.userEditForm.phone){
              callback(new Error('紧急联系人电话与账号绑定电话不能相同'))
            }else{
              callback()
            }
          } else {
            callback()
          }
        }else{
          callback()
        }
      }
      return {
        isAdd:false,
        isEdit:false,
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
            title: '电话',
            align: 'center',
            key: 'phone'
          },
          {
            title: '身份证',
            align: 'center',
            key: 'idNumber',
            width:170
          },
          {
            title: '性别',
            align: 'center',
            key: 'gender',
            render: (h, params) => {
              return h('span', [
                params.row.gender === 0 ? '无' : (params.row.gender === 1 ? '男' : '女')
              ])
            }
          },
          {
            title: '头像',
            align: 'center',
            key: 'avatar',
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
                  src: params.row['avatar']
                    ? params.row['avatar'] + '?imageView2/1/w/45/h/45'
                    : 'http://sdcmi.halohealth.cn/images/1552373693998.jpg'
                }
              })
            }
          },
          {
            title: '紧急联系人',
            align: 'center',
            key: 'emergencyContact',
          },
          {
            title: '紧急联系人电话',
            align: 'center',
            key: 'emergencyContactPhone'
          },
          {
            title: '启用',
            align: 'center',
            key: 'status',
            render: (h, params) => {
              return h('span', [
                params.row.status === 0 ? '禁用' :'正常'
              ])
            }
          },
          {
            title: '余额',
            align: 'center',
            key: 'balance'
          },
          {
            title: '操作',
            align: 'center',
            key: 'handle',
            width: 230,
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
                        this.$refs.userHealth.openModal(data)
                      }
                    }
                  }, '健康'),
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
                        data.gender = String(data.gender)
                        data.status = String(data.status)
                        data.birthday = data.birthYear+'-'+data.birthMonth+'-'+data.birthDay
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
                          content: `<p>删除用户: ${params.row.username} 后无法恢复,确认删除?</p>`,
                          okText: '确认',
                          onOk: () => {
                            let id = {id: params.row.id}
                            this.doUserDel(id)
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
            }
          }
        ],
        userData: [],
        userAddForm:{},
        userEditForm:{},
        rules:{
          rePassword: [{ validator: validatePassCheck, trigger: 'blur' }],
          emergencyContactPhone: [
            { validator: validateContactCheck, trigger: 'blur' },
            { pattern: /^[1][3,4,5,7,8][0-9]{9}$/, message: '手机格式不正确', trigger: 'blur' }
            ],
        },
        search:'',
        //日期禁用
        options: {
          disabledDate (date) {
            return date && date.valueOf() > Date.now() - 86400000;
          }
        },
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
      this.rules.username = userRules.username
      this.rules.name = userRules.name
      this.rules.phone = userRules.phone
      this.rules.idNumber = userRules.idNumber
      this.rules.gender = userRules.gender
      this.rules.email = userRules.email
      this.rules.password = userRules.password
      this.rules.emergencyContact = userRules.emergencyContact
    },
    mounted(){
      this.findUserData()
    },
    methods: {
      // 获取用户列表数据
      async findUserData(params) {
        let res = await findUserData(params)
        if (res.code === 200) {
          this.userData = res.data.list
          this.page = {
            total: res.data.total,
            currentPage: res.data.pageNum
          }
        } else {
          this.$Message.error(res.data)
        }
      },
      //添加用户
      async doUserAdd(){
        this.$refs.userAddForm.validate(async (valid) => { // 表单校验
          if (valid) { // 表单验证成功
            let form = this.userAddForm
            console.log(form)
            // delete form.rePassword
            let res = await doUserAdd(form)
            if (res.code === 200) { // 添加成功
              this.$Message.success('添加成功')
              this.findUserData(this.searchOption)
              this.cancelAddModal()
            } else { // 添加失败
              this.$Message.error(res.data)
            }
          } else {
            this.$Message.error('请正确填写表单')
          }
        })
      },
      //编辑用户
      async doUserEdit(){
        this.$refs.userEditForm.validate(async (valid) => { // 表单校验
          if (valid) { // 校验成功
            let form = this.userEditForm
            let data = {}
            if (this.formCopy.name !== form.name) data.name = form.name
            if (this.formCopy.username !== form.username) data.username = form.username
            if (this.formCopy.phone !== form.phone) data.phone = form.phone
            if (this.formCopy.idNumber !== form.idNumber) data.idNumber = form.idNumber
            if (this.formCopy.gender !== form.gender) data.gender = form.gender
            if (this.formCopy.email !== form.email) data.email = form.email
            if (this.formCopy.avatar !== form.avatar) data.avatar = form.avatar
            if (this.formCopy.status !== form.status) data.status = form.status
            if (this.formCopy.emergencyContact !== form.emergencyContact) data.emergencyContact = form.emergencyContact
            if (this.formCopy.emergencyContactPhone !== form.emergencyContactPhone) data.emergencyContactPhone = form.emergencyContactPhone
            if (this.formCopy.birthYear !== form.birthYear || this.formCopy.birthMonth !== form.birthMonth || this.formCopy.birthDay !== form.birthDay) {
              data.birthYear = form.birthYear
              data.birthMonth = form.birthMonth
              data.birthDay = form.birthDay
            }
            if (form.password !== '' && form.password != null) data.password = form.password
            // console.log(data)
            if (Object.keys(data).length !== 0) { // 有修改
              data.id = form.id
              let res = await doUserEdit(data)
              if (res.code === 200) { // 修改成功
                this.$Message.success('编辑成功')
                this.findUserData(this.searchOption)
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
      // 删除用户
      async doUserDel(params) {
        let res = await doUserDel(params)
        if (res.code === 200) {
          this.$Message.success('删除成功')
          this.findUserData(this.searchOption)
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
              let res = await doUserDelMany(this.delId)
              if (res.code === 200) {
                this.$Message.success('删除成功')
                this.delId.ids = ''
                this.findUserData(this.searchOption)
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
        this.$refs.imgUpload.updateImgUrl([])
        this.userAddForm = {
          status:'1'
        }
        this.isAdd = true
      },
      // 添加modal关闭
      cancelAddModal () {
        this.$refs.userAddForm.resetFields()// 重置表单
        this.$refs.dateAdd.handleClear()
        this.userAddForm = {}
        this.isAdd = false
      },
      // 编辑modal打开
      openEditModal (params) {
        // console.log(params.avatar)
        if (params[`avatar`] && params.avatar !== '') {
          let list = []
          list.push({
            url: params.avatar,
            name: '头像',
            status: 'finished'
          })
          this.$refs.imgUploadByEdit.updateImgUrl(list)
        }
        // console.log(params)
        this.userEditForm = params
        this.isEdit = true
      },
      // 编辑modal关闭
      cancelEditModal(){
        this.$refs.userEditForm.resetFields()// 重置表单
        this.isEdit = false
      },
      // 获取上传图片url
      getUploadImg (url) {
        this.userAddForm.avatar = url
        this.userEditForm.avatar = url
      },
      //获取格式化后的生日
      getBirthday(e){
        let bir = e.split('-')
        this.userAddForm.birthYear = parseInt(bir[0])
        this.userAddForm.birthMonth = parseInt(bir[1])
        this.userAddForm.birthDay = parseInt(bir[2])
        this.userEditForm.birthYear = parseInt(bir[0])
        this.userEditForm.birthMonth = parseInt(bir[1])
        this.userEditForm.birthDay = parseInt(bir[2])
      },
      //搜索
      handleSearch(){
        if (this.search) { // 判断搜索条件是否为空
          this.searchOption.search = this.search
        } else { // 重置搜索内容
          this.searchOption.search = ''
        }
        this.searchOption.page = 1 // 初始化页数
        this.findUserData(this.searchOption)
      },
      // 页面翻页
      handlePageTurn(page) {
        this.searchOption.page = page
        this.findUserData(this.searchOption)
      },
    }
  }
</script>

<style scoped>

</style>
