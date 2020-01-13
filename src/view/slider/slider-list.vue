<template>
  <div>
    <!--按钮部分-->
    <Card>
      <p slot="title">轮播图类型列表</p>
      <Row>
        <Col span="6">
          <Button type="primary" style="width: 30%" @click="openAddModal">添加</Button>
          <Button type="error" style="width: 30%;margin-left: 3%" @click="batchDel">批量删除</Button>
          <!--<div style="width: 100px"  v-if="!viewAccessByUserAdd || !viewAccessByUserDelMany">&nbsp;</div>-->
        </Col>
        <Col span="3" offset="15">
          <Select clearable filterable placeholder="请选择轮播图类型查询" @on-change="handleSearchByType">
            <Option v-for="(option, index) in typeData" :value="option.id" :key="index">{{option.name}}</Option>
          </Select>
        </Col>
      </Row>
    </Card>

    <!--表格部分-->
    <Card>
      <div>
        <Table :columns="columnsList" :data="sliderData" border @on-selection-change="batchSelect"
               disabled-hover></Table>
      </div>
      <div style="margin: 10px;overflow: hidden">
        <div style="float: right;">
          <Page show-total show-elevator :total="page.total" :current="page.currentPage"
                @on-change="handlePageTurn"></Page>
        </div>
      </div>
    </Card>

    <!--添加Modal-->
    <Modal v-model="isAdd" @on-cancel="cancelAddModal" title="录播图添加：" width="600">
      <Form :model="addForm" ref="addForm" :rules="rules" :label-width="110">
        <Card>
          <FormItem label="图片：" prop="url">
            <img-upload ref="imgUpload" @imgUpload="getUploadImg"></img-upload>
          </FormItem>
          <FormItem label="图片名：" prop="name">
            <Input v-model="addForm.name" placeholder="请填写图片名"/>
          </FormItem>
          <FormItem label="轮播图类型：" prop="typeId">
            <Select clearable v-model="addForm.typeId" placeholder="请选择轮播图类型" >
              <Option v-for="(option, index) in typeData" :value="option.id" :key="index">{{option.name}}</Option>
            </Select>
          </FormItem>
        </Card>
      </Form>
      <!--自定义页脚-->
      <div slot="footer">
        <Button type="text" @click="cancelAddModal">取消</Button>
        <Button type="primary" @click="doSliderAdd">确认</Button>
      </div>
    </Modal>

    <!--编辑Modal-->
    <Modal v-model="isEdit" @on-cancel="cancelEditModal" title="录播图编辑：" width="600">
      <Form :model="editForm" ref="editForm" :rules="rules" :label-width="110">
        <Card>
          <FormItem label="图片：" prop="url">
            <img-upload ref="imgUploadByEdit" @imgUpload="getUploadImg"></img-upload>
          </FormItem>
          <FormItem label="图片名：" prop="name">
            <Input v-model="editForm.name" placeholder="请填写图片名"/>
          </FormItem>
          <FormItem label="轮播图类型：" prop="typeId">
            <Select clearable v-model="editForm.typeId" placeholder="请选择轮播图类型" >
              <Option v-for="(option, index) in typeData" :value="option.id" :key="index">{{option.name}}</Option>
            </Select>
          </FormItem>
        </Card>
      </Form>
      <!--自定义页脚-->
      <div slot="footer">
        <Button type="text" @click="cancelEditModal">取消</Button>
        <Button type="primary" @click="doSliderEdit">确认</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
  import {
    findSliderData,
    doSliderAdd,
    doSliderEdit,
    doSliderDel,
    doSliderDelMany
  } from "@/libs/api/slider";
  import {findSliderTypeDataAll} from "@/libs/api/slider";
  import {sliderRules} from "@/libs/check";
  import ImgUpload from '../components/img-upload/img-upload'
  export default {
    name: "slider-list",
    components:{
      ImgUpload
    },
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
            title: '图片名称',
            align: 'center',
            key: 'name'
          },
          {
            title: '所属类型',
            align: 'center',
            key: 'typeName'
          },
          {
            title: '头像',
            align: 'center',
            key: 'url',
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
                  src: params.row['url']
                    ? params.row['url'] + '?imageView2/1/w/45/h/45'
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
                        content: `<p>删除数据: ${params.row.name} 后无法恢复,确认删除?</p>`,
                        okText: '确认',
                        onOk: () => {
                          let id = {id: params.row.id}
                          this.doSliderDel(id)
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
        sliderData:[],
        typeData:[],
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
      this.rules = sliderRules
      this.findSliderTypeDataAll()
    },
    mounted(){
      this.findSliderData()
    },
    methods:{
      // 获取列表数据
      async findSliderData(params) {
        let res = await findSliderData(params)
        if (res.code === 200) {
          this.sliderData = res.data.list
          this.page = {
            total: res.data.total,
            currentPage: res.data.pageNum
          }
        } else {
          this.$Message.error(res.data)
        }
      },
      // 获取轮播图类型数据
      async findSliderTypeDataAll(params) {
        let res = await findSliderTypeDataAll(params)
        if (res.code === 200) {
          this.typeData = res.data
        } else {
          this.$Message.error(res.data)
        }
      },
      //添加轮播图
      async doSliderAdd(){
        this.$refs.addForm.validate(async (valid) => { // 表单校验
          if (valid) { // 表单验证成功
            let form = this.addForm
            let res = await doSliderAdd(form)
            if (res.code === 200) { // 添加成功
              this.$Message.success('添加成功')
              this.findSliderData(this.searchOption)
              this.cancelAddModal()
            } else { // 添加失败
              this.$Message.error(res.data)
            }
          } else {
            this.$Message.error('请正确填写表单')
          }
        })
      },
      //编辑轮播图
      async doSliderEdit(){
        this.$refs.editForm.validate(async (valid) => { // 表单校验
          if (valid) { // 校验成功
            let form = this.editForm
            let data = {}
            if (this.formCopy.name !== form.name) data.name = form.name
            if (this.formCopy.typeId  !== form.typeId ) data.typeId  = form.typeId
            if (this.formCopy.url  !== form.url ) data.url  = form.url
            if (Object.keys(data).length !== 0) { // 有修改
              data.id = form.id
              let res = await doSliderEdit(form)
              if (res.code === 200) { // 修改成功
                this.$Message.success('修改成功')
                this.findSliderData(this.searchOption)
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
      // 删除轮播图
      async doSliderDel(params) {
        let res = await doSliderDel(params)
        if (res.code === 200) {
          this.$Message.success('删除成功')
          this.findSliderData(this.searchOption)
        } else {
          this.$Message.error(res.message)
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
              let res = await doSliderDelMany(this.delId)
              if (res.code === 200) {
                this.$Message.success('删除成功')
                this.delId.ids = ''
                this.findSliderData(this.searchOption)
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
        this.addForm = {
          imgUrl:''
        }
        this.isAdd = true
      },
      // 添加modal关闭
      cancelAddModal () {
        this.$refs.addForm.resetFields()// 重置表单
        this.addForm = {}
        this.isAdd = false
      },
      // 编辑modal打开
      openEditModal (params) {
        if (params[`url`] && params.url !== '') {
          let list = []
          list.push({
            url: params.url,
            name: '头像',
            status: 'finished'
          })
          this.$refs.imgUploadByEdit.updateImgUrl(list)
        }
        this.editForm = params
        this.isEdit = true
      },
      // 编辑modal关闭
      cancelEditModal(){
        this.$refs.editForm.resetFields()// 重置表单
        this.isEdit = false
      },
      // 页面翻页
      handlePageTurn(page) {
        this.searchOption.page = page
        this.findSliderData(this.searchOption)
      },
      // 获取上传图片url
      getUploadImg (url) {
        // console.log(url)
          this.addForm.url = url
          this.editForm.url = url
      },
      //根据类型名称查询
      handleSearchByType(e) {
        if (e) { // 判断搜索条件是否为空
          this.searchOption.typeId = e
        } else { // 重置搜索内容
          this.searchOption.typeId = ''
        }
        this.searchOption.page = 1 // 初始化页数
        this.findSliderData(this.searchOption)
      },
    }
  }
</script>

<style scoped>

</style>
