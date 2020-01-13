<template>
  <div>
    <!--按钮部分-->
    <Card>
      <p slot="title">消息列表</p>
      <Row>
        <Col span="6">
          <Button type="primary" style="width: 30%" @click="openAddModal">添加</Button>
          <Button type="error" style="width: 30%;margin-left: 3%" @click="batchDel">批量删除</Button>
          <!--<div style="width: 100px"  v-if="!viewAccessByUserAdd || !viewAccessByUserDelMany">&nbsp;</div>-->
        </Col>
        <Col span="3" offset="15">
          <Input clearable icon="search"
                 placeholder="输入类型名搜索"/>
        </Col>
      </Row>
    </Card>

    <!--表格部分-->
    <Card>
      <div>
        <Table :columns="columnsList" :data="msgData" border @on-selection-change="batchSelect"
               disabled-hover></Table>
      </div>
      <div style="margin: 10px;overflow: hidden">
        <div style="float: right;">
          <Page show-total show-elevator :total="page.total" :current="page.currentPage"
                @on-change="handlePageTurn"></Page>
        </div>
      </div>
    </Card>


    <!--添加modal-->
    <Modal v-model="isAdd" @on-cancel="cancelAddModal" title="添加消息：" width="640">
      <Form :model="addForm" ref="addForm" :rules="rules" :label-width="100">
        <Card>
          <FormItem label="消息内容：" prop="message">
            <Input clearable v-model="addForm.message" placeholder="消息内容"/>
          </FormItem>
          <FormItem label="消息类型：" prop="typeCas">
            <Cascader :data="typeCas" change-on-select v-model="addForm.typeCas" placeholder="请选择消息类型"></Cascader>
          </FormItem>
          <FormItem label="接收人：" prop="receiverIds" v-if="isPush">
            <Input clearable v-model="addForm.receiverIds" placeholder="消息内容"/>
            <!--<Select placeholder="根据企业搜索接收人" clearable filterable remote @on-change="handleSearchByEnterpriseName"-->
                    <!--:remote-method="getEntList" v-model="addForm.enterpriseId">-->
              <!--<Option v-for="item in entDataList" :value="item.id+'|'+item.name" :key="item.id">{{item.name}}</Option>-->
            <!--</Select>-->
            <!--&lt;!&ndash;添加并推送消息，可选多人&ndash;&gt;-->
            <!--<Select v-if="isUser&&isPush" v-model="addForm.receiverIds" multiple placeholder="选择接收人"-->
                    <!--style="margin-top: 20px">-->
              <!--<Option v-for="(item,index) in userListDate" :value="item.id.toString()" :key="index">{{item.name}}-->
              <!--</Option>-->
            <!--</Select>-->
          </FormItem>
          <FormItem label="接收人：" prop="receiverId" v-else>
            <!--<Select placeholder="根据企业搜索接收人" clearable filterable remote @on-change="handleSearchByEnterpriseName"-->
                    <!--:remote-method="getEntList" v-model="addForm.enterpriseId">-->
              <!--<Option v-for="item in entDataList" :value="item.id+'|'+item.name" :key="item.id">{{item.name}}</Option>-->
            <!--</Select>-->
            <!--&lt;!&ndash;添加消息&ndash;&gt;-->
            <!--<Select v-if="!isPush&&isUser" v-model="addForm.receiverId" placeholder="选择接收人"-->
                    <!--style="margin-top: 20px">-->
              <!--<Option v-for="(item,index) in userListDate" :value="item.id.toString()" :key="index">{{item.name}}-->
              <!--</Option>-->
            <!--</Select>-->
          </FormItem>
          <FormItem label="发送人：" prop="senderId">
            <Input disabled v-model="addForm.senderName" placeholder="发送人" :value="addForm.senderId"/>
          </FormItem>
          <FormItem v-if="!isPush" label="接收状态：" prop="flag">
            <Select v-model="addForm.flag" placeholder="接收状态">
              <Option value="0" key="0">未接收</Option>
              <Option value="1" key="1">已接收</Option>
            </Select>
          </FormItem>
        </Card>
      </Form>
      <!--自定义页脚-->
      <div slot="footer">
        <Button type="text" @click="cancelAddModal">取消</Button>
        <!--<Button v-if="isPush" type="primary" @click="pushConfirm">确认</Button>-->
        <!--<Button v-else type="primary" @click="doMsgAdd">确认</Button>-->
      </div>
    </Modal>
  </div>
</template>

<script>
  export default {
    name: "message-list",
    data() {
      return {
        isAdd: false,
        isEdit: false,
        isPush:false,
        columnsList: [
          {
            type: 'selection',
            width: 60,
            align: 'center'
          },
          {
            title: '消息ID',
            align: 'center',
            key: 'id'
          },
          {
            title: '消息内容',
            align: 'center',
            key: 'message'
          },
          {
            title: '消息类型',
            align: 'center',
            key: 'typeId'
          },
          {
            title: '接收人',
            align: 'center',
            key: 'receiverName'
          },
          {
            title: '发送人',
            align: 'center',
            key: 'senderName'
          },
          {
            title: '发送时间',
            align: 'center',
            key: 'addTime'
          },
          {
            title: '接收状态',
            align: 'center',
            // key: 'flag',
            render: (h, params) => {
              let flag = params.row.flag
              if (flag === 0) {
                flag = '未接收'
              } else if (flag === 1) {
                flag = '已接收'
              }
              return h('span', [flag])
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
                          this.doMsgDel(id)
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
        msgData: [
          {
            name: 'test'
          }
        ],
        addForm: {},
        editForm: {},
        typeCas:[],
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
      }
    },
    methods: {
      // 获取列表数据
      async findMsgData(params) {
        // let res = await findUserData(params)
        // if (res.code === 200) {
        //   this.labelData = res.data.list
        //   this.page = {
        //     total: res.data.total,
        //     currentPage: res.data.pageNum
        //   }
        // } else {
        //   this.$Message.error(res.message)
        // }
      },
      //添加消息
      async doMsgAdd() {
        this.$refs.addForm.validate(async (valid) => { // 表单校验
          if (valid) { // 表单验证成功
            let form = this.addForm

          } else {
            this.$Message.error('请正确填写表单')
          }
        })
      },
      //编辑消息
      async doMsgEdit() {
        this.$refs.editForm.validate(async (valid) => { // 表单校验
          if (valid) { // 校验成功
            let form = this.editForm
            let data = {}
            if (this.formCopy.name !== form.name) data.name = form.name
            if (Object.keys(data).length !== 0) { // 有修改
              // data.id = form.id

            } else {
              this.$Message.warning('没有改动')
            }
          } else {
            this.$Message.error('请正确填写表单')
          }
        })
      },
      // 删除消息
      async doMsgDel(params) {
        // let res = await doUserDel(params)
        // if (res.code === 200) {
        //   this.$Message.success('删除成功')
        //   this.findMsgData(this.searchOption)
        // } else {
        //   this.$Message.error(res.message)
        // }
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
              // let res = await doUserDelMany(this.delId)
              // if (res.code === 200) {
              //   this.$Message.success('删除成功')
              //   this.delId.ids = ''
              //   this.findOrderData(this.searchOption)
              // } else {
              //   this.$Message.error(res.message)
              // }
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
        this.findMsgData(this.searchOption)
      },
    }
  }
</script>

<style scoped>

</style>
