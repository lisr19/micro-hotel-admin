<template>
  <div>
    <Modal v-model="isShow" @on-cancel="cancelModal" :title="'('+hotelData.name+')房型'" width="1200">
      <!--按钮部分-->
      <Card>
        <p slot="title">房型列表</p>
        <Row>
          <Col span="6">
            <Button type="primary" style="width: 30%" @click="openAddModal">添加</Button>
            <Button type="error" style="width: 30%;margin-left: 3%" @click="batchDel">批量删除</Button>
            <!--<div style="width: 100px"  v-if="!viewAccessByUserAdd || !viewAccessByUserDelMany">&nbsp;</div>-->
          </Col>
          <Col span="3" offset="15">
            <Select clearable placeholder="请选择房型状态" @on-change="handleSearchByStatus">
              <Option value="0">无效</Option>
              <Option value="1">有效</Option>
            </Select>
          </Col>
        </Row>
      </Card>

      <!--表格部分-->
      <Card>
        <div>
          <Table :columns="columnsList" :data="roomData" border @on-selection-change="batchSelect"
                 disabled-hover></Table>
        </div>
        <div style="margin: 10px;overflow: hidden">
          <div style="float: right;">
            <Page show-total show-elevator :total="page.total" :current="page.currentPage"
                  @on-change="handlePageTurn"></Page>
          </div>
        </div>
      </Card>
      <!--自定义页脚-->
      <div slot="footer"></div>
    </Modal>

    <!--添加房型Modal-->
    <Modal v-model="isAdd" @on-cancel="cancelAddModal" title="房型添加：" width="600">
      <Form :model="addForm" ref="addForm" :rules="rules" :label-width="130">
        <Card>
          <FormItem label="轮播图：" prop="imgUrl">
            <img-upload-more ref="imgUpload" @imgUpload="getUploadImg" @delImg="delUploadImg"></img-upload-more>
          </FormItem>
          <FormItem label="房型：" prop="roomType">
            <Input clearable v-model="addForm.roomType" placeholder="请填写房型"/>
          </FormItem>
          <FormItem label="所属类型：" prop="flag">
            <RadioGroup v-model="addForm.flag" >
              <Radio label="1" disabled>
                <span>酒店</span>
              </Radio>
              <Radio label="2" disabled>
                <span>民宿</span>
              </Radio>
            </RadioGroup>
          </FormItem>
          <FormItem label="关联酒店：" prop="hotelName" v-if="addForm.flag === '1'">
            <Input disabled v-model="addForm.hotelName" placeholder="请输入酒店名称"/>
          </FormItem>
          <FormItem label="关联民宿：" prop="hotelName" v-if="addForm.flag === '2'">
            <Input disabled v-model="addForm.hotelName" placeholder="请输入民宿名称"/>
          </FormItem>
          <FormItem label="楼层：" prop="floor">
            <Input clearable v-model="addForm.floor" placeholder="请填写所在楼层"/>
          </FormItem>
          <FormItem label="面积：" prop="square">
            <Input clearable v-model="addForm.square" placeholder="请填写房型面积">
            <span slot="append">平米</span>
            </Input>
          </FormItem>
          <FormItem label="床大小：" prop="bedScale">
            <Input type="textarea" :rows="3" v-model="addForm.bedScale" placeholder="请填写床大小"/>
          </FormItem>
          <FormItem label="可容纳成人数：" prop="availableAdult">
            <Input clearable v-model="addForm.availableAdult" placeholder="请填写可容纳成人数"/>
          </FormItem>
          <FormItem label="可容纳儿童数：" prop="availableChild">
            <Input clearable v-model="addForm.availableChild" placeholder="请填写可容纳儿童数"/>
          </FormItem>
          <FormItem label="总房间数：" prop="roomCount">
            <Input clearable v-model="addForm.roomCount" placeholder="请填写总房间数"/>
          </FormItem>
          <FormItem label="可用房间数：" prop="count">
            <Input clearable v-model="addForm.count" placeholder="请填写可用房间数"/>
          </FormItem>
          <FormItem label="APP可取消价格：" prop="cancelPrice">
            <Input v-model="addForm.cancelPrice" placeholder="请填写价格">
            <span slot="append">元/晚</span>
            </Input>
          </FormItem>
          <FormItem label="APP不可取消价格：" prop="price">
            <Input v-model="addForm.price" placeholder="请填写价格" >
            <span slot="append">元/晚</span>
            </Input>
          </FormItem>
          <FormItem label="其他信息：" prop="otherInfo">
            <Input type="textarea" :rows="3" v-model="addForm.otherInfo" placeholder="请填写其他信息"/>
          </FormItem>
        </Card>
      </Form>
      <!--自定义页脚-->
      <div slot="footer">
        <Button type="text" @click="cancelAddModal">取消</Button>
        <Button type="primary" @click="doRoomAdd">确认</Button>
      </div>
    </Modal>
    <!--编辑房型Modal-->
    <Modal v-model="isEdit" @on-cancel="cancelEditModal" title="房型编辑：" width="600">
      <Form :model="editForm" ref="editForm" :rules="rules" :label-width="130">
        <Card>
          <FormItem label="轮播图：" prop="imgUrl">
            <img-upload-more ref="imgUploadByEdit" @imgUpload="getUploadImg" @delImg="delUploadImg"></img-upload-more>
          </FormItem>
          <FormItem label="房型：" prop="roomType">
            <Input clearable v-model="editForm.roomType" placeholder="请填写房型"/>
          </FormItem>
          <FormItem label="所属类型：" prop="flag">
            <RadioGroup v-model="editForm.flag">
              <Radio label="1" disabled>
                <span>酒店</span>
              </Radio>
              <Radio label="2" disabled>
                <span>民宿</span>
              </Radio>
            </RadioGroup>
          </FormItem>
          <FormItem label="关联酒店：" prop="hotelName" v-if="editForm.flag === '1'">
            <Input disabled v-model="editForm.hotelName" placeholder="请输入酒店名称"/>
          </FormItem>
          <FormItem label="关联民宿：" prop="hotelName" v-if="editForm.flag === '2'">
            <Input disabled v-model="editForm.hotelName" placeholder="请输入民宿名称"/>
          </FormItem>
          <FormItem label="楼层：" prop="floor">
            <Input clearable v-model="editForm.floor" placeholder="请填写所在楼层"/>
          </FormItem>
          <FormItem label="面积：" prop="square">
            <Input clearable v-model="editForm.square" placeholder="请填写房型面积">
            <span slot="append">平米</span>
            </Input>
          </FormItem>
          <FormItem label="床大小：" prop="bedScale">
            <Input type="textarea" :rows="3" v-model="editForm.bedScale" placeholder="请填写床大小"/>
          </FormItem>
          <FormItem label="可容纳成人数：" prop="availableAdult">
            <Input clearable v-model="editForm.availableAdult" placeholder="请填写可容纳成人数"/>
          </FormItem>
          <FormItem label="可容纳儿童数：" prop="availableChild">
            <Input clearable v-model="editForm.availableChild" placeholder="请填写可容纳儿童数"/>
          </FormItem>
          <FormItem label="总房间数：" prop="roomCount">
            <Input clearable v-model="editForm.roomCount" placeholder="请填写总房间数"/>
          </FormItem>
          <FormItem label="可用房间数：" prop="count">
            <Input clearable v-model="editForm.count" placeholder="请填写可用房间数"/>
          </FormItem>
          <FormItem label="APP可取消价格：" prop="cancelPrice">
            <Input v-model="editForm.cancelPrice" placeholder="请填写价格">
            <span slot="append">元/晚</span>
            </Input>
          </FormItem>
          <FormItem label="APP不可取消价格：" prop="price">
            <Input v-model="editForm.price" placeholder="请填写价格" >
            <span slot="append">元/晚</span>
            </Input>
          </FormItem>
          <FormItem label="其他信息：" prop="otherInfo">
            <Input type="textarea" :rows="3" v-model="editForm.otherInfo" placeholder="请填写其他信息"/>
          </FormItem>
        </Card>
      </Form>
      <!--自定义页脚-->
      <div slot="footer">
        <Button type="text" @click="cancelEditModal">取消</Button>
        <Button type="primary" @click="doRoomEdit">确认</Button>
      </div>
    </Modal>

    <!--标签变更Modal-->
    <Modal v-model="isLabelChange" @on-cancel="cancelLabelChangeModal" title="标签变更：" width="600">
      <Card>
        <p slot="title">标签添加：</p>
        <Row>
          <Col span="12">
            <Cascader :data="labelData" ref="labelForm" v-model="labelForm.labelCas"></Cascader>
          </Col>
          <Col span="4" offset="1">
            <Button type="primary" @click="doLabelAdd">添加</Button>
          </Col>
        </Row>
      </Card>
      <Card>
        <p slot="title">已有标签</p>
        <Tag type="border" closable color="default" v-for="(item,index) in labelArray" :key="item.labelId"
             :name="item.labelContent" @on-close="doLabelDel(item.id,index)">{{item.labelContent}}
        </Tag>
      </Card>
      <!--自定义页脚-->
      <div slot="footer">
        <Button type="text" @click="cancelLabelChangeModal">取消</Button>
      </div>
    </Modal>

    <facilities-room ref="facRoom" :flag="roomFlag"></facilities-room>
  </div>
</template>

<script>
  import {
    findRoomData,
    doRoomAdd,
    doRoomEdit,
    doRoomDel,
    doRoomDelMany
  } from "@/libs/api/room";
  import {
    findLabelAllData,
    findLabelRelData,
    doLabelRelAdd,
    doLabelRelDel
  } from "@/libs/api/label";
  import {roomRules} from "@/libs/check";
  import {array2tree} from '@/libs/tools'
  import ImgUploadMore from '../components/img-upload/img-upload-more'
  import facilitiesRoom from '../facilities/facilities-room'

  export default {
    name: "room",
    components: {
      ImgUploadMore,
      facilitiesRoom
    },
    props:{
      flag:{
        type:String,
        default:''
      }
    },
    data() {
      // 校验
      const validateCountCheck = (rule, value, callback) => {
        if(this.addForm.roomCount !== '' && this.addForm.roomCount != null){
          if (value > this.addForm.roomCount) {
            callback(new Error('可用房间数不能大于总房间数'))
          }
        }else{
          callback()
        }
        if(this.editForm.roomCount !== '' && this.editForm.roomCount != null){
          if (value > this.editForm.roomCount) {
            callback(new Error('可用房间数不能大于总房间数'))
          }
        }else{
          callback()
        }
      };
      return {
        isAdd: false,
        isEdit: false,
        isShow:false,
        isLabelChange: false,
        roomFlag:'1',
        columnsList: [
          {
            type: 'selection',
            width: 60,
            align: 'center'
          },
          {
            title: '房型',
            align: 'center',
            key: 'roomType'
          },
          {
            title: '房数(可用/总数)',
            align: 'center',
            key: 'count',
            render: (h, params) => {
              let str = params.row.count+' / '+params.row.roomCount
              return h('span', [str])
            }
          },
          {
            title: '所在楼层',
            align: 'center',
            key: 'floor'
          },
          {
            title: '容纳人数（成人）',
            align: 'center',
            key: 'availableAdult'
          },
          {
            title: '容纳人数（儿童）',
            align: 'center',
            key: 'availableChild'
          },
          {
            title: '审核状态',
            align: 'center',
            key: 'status',
            render: (h, params) => {
              return h('i-switch', {
                props: {
                  value: params.row.status === 1 ? true : false,
                },
                on: {
                  "on-change": (v) => {
                    let data = {};
                    data.id = params.row.id;
                    if(v){
                      data.status = 1;
                    }else{
                      data.status = 0;
                    }
                    // console.log('data',data);
                    this.updateStatus(data,params.row._index);
                  }
                }
              })
            }
          },
          {
            title: '操作',
            align: 'center',
            key: 'handle',
            width: 260,
            render: (h, params) => {
              // if (this.viewAccessByUserEdit || this.viewAccessByUserDel) {
              return h('div', [
                // h('Button', {
                //   props: {
                //     type: 'primary'
                //   },
                //   style: {
                //     marginRight: '5px',
                //     // display: this.viewAccessByUserEdit ? 'inline-block' : 'none'
                //   },
                //   on: {
                //     click: () => {
                //       let data = Object.assign({}, params.row)
                //       this.openLabelChangeModal(data)
                //     }
                //   }
                // }, '标签'),
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
                      this.$refs.facRoom.openModal(data)
                    }
                  }
                }, '设施'),
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
                      data.availableAdult = String(data.availableAdult)
                      if(data.availableChild)data.availableChild = String(data.availableChild)
                      data.roomCount = String(data.roomCount)
                      data.count = String(data.count)
                      data.price = String(data.price)
                      data.cancelPrice = String(data.cancelPrice)
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
                        content: `<p>删除数据 后无法恢复,确认删除?</p>`,
                        okText: '确认',
                        onOk: () => {
                          let id = {id: params.row.id}
                          this.doRoomDel(id)
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
        roomData: [],
        hotelData:{},
        labelData: [],
        labelArray:[],
        loading:false,
        loading2:false,
        imgArray:[],
        addForm: {},
        editForm: {},
        labelForm: {},
        rules: {
          count: [ { required: true, message: '可用房间数不能为空', trigger: 'blur' },
            { pattern: /^(0|[1-9][0-9]*)$/, message: '请输入正确格式数字', trigger: 'blur' },
            { validator: validateCountCheck, trigger: 'blur' }]
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
        roomType:'',
      }
    },
    created(){
      this.rules.roomType = roomRules.type
      this.rules.hotelId = roomRules.hotelId
      this.rules.square = roomRules.square
      this.rules.availableAdult = roomRules.availableAdult
      this.rules.availableChild = roomRules.availableChild
      this.rules.roomCount = roomRules.roomCount
      this.rules.price = roomRules.price
      this.rules.cancelPrice = roomRules.cancelPrice
    },
    mounted(){
      this.findLabelAllData()
    },
    methods: {
      // 获取列表数据
      async findRoomData(params) {
        console.log(params)
        let res = await findRoomData(params)
        if (res.code === 200) {
          this.roomData = res.data.list
          this.page = {
            total: res.data.total,
            currentPage: res.data.pageNum
          }
        } else {
          this.$Message.error(res.data)
        }
      },
      //获取标签列表
      async findLabelAllData(){
        let res = await findLabelAllData()
        if (res.code === 200) {
          let array = res.data
          // this.resData = array
          this.labelData = array2tree((v) => {
            v.label = v.content
            v.value = v.id
          }, array)
          // this.labelData.forEach((v) => {
          //   this.labelCas.push(Object.assign({}, v))
          // })
        } else {
          this.$Message.error(res.data)
        }
      },
      //根据id获取标签关系
      async findLabelRelData(params){
        params.size = 20
        let res = await findLabelRelData(params)
        if (res.code === 200) {
          this.labelArray = res.data.list
          console.log('array',this.labelArray)
        } else {
          this.$Message.error(res.data)
        }
      },
      //添加
      async doRoomAdd() {
        this.$refs.addForm.validate(async (valid) => { // 表单校验
          if (valid) { // 表单验证成功
            let form = this.addForm
            for(let i=0;i<this.imgArray.length;i++){
              if(i === 0)form.image1 = this.imgArray[i]
              if(i === 1)form.image2 = this.imgArray[i]
              if(i === 2)form.image3 = this.imgArray[i]
              if(i === 3)form.image4 = this.imgArray[i]
              if(i === 4)form.image5 = this.imgArray[i]
            }
            console.log(form)
            let res = await doRoomAdd(form)
            if (res.code === 200) { // 添加成功
              this.$Message.success('添加成功')
              this.findRoomData(this.searchOption)
              this.cancelAddModal()
            } else { // 添加失败
              this.$Message.error(res.data)
            }
          } else {
            this.$Message.error('请正确填写表单')
          }
        })
      },
      //编辑
      async doRoomEdit() {
        this.$refs.editForm.validate(async (valid) => { // 表单校验
          if (valid) { // 校验成功
            if(this.imgArray.length>0){

              let form = this.editForm
              let data = {}
              for(let i=0;i<this.imgArray.length;i++){
                if(i === 0)form.image1 = this.imgArray[i]
                if(i === 1)form.image2 = this.imgArray[i]
                if(i === 2)form.image3 = this.imgArray[i]
                if(i === 3)form.image4 = this.imgArray[i]
                if(i === 4)form.image5 = this.imgArray[i]
              }
              if (this.formCopy.image1 !== form.image1) data.image1 = form.image1
              if (this.formCopy.image2 !== form.image2) data.image2 = form.image2
              if (this.formCopy.image3 !== form.image3) data.image3 = form.image3
              if (this.formCopy.image4 !== form.image4) data.image4 = form.image4
              if (this.formCopy.image5 !== form.image5) data.image5 = form.image5
              if (this.formCopy.roomType !== form.roomType) data.roomType = form.roomType
              if (this.formCopy.hotelId !== form.hotelId) data.hotelId = form.hotelId
              if (this.formCopy.price !== form.price) data.price = form.price
              if (this.formCopy.cancelPrice !== form.cancelPrice) data.cancelPrice = form.cancelPrice
              if (this.formCopy.floor !== form.floor) data.floor = form.floor
              if (this.formCopy.square !== form.square) data.square = form.square
              if (this.formCopy.bedScale !== form.bedScale) data.bedScale = form.bedScale
              if (this.formCopy.availableAdult !== form.availableAdult) data.availableAdult = form.availableAdult
              if (this.formCopy.availableChild !== form.availableChild) data.availableChild = form.availableChild
              if (this.formCopy.roomCount !== form.roomCount) data.roomCount = form.roomCount
              if (this.formCopy.otherInfo !== form.otherInfo) data.otherInfo = form.otherInfo
              if (this.formCopy.count !== form.count) data.count = form.count
              if (this.formCopy.flag !== form.flag) data.flag = form.flag
              if (Object.keys(data).length !== 0) { // 有修改
                data.id = form.id
                let res = await doRoomEdit(data)
                if (res.code === 200) { // 修改成功
                  this.$Message.success('编辑成功')
                  this.findRoomData(this.searchOption)
                  this.cancelEditModal()
                } else { // 修改失败
                  this.$Message.error(res.data)
                }
              } else {
                this.$Message.warning('没有改动')
              }
            }else{
              this.$Message.error('请上传主图')
            }
          } else {
            this.$Message.error('请正确填写表单')
          }
        })
      },
      //改变数据状态
      async updateStatus(params,index) {
        console.log(params)
        let res = await doRoomEdit(params);
        if(!res.errno){
          this.$Message.success('修改成功');
          this.roomData[index].status = params.status;
        }else{
          this.$Message.error('修改失败');
          this.findRoomData();
        }
      },
      // 删除
      async doRoomDel(params) {
        let res = await doRoomDel(params)
        if (res.code === 200) {
          this.$Message.success('删除成功')
          this.findRoomData(this.searchOption)
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
              let res = await doRoomDelMany(this.delId)
              if (res.code === 200) {
                this.$Message.success('删除成功')
                this.delId.ids = ''
                this.findRoomData(this.searchOption)
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
      //添加标签
      async doLabelAdd() {
        let form = {
          labeledId: this.labelForm.id,
          labelId:this.labelForm.labelCas[this.labelForm.labelCas.length-1],
          type:1
        }
        // console.log(form)
        let res = await doLabelRelAdd(form)
        if (res.code === 200) { // 添加成功
          let params = {
            type:1,
            labeledId:this.labelForm.id
          }
          this.findLabelRelData(params)
          this.$Message.success('添加成功')
        } else { // 添加失败
          this.$Message.error(res.data)
        }
      },
      //删除标签
      async doLabelDel(id,index) {
        let res = await doLabelRelDel({id})
        if (res.code === 200) { // 删除成功
          this.labelArray.splice(index,1)
          this.$Message.success('删除成功')
        } else { // 删除失败
          this.$Message.error(res.data)
        }
      },
      // modal打开
      openModal (data) {
        // console.log(data)
        this.hotelData = data
        this.searchOption.hotelName = data.name
        this.findRoomData(this.searchOption)
        this.isShow = true
      },
      // modal关闭
      cancelModal(){
        this.hotelData = {}
        this.isShow = false
      },
      // 添加modal打开
      openAddModal() {
        this.$refs.imgUpload.updateImgUrl([])
        this.addForm = {
          flag:this.flag,
          hotelId:this.hotelData.id,
          hotelName:this.hotelData.name
        }
        // console.log(this.addForm)
        this.isAdd = true
      },
      // 添加modal关闭
      cancelAddModal() {
        this.$refs.addForm.resetFields()// 重置表单
        this.addForm = {}
        this.imgArray=[]
        this.isAdd = false
      },
      // 编辑modal打开
      openEditModal(params) {
        // console.log(params)
        let list = []
        if(params.image1 !== null && params.image1 !== ''){
          list.push({
            url: params.image1,
            name: '图片',
            status: 'finished'
          })
          this.imgArray.push(params.image1)
        }
        if(params.image2 !== null && params.image2 !== ''){
          list.push({
            url: params.image2,
            name: '图片',
            status: 'finished'
          })
          this.imgArray.push(params.image2)
        }
        if(params.image3 !== null && params.image3 !== ''){
          list.push({
            url: params.image3,
            name: '图片',
            status: 'finished'
          })
          this.imgArray.push(params.image3)
        }
        if(params.image4 !== null && params.image4 !== ''){
          list.push({
            url: params.image4,
            name: '图片',
            status: 'finished'
          })
          this.imgArray.push(params.image4)
        }
        if(params.image5 !== null && params.image5 !== ''){
          list.push({
            url: params.image5,
            name: '图片',
            status: 'finished'
          })
          this.imgArray.push(params.image5)
        }
        this.$refs.imgUploadByEdit.updateImgUrl(list)
        this.editForm = params
        this.isEdit = true
      },
      // 编辑modal关闭
      cancelEditModal() {
        this.$refs.editForm.resetFields()// 重置表单
        this.imgArray=[]
        this.isEdit = false
      },
      // 标签modal打开
      openLabelChangeModal(data) {
        this.labelForm = data
        let params = {
          type:1,
          labeledId:data.id
        }
        this.findLabelRelData(params)
        this.isLabelChange = true
      },
      cancelLabelChangeModal(){
        this.labelForm = {}
        this.labelArray=[]
        this.isLabelChange = false
      },
      // 获取上传图片url
      getUploadImg(url) {
        // console.log(url)
        this.imgArray.push(url)
      },
      // 删除上传图片url
      delUploadImg(index) {
        // console.log(url)
        this.imgArray.splice(index,1)
      },
      // 页面翻页
      handlePageTurn(page) {
        this.searchOption.page = page
        this.findRoomData(this.searchOption)
      },
      //根据房型状态查询
      handleSearchByStatus(e){
        if (e) { // 判断搜索条件是否为空
          this.searchOption.status = e
        } else { // 重置搜索内容
          this.searchOption.status = ''
        }
        this.searchOption.page = 1 // 初始化页数
        this.findRoomData(this.searchOption)
      }
    }
  }
</script>

<style scoped>

</style>
