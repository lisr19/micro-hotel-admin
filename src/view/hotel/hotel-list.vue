<template>
  <div>
    <!--按钮部分-->
    <Card>
      <p slot="title">酒店列表</p>
      <Row>
        <Col span="6">
          <Button type="primary" style="width: 30%" @click="openAddModal">添加</Button>
          <Button type="error" style="width: 30%;margin-left: 3%" @click="batchDel">批量删除</Button>
          <!--<div style="width: 100px"  v-if="!viewAccessByUserAdd || !viewAccessByUserDelMany">&nbsp;</div>-->
        </Col>
        <Col span="3" offset="7">
          <Select clearable placeholder="请选择酒店星级搜索" @on-change="handleSearchByStars" >
            <Option value="1">1星</Option>
            <Option value="2">2星</Option>
            <Option value="3">3星</Option>
            <Option value="4">4星</Option>
            <Option value="5">5星</Option>
          </Select>
        </Col>
        <Col span="3" offset="1">
          <Select clearable placeholder="请选择酒店类型搜索" @on-change="handleSearchByType" >
            <Option value="1">主题酒店</Option>
            <Option value="2">特色酒店</Option>
            <Option value="3">特惠酒店</Option>
          </Select>
        </Col>
        <Col span="3" offset="1">
          <Input clearable icon="search" v-model="searchByName" @on-change="handleSearchByName"
                 placeholder="输入酒店名搜索"/>
        </Col>
      </Row>
    </Card>

    <!--表格部分-->
    <Card>
      <div>
        <Table :columns="columnsList" :data="hotelData" border @on-selection-change="batchSelect"
               disabled-hover></Table>
      </div>
      <div style="margin: 10px;overflow: hidden">
        <div style="float: right;">
          <Page show-total show-elevator :total="page.total" :current="page.currentPage"
                @on-change="handlePageTurn"></Page>
        </div>
      </div>
    </Card>

    <!--添加酒店Modal-->
    <Modal v-model="isAdd" @on-cancel="cancelAddModal" title="酒店添加：" width="1200">
      <Form :model="addForm" ref="addForm" :rules="rules" :label-width="90">
        <Card>
          <Row>
            <Col span="14">
              <a-map v-if="mapShow" :height="height" @getAddressAndPosition="getAddressAndPosition"></a-map>
              <Row style="margin-top: 20px">
                <Col span="10">
                  <FormItem label="经度：" prop="latitude">
                    <Input v-model="addForm.latitude" placeholder="请点击地图"/>
                  </FormItem>
                </Col>
                <Col span="10">
                  <FormItem label="纬度：" prop="longitude">
                    <Input v-model="addForm.longitude" placeholder="请点击地图"/>
                  </FormItem>
                </Col>
              </Row>
            </Col>
            <Col span="10">
              <FormItem label="图片组：">
                <img-upload-more ref="imgUpload" @imgUpload="getUploadImg" @delImg="delUploadImg"></img-upload-more>
              </FormItem>
              <FormItem label="酒店名：" prop="name">
                <Input v-model="addForm.name" placeholder="请填写酒店名"/>
              </FormItem>
              <FormItem label="酒店类型：" prop="kindType">
                <Select v-model="addForm.kindType">
                  <Option value="1">主题酒店</Option>
                  <Option value="2">特色酒店</Option>
                  <Option value="3">特惠酒店</Option>
                </Select>
              </FormItem>
              <FormItem label="星级：" prop="stars">
                <Rate v-model="addForm.stars"/>
              </FormItem>
              <FormItem label="地址：" prop="address">
                <Input type="textarea" :rows="2" v-model="addForm.address" placeholder="请填写地址"/>
              </FormItem>
              <FormItem label="最低价格：" prop="minPrice">
                <Input v-model="addForm.minPrice" placeholder="请填写价格" >
                <span slot="append">元/晚</span>
                </Input>
              </FormItem>
              <FormItem label="联系电话1：" prop="contactPhone1">
                <Input v-model="addForm.contactPhone1" placeholder="请填写联系电话1"/>
              </FormItem>
              <FormItem label="联系电话2：" prop="contactPhone2">
                <Input v-model="addForm.contactPhone2" placeholder="请填写联系电话2"/>
              </FormItem>
              <FormItem label="特色介绍：" prop="kindDescription">
                <Input type="textarea" :rows="5" v-model="addForm.kindDescription" placeholder="请填写特色介绍"/>
              </FormItem>
            </Col>
          </Row>
        </Card>
      </Form>
      <!--自定义页脚-->
      <div slot="footer">
        <Button type="text" @click="cancelAddModal">取消</Button>
        <Button type="primary" @click="doHotelAdd">确认</Button>
      </div>
    </Modal>
    <!--编辑酒店Modal-->
    <Modal v-model="isEdit" @on-cancel="cancelEditModal" title="酒店编辑：" width="1200">
      <Form :model="editForm" ref="editForm" :rules="rules" :label-width="90">
        <Card>
          <Row>
            <Col span="14">
              <a-map ref="mapEdit" :height="height" @getAddressAndPosition="getAddressAndPosition"></a-map>
              <Row style="margin-top: 20px">
                <Col span="10">
                  <FormItem label="经度：" prop="latitude">
                    <Input v-model="editForm.latitude" placeholder="请点击地图"/>
                  </FormItem>
                </Col>
                <Col span="10">
                  <FormItem label="纬度：" prop="longitude">
                    <Input v-model="editForm.longitude" placeholder="请点击地图"/>
                  </FormItem>
                </Col>
              </Row>
            </Col>
            <Col span="10">
              <FormItem label="图片组：" >
                <img-upload-more ref="imgUploadByEdit" @imgUpload="getUploadImg" @delImg="delUploadImg"></img-upload-more>
              </FormItem>
              <FormItem label="酒店名：" prop="name">
                <Input v-model="editForm.name" placeholder="请填写酒店名"/>
              </FormItem>
              <FormItem label="酒店类型：" prop="kindType">
                <Select v-model="editForm.kindType">
                  <Option value="1">主题酒店</Option>
                  <Option value="2">特色酒店</Option>
                  <Option value="3">特惠酒店</Option>
                </Select>
              </FormItem>
              <FormItem label="星级：" prop="stars">
                <Rate v-model="editForm.stars"/>
              </FormItem>
              <FormItem label="地址：" prop="address">
                <Input type="textarea" :rows="2" v-model="editForm.address" placeholder="请填写地址"/>
              </FormItem>
              <FormItem label="最低价格：" prop="minPrice">
                <Input v-model="editForm.minPrice" placeholder="请填写价格" >
                <span slot="append">元/晚</span>
                </Input>
              </FormItem>
              <FormItem label="联系电话1：" prop="contactPhone1">
                <Input v-model="editForm.contactPhone1" placeholder="请填写联系电话1"/>
              </FormItem>
              <FormItem label="联系电话2：" prop="contactPhone2">
                <Input v-model="editForm.contactPhone2" placeholder="请填写联系电话2"/>
              </FormItem>
              <FormItem label="特色介绍：" prop="kindDescription">
                <Input type="textarea" :rows="5" v-model="editForm.kindDescription" placeholder="请填写特色介绍"/>
              </FormItem>
            </Col>
          </Row>
        </Card>
      </Form>
      <!--自定义页脚-->
      <div slot="footer">
        <Button type="text" @click="cancelEditModal">取消</Button>
        <Button type="primary" @click="doHotelEdit">确认</Button>
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
    <room ref="room" :flag="flag"></room>
  </div>
</template>

<script>
  import {
    findHotelData,
    doHotelAdd,
    doHotelDel,
    doHotelEdit,
    doHotelDelMany
  } from "@/libs/api/hotel";
  import {
    findLabelAllData,
    findLabelRelData,
    doLabelRelAdd,
    doLabelRelDel
  } from "@/libs/api/label";
  import {hotelRules} from "@/libs/check";
  import {array2tree} from '@/libs/tools'
  import aMap from '../components/aMap/aMap'
  import ImgUploadMore from '../components/img-upload/img-upload-more'
  import room from '../room/room'

  export default {
    name: "hotel-list",
    components: {
      aMap,
      ImgUploadMore,
      room
    },
    data() {
      return {
        isAdd: false,
        isEdit: false,
        mapShow: false,
        isLabelChange: false,
        flag:'1',//房型标识（酒店）
        height: 600,//地图高度（px）
        columnsList: [
          {
            type: 'selection',
            width: 60,
            align: 'center'
          },
          {
            title: '酒店名',
            align: 'center',
            key: 'name'
          },
          {
            title: '酒店类型',
            align: 'center',
            key: 'kindType',
            render: (h, params) => {
              return h('span', [
                params.row.kindType === 3 ? '特惠酒店' : (params.row.kindType === 1 ? '主题酒店' : '特色酒店')
              ])
            }
          },
          {
            title: '星级',
            align: 'center',
            key: 'stars'
          },
          {
            title: '地址',
            align: 'center',
            key: 'address',
            render: (h, params) => {
              if(params.row.address){
                let texts = '';//表格列显示文字
                if (params.row.address) {
                  if (params.row.address.length > 20) {//进行截取列显示字数
                    texts = params.row.address.substring(0, 20) + ".....";
                  } else {
                    texts = params.row.address;
                  }
                }
                return h('p', [
                  h('Poptip', {
                    props: {
                      trigger:"hover",
                      placement: 'bottom',
                    },
                  }, [//这个中括号表示是Tooltip标签的子标签
                    texts,//表格列显示文字
                    h('p', {
                      slot: 'content',
                      style: {
                        maxWidth:'300px',
                        fontSize:'14px',
                        whiteSpace: 'normal'
                      },
                    }, params.row.address)//整个的信息即气泡内文字
                  ])
                ])
              }else{
                return h('span',[
                  params.row.address === ''? '无':params.row.address
                ])
              }
            }
          },
          {
            title: '联系电话1',
            align: 'center',
            key: 'contactPhone1'
          },
          {
            title: '联系电话2',
            align: 'center',
            key: 'contactPhone2'
          },
          {
            title: '操作',
            align: 'center',
            key: 'handle',
            width: 300,
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
                      this.openLabelChangeModal(data)
                    }
                  }
                }, '标签'),
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
                      this.$refs.room.openModal(data)
                    }
                  }
                }, '房型'),
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
                      data.kindType = String(data.kindType)
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
                          this.doHotelDel(id)
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
        hotelData: [],
        labelData: [],
        labelArray:[],
        imgArray:[],
        addForm: {},
        editForm: {},
        labelForm: {},
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
        searchByName:'',
      }
    },
    created(){
      this.rules={
        name:hotelRules.name,
        kindType:hotelRules.kindType,
        contactPhone1:hotelRules.phone,
        contactPhone2:hotelRules.phone,
        minPrice:hotelRules.price,
        kindDescription:hotelRules.desc
      }
    },
    mounted(){
      this.findLabelAllData()
      this.findHotelData()
    },
    methods: {
      // 获取列表数据
      async findHotelData(params) {
        let res = await findHotelData(params)
        if (res.code === 200) {
          this.hotelData = res.data.list
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
      //添加酒店
      async doHotelAdd() {
        this.$refs.addForm.validate(async (valid) => { // 表单校验
          if (valid) { // 表单验证成功
            if(this.imgArray.length>0){
              let form = this.addForm
              for(let i=0;i<this.imgArray.length;i++){
                if(i === 0)form.image1 = this.imgArray[i]
                if(i === 1)form.image2 = this.imgArray[i]
                if(i === 2)form.image3 = this.imgArray[i]
                if(i === 3)form.image4 = this.imgArray[i]
                if(i === 4)form.image5 = this.imgArray[i]
              }
              console.log(form)
              let res = await doHotelAdd(form)
              if (res.code === 200) { // 添加成功
                this.$Message.success('添加成功')
                this.findHotelData(this.searchOption)
                this.cancelAddModal()
              } else { // 添加失败
                this.$Message.error(res.data)
              }
            }else{
              this.$Message.error('请上传主图')
            }
          } else {
            this.$Message.error('请正确填写表单')
          }
        })
      },
      //编辑酒店
      async doHotelEdit() {
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
              if (this.formCopy.name !== form.name) data.name = form.name
              if (this.formCopy.address !== form.address) data.address = form.address
              if (this.formCopy.image1 !== form.image1) data.image1 = form.image1
              if (this.formCopy.image2 !== form.image2) data.image2 = form.image2
              if (this.formCopy.image3 !== form.image3) data.image3 = form.image3
              if (this.formCopy.image4 !== form.image4) data.image4 = form.image4
              if (this.formCopy.image5 !== form.image5) data.image5 = form.image5
              if (this.formCopy.minPrice !== form.minPrice) data.minPrice = form.minPrice
              if (this.formCopy.kindDescription !== form.kindDescription) data.kindDescription = form.kindDescription
              if (this.formCopy.kindType !== form.kindType) data.kindType = form.kindType
              if (this.formCopy.stars !== form.stars) data.stars = form.stars
              if (this.formCopy.contactPhone1 !== form.contactPhone1) data.contactPhone1 = form.contactPhone1
              if (this.formCopy.contactPhone2 !== form.contactPhone2) data.contactPhone2 = form.contactPhone2
              if (this.formCopy.longitude !== form.longitude) data.longitude = form.longitude
              if (this.formCopy.latitude !== form.latitude) data.latitude = form.latitude
              if (Object.keys(data).length !== 0) { // 有修改
                data.id = form.id
                let res = await doHotelEdit(data)
                if (res.code === 200) { // 修改成功
                  this.$Message.success('编辑成功')
                  this.findHotelData(this.searchOption)
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
      // 删除酒店
      async doHotelDel(params) {
        let res = await doHotelDel(params)
        if (res.code === 200) {
          this.$Message.success('删除成功')
          this.findHotelData(this.searchOption)
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
              let res = await doHotelDelMany(this.delId)
              if (res.code === 200) {
                this.$Message.success('删除成功')
                this.delId.ids = ''
                this.findHotelData(this.searchOption)
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
      //获取地址和坐标
      getAddressAndPosition(data) {
        // console.log('111',data)
        this.$set(this.addForm, 'address', data.address)
        this.$set(this.addForm, 'latitude', data.lat)
        this.$set(this.addForm, 'longitude', data.lng)
        this.$set(this.editForm, 'address', data.address)
        this.$set(this.editForm, 'latitude', data.lat)
        this.$set(this.editForm, 'longitude', data.lng)
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
      //搜索(根据名称)
      handleSearchByName(){
        if (this.searchByName) { // 判断搜索条件是否为空
          this.searchOption.name = this.searchByName
        } else { // 重置搜索内容
          this.searchOption.name = ''
        }
        this.searchOption.page = 1 // 初始化页数
        this.findHotelData(this.searchOption)
      },
      //根据主题
      handleSearchByType(params){
        if (params) { // 判断搜索条件是否为空
          this.searchOption.kindType = params
        } else { // 重置搜索内容
          this.searchOption.kindType = ''
        }
        this.searchOption.page = 1 // 初始化页数
        this.findHotelData(this.searchOption)
      },
      //根据星级
      handleSearchByStars(params){
        if (params) { // 判断搜索条件是否为空
          this.searchOption.stars = params
        } else { // 重置搜索内容
          this.searchOption.stars = ''
        }
        this.searchOption.page = 1 // 初始化页数
        this.findHotelData(this.searchOption)
      },
      // 添加modal打开
      openAddModal() {
        this.$refs.imgUpload.updateImgUrl([])
        this.addForm = {}
        this.isAdd = true
        this.$nextTick(() => (this.mapShow = true))
      },
      // 添加modal关闭
      cancelAddModal() {
        this.$refs.addForm.resetFields()// 重置表单
        this.addForm = {}
        this.imgArray=[]
        this.isAdd = false
        this.mapShow = false
      },
      // 编辑modal打开
      openEditModal(params) {
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
        // console.log(this.imgArray)
        this.$refs.imgUploadByEdit.updateImgUrl(list)
        this.$refs.mapEdit.onSetPosition(params);
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
      cancelLabelChangeModal() {
        this.labelForm = {}
        this.labelArray=[]
        this.isLabelChange = false
      },
      // 页面翻页
      handlePageTurn(page) {
        this.searchOption.page = page
        this.findHotelData(this.searchOption)
      },
    }
  }
</script>

<style scoped>

</style>
