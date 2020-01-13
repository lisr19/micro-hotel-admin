<template>
  <div>
    <!--按钮部分-->
    <Card>
      <p slot="title">标签列表</p>
      <Row>
        <Col span="6">
          <Button type="primary" style="width: 30%" @click="openAddModal">添加</Button>
          <!--<Button type="error" style="width: 30%;margin-left: 3%" @click="batchDel">批量删除</Button>-->
          <!--<div style="width: 100px"  v-if="!viewAccessByUserAdd || !viewAccessByUserDelMany">&nbsp;</div>-->
        </Col>
        <!--<Col span="3" offset="15">-->
          <!--<Input clearable icon="search"-->
                 <!--placeholder="输入标签名搜索"/>-->
        <!--</Col>-->
      </Row>
    </Card>

    <!--表格部分-->
    <Card>
      <div>
          <Table ref="table" :columns="columnsList" :data="labelData" disabled-hover></Table>
      </div>
    </Card>

    <!--添加标签Modal-->
    <Modal v-model="isAdd" @on-cancel="cancelAddModal" title="功能添加：" width="640">
      <Form :model="addForm" ref="addForm" :rules="rules" :label-width="100">
        <Card>
          <FormItem label="标签名：" prop="content">
            <Input clearable v-model="addForm.content" placeholder="请输入标签名"/>
          </FormItem>
          <FormItem label="父级标签：">
            <Cascader :data="labelCas" change-on-select v-model="addForm.labelCas"
                      placeholder="选择标签的父级标签"></Cascader>
          </FormItem>
          <FormItem label="标签说明：" prop="comment">
            <Input type="textarea" :rows="3"  v-model="addForm.comment" placeholder="请输入标签说明"/>
          </FormItem>
        </Card>
      </Form>
      <!--自定义页脚-->
      <div slot="footer">
        <Button type="text" @click="cancelAddModal">取消</Button>
        <Button type="primary" @click="doLabelAdd">确认</Button>
      </div>
    </Modal>

    <!--编辑标签Modal-->
    <Modal v-model="isEdit" @on-cancel="cancelEditModal" title="功能添加：" width="640">
      <Form :model="editForm" ref="editForm" :rules="rules" :label-width="100">
        <Card>
          <FormItem label="标签名：" prop="content">
            <Input clearable v-model="editForm.content" placeholder="请输入标签名"/>
          </FormItem>
          <FormItem label="父级标签：">
            <Cascader :data="labelCas" change-on-select v-model="editForm.labelCas"
                      placeholder="选择标签的父级标签"></Cascader>
          </FormItem>
          <FormItem label="标签说明：" prop="comment">
            <Input type="textarea" :rows="3"  v-model="editForm.comment" placeholder="请输入标签说明"/>
          </FormItem>
        </Card>
      </Form>
      <!--自定义页脚-->
      <div slot="footer">
        <Button type="text" @click="cancelEditModal">取消</Button>
        <Button type="primary" @click="doLabelEdit">确认</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
  import {
    findLabelAllData,
    doLabelAdd,
    doLabelEdit,
    doLabelDel,
    doLabelDelMany
  } from "@/libs/api/label";
  import {labelRules} from "@/libs/check";
  import {array2tree} from '@/libs/tools'

  export default {
    name: "label-list",
    data() {
      return {
        isAdd:false,
        isEdit:false,
        columnsList:[
          {
            title: '标签名',
            key: 'content',
            render: (h, params) => {
              if (params.row.children && params.row.children.length > 0) { // 若有子类
                return h('div', [
                  h('span', {
                    style: {
                      marginLeft: (params.row.level - 1) * 40 + 'px'
                    },
                    on: {
                      click: () => {
                        // console.log(params)
                        this.controlTree(params)
                      }
                    }
                  }, [
                    h('span', params.row.content + ''),
                    h('icon', {
                      props: {
                        size: 14,
                        type: params.row.expanded ? 'md-arrow-dropdown' : 'md-arrow-dropright'// 根据展开状态的不同显示图标
                      },
                      style: {
                        marginLeft: '10px'
                      }
                    })
                  ])
                ])
              } else { // 若无子类
                return h('div', {
                  style: {
                    marginLeft: (params.row.level - 1) * 40 + 'px'
                  }
                }, params.row.content)
              }
            }
          },
          {
            title: '层级',
            align:'center',
            key: 'level'
          },
          {
            title: '标签说明',
            align:'center',
            key: 'comment'
          },
          {
            title: '操作',
            key: 'handle',
            align:'center',
            width: 200,
            render: (h, params) => {
              // if (this.viewAccessByFunctionEdit || this.viewAccessByFunctionDel) {
                return h('div', [
                  h('Button', {
                    props: {
                      type: 'primary'
                    },
                    style: {
                      marginRight: '5px',
                      // display: this.viewAccessByFunctionEdit ? 'inline-block' : 'none'
                    },
                    on: {
                      click: () => {
                        this.openEditModal(params.row)
                      }
                    }
                  }, '编辑'),
                  h('Button', {
                    props: {
                      type: 'error'
                    },
                    style: {
                      // display: this.viewAccessByFunctionDel ? 'inline-block' : 'none'
                    },
                    on: {
                      click: () => {
                        this.$Modal.confirm({ // 打开确认对话框
                          title: '请确认删除',
                          content: `<p>删除数据(及其子类)后无法恢复,确认删除?</p>`,
                          okText: '确认',
                          // 确认删除
                          onOk: () => {
                            let data = params.row
                            this.doLabelDel(data)
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
              // } else {
              //   return h('span', '您没有操作该表的权限')
              // }
            }
          }
        ],
        labelData:[],
        labelCas:[],
        resData: [], // 原始数据数组
        addForm:{},
        editForm:{},
        rules:{},
        expanded: {}, // 列表树展开状态存储对象
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
      this.rules = labelRules
    },
    mounted(){
      this.findLabelAllData()
    },
    methods:{
      // 获取列表数据
      async findLabelAllData(params) {
        this.labelCas = [{content: '无', id: '0', pid: '0', label: '无', value: '0'}]
        let res = await findLabelAllData(params)
        if (res.code === 200) {
          let array = res.data
          this.resData = array
          this.labelData = array2tree((v) => {
            v.label = v.content
            v.value = v.id
          }, array)
          this.labelData.forEach((v) => {
            this.labelCas.push(Object.assign({}, v))
          })
          // console.log(res.data)
        } else {
          this.$Message.error(res.data)
        }
      },
      //添加标签
      async doLabelAdd(){
        this.$refs.addForm.validate(async (valid) => { // 表单校验
          if (valid) { // 表单验证成功
            let form = this.addForm
            // console.log(form)
            form.pid = form.labelCas[form.labelCas.length-1]
            if(form.pid !== '0'){
              form.level = form.labelCas.length
            }else{
              form.level = 0
            }
            let res = await doLabelAdd(form)
            if (res.code === 200) { // 添加成功
              this.$Message.success('添加成功')
              this.findLabelAllData()
              this.cancelAddModal()
            } else { // 添加失败
              this.$Message.error(res.data)
            }
          } else {
            this.$Message.error('请正确填写表单')
          }
        })
      },
      //编辑标签
      async doLabelEdit(){
        this.$refs.editForm.validate(async (valid) => { // 表单校验
          if (valid) { // 校验成功
            let form = this.editForm
            let data = {}
            form.pid = form.labelCas[form.labelCas.length-1]
            if(form.pid !== '0'){
              form.level = form.labelCas.length
            }else{
              form.level = 0
            }
            if (this.formCopy.content !== form.content) data.content = form.content
            if (this.formCopy.comment !== form.comment) data.comment = form.comment
            if (this.formCopy.level !== form.level) data.level = form.level
            if (this.formCopy.pid !== form.pid) data.pid = form.pid
            if (Object.keys(data).length !== 0) { // 有修改
              data.id = form.id
              let res = await doLabelEdit(data)
              if (res.code === 200) { // 修改成功
                this.$Message.success('编辑成功')
                this.findLabelAllData()
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
      async doLabelDel(data) {
        if (data[`children`]) { // 若是该数据有子类
          let ids = ''
          ids = data.id
          let idArray = []
          this.toolsForDel(data.children, idArray)
          ids = ids + ',' + idArray.join(',')
          console.log(ids)
          let res = await doLabelDelMany({ ids: ids })
          if (res.code === 200) {
            this.$Message.success('删除成功')
            this.findLabelAllData()
          } else {
            this.$Message.error(res.data)
          }
        } else { // 若没有则删除单个
          let id = { id: data.id }
          let res = await doLabelDel(id)
          if (res.code === 200) {
            this.$Message.success('删除成功')
            this.findLabelAllData()
          } else {
            this.$Message.error(res.data)
          }
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
        this.addForm = {}
        this.isAdd = false
      },
      // 编辑modal打开
      openEditModal (params) {
        let data = Object.assign({}, params)
        this.formCopy = Object.assign({}, data)
        let resArray = []
        this.toolsForCas(this.resData, data.id, resArray)
        data.labelCas = resArray
        console.log(data)
        // console.log(data)
        this.editForm = data
        this.isEdit = true
      },
      // 编辑modal关闭
      cancelEditModal(){
        this.$refs.editForm.resetFields()// 重置表单
        this.isEdit = false
      },
      // 递归查询
      toolsForDel (array, idArray) {
        array.forEach(v => {
          idArray.push(v.id)
          if (v[`children`]) this.toolsForDel(v.children, idArray)
        })
      },
      //对于树控制
      controlTree(params){
        if(params.row[`children`]){
          // 将该条功能数据的子类数组赋予临时参数children
          let children = params.row.children
          // 判断该条功能是否处于展开状态
          if (params.row.expanded) { // 已展开
            // 该条数据赋予参数currentRow
            let currentRow = params.row
            // 记录该条数据的子数据位置
            let childrenIndex = params.index + 1
            // 根据功能数组的长度动态删减显示条目
            for (childrenIndex; childrenIndex < this.labelData.length; childrenIndex++) {
              // 若该条数据有子数据则将数据隐藏
              if (currentRow.level < this.labelData[childrenIndex].level) {
                this.labelData.splice(childrenIndex, 1)
                childrenIndex--
              } else {
                break
              }
            }
            // 将该条数据的展开状态调整为未展开
            this.labelData[params.index].expanded = false
          } else { // 若未展开
            // 记录该条数据的位置
            let index = params.index
            // 根据该条功能数据的子类长度动态显示显现条目
            for (let i = 0; i < children.length; i++) {
              index = index + 1
              this.labelData.splice(index, 0, children[i])
            }
            // 将该条数据的展开状态调整为已展开
            this.labelData[params.index].expanded = true
          }
          // 将列表树最终状态中显示的数据id存储在expanded对象中
          this.expanded['e' + params.row.id] = this.labelData[params.index].expanded
        }
      },
      // 编辑页面组装级联数组显示
      toolsForCas(array, id, resArray) {
        array.forEach((v) => {
          if (v.id === id) {
            if (v.pid === '0') {
              if (resArray.length === 0) {
                resArray.unshift(v.pid)
              }
            } else {
              resArray.unshift(v.pid)
              this.toolsForCas(array, v.pid, resArray)
            }
          }
        })
      },
    }
  }
</script>

<style scoped>

</style>
