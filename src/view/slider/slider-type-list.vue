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
        <!--<Col span="3" offset="15">-->
          <!--<Input clearable icon="search"-->
                 <!--placeholder="输入类型名搜索"/>-->
        <!--</Col>-->
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

    <!--添加Modal-->
    <Modal v-model="isAdd" @on-cancel="cancelAddModal" title="录播图添加：" width="600">
      <Form :model="addForm" ref="addForm" :rules="rules" :label-width="90">
        <Card>
          <FormItem label="类型名：" prop="name">
            <Input v-model="addForm.name" placeholder="请填写类型名"/>
          </FormItem>
        </Card>
      </Form>
      <!--自定义页脚-->
      <div slot="footer">
        <Button type="text" @click="cancelAddModal">取消</Button>
        <Button type="primary" @click="doSliderTypeAdd">确认</Button>
      </div>
    </Modal>

    <!--编辑Modal-->
    <Modal v-model="isEdit" @on-cancel="cancelEditModal" title="录播图编辑：" width="600">
      <Form :model="editForm" ref="editForm" :rules="rules" :label-width="90">
        <Card>
          <FormItem label="类型名：" prop="name">
            <Input v-model="editForm.name" placeholder="请填写类型名"/>
          </FormItem>
        </Card>
      </Form>
      <!--自定义页脚-->
      <div slot="footer">
        <Button type="text" @click="cancelEditModal">取消</Button>
        <Button type="primary" @click="doSliderTypeEdit">确认</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
  import {
    findSliderTypeData,
    doSliderTypeAdd,
    doSliderTypeEdit,
    doSliderTypeDel,
    doSliderTypeDelMany
  } from "@/libs/api/slider";
  import {sliderRules} from "@/libs/check";

  export default {
    name: "slider-type-list",
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
            title: '类型名称',
            align: 'center',
            key: 'name'
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
                          this.doSliderTypeDel(id)
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
    },
    mounted(){
      this.findSliderTypeData()
    },
    methods:{
      // 获取列表数据
      async findSliderTypeData(params) {
        let res = await findSliderTypeData(params)
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
      //添加标签
      async doSliderTypeAdd(){
        this.$refs.addForm.validate(async (valid) => { // 表单校验
          if (valid) { // 表单验证成功
            let form = this.addForm
            let res = await doSliderTypeAdd(form)
            if (res.code === 200) { // 添加成功
              this.$Message.success('添加成功')
              this.findSliderTypeData(this.searchOption)
              this.cancelAddModal()
            } else { // 添加失败
              this.$Message.error(res.data)
            }
          } else {
            this.$Message.error('请正确填写表单')
          }
        })
      },
      //标签标签
      async doSliderTypeEdit(){
        this.$refs.editForm.validate(async (valid) => { // 表单校验
          if (valid) { // 校验成功
            let form = this.editForm
            let data = {}
            if (this.formCopy.name !== form.name) data.name = form.name
            if (Object.keys(data).length !== 0) { // 有修改
              data.id = form.id
              let res = await doSliderTypeEdit(form)
              if (res.code === 200) { // 修改成功
                this.$Message.success('修改成功')
                this.findSliderTypeData(this.searchOption)
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
      // 删除标签
      async doSliderTypeDel(params) {
        let res = await doSliderTypeDel(params)
        if (res.code === 200) {
          this.$Message.success('删除成功')
          this.findSliderTypeData(this.searchOption)
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
              let res = await doSliderTypeDelMany(this.delId)
              if (res.code === 200) {
                this.$Message.success('删除成功')
                this.delId.ids = ''
                this.findSliderTypeData(this.searchOption)
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
        if (params[`imgUrl`] && params.imgUrl !== '') {
          let list = []
          let array = params.imgUrl.split(',')
          array.forEach(v=>{
            list.push({
              url: v,
              name: '图片',
              status: 'finished'
            })
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
        this.findSliderTypeData(this.searchOption)
      },
    }
  }
</script>

<style scoped>

</style>
