<template>
  <div>
    <!--按钮部分-->
    <Card>
      <p slot="title">权限列表</p>
      <Row>
        <Col span="6">
          <Button type="primary" style="width: 30%" @click="openAddModal">添加</Button>
          <!--<Button type="error" style="width: 30%;margin-left: 3%">批量删除</Button>-->
          <!--<div style="width: 100px" >&nbsp;</div>-->
        </Col>
      </Row>
    </Card>

    <!--表格部分-->
    <Card>
      <div>
        <tree-table expand-key="name" :expand-type="false" :selectable="false" :columns="columnsList"
                    :data="accessData">
          <template slot="handle" slot-scope="data">
            <Button type="primary" style="margin-right: 5px" @click="openEditModal(data.row)">编辑</Button>
            <Button type="error">删除</Button>
          </template>
        </tree-table>
      </div>
    </Card>

    <!--权限添加Modal-->
    <Modal v-model="isAdd" @on-cancel="cancelAddModal" title="权限添加：" width="640">
      <Form :model="accessAddForm" ref="accessAddForm" :rules="rules" :label-width="100">
        <Card>
          <FormItem label="权限名称：" prop="name">
            <Input clearable v-model="accessAddForm.name" placeholder="权限名称"/>
          </FormItem>
          <FormItem label="后端url：" prop="url">
            <Input clearable v-model="accessAddForm.url" placeholder="权限对应后端url"/>
          </FormItem>
          <FormItem label="前端组件：" prop="front">
            <Input clearable v-model="accessAddForm.front" placeholder="权限对应前端组件"/>
          </FormItem>
          <FormItem label="父级权限：">
            <Cascader :data="accessCas" change-on-select v-model="accessAddForm.accessCas"
                      placeholder="权限的父级权限"></Cascader>
          </FormItem>
        </Card>
      </Form>
      <!--自定义页脚-->
      <div slot="footer">
        <Button type="text" @click="cancelAddModal">取消</Button>
        <Button type="primary" @click="doAccessAdd">确认</Button>
      </div>
    </Modal>

    <!--权限编辑Modal-->
    <Modal v-model="isEdit" @on-cancel="cancelEditModal" title="权限添加：" width="640">
      <Form :model="accessEditForm" ref="accessEditForm" :rules="rules" :label-width="100">
        <Card>
          <FormItem label="权限名称：" prop="name">
            <Input clearable v-model="accessEditForm.name" placeholder="权限名称"/>
          </FormItem>
          <FormItem label="后端url：" prop="url">
            <Input clearable v-model="accessEditForm.url" placeholder="权限对应后端url"/>
          </FormItem>
          <FormItem label="前端组件：" prop="front">
            <Input clearable v-model="accessEditForm.front" placeholder="权限对应前端组件"/>
          </FormItem>
          <FormItem label="父级权限：">
            <Cascader :data="accessCas" change-on-select v-model="accessEditForm.accessCas"
                      placeholder="权限的父级权限"></Cascader>
          </FormItem>
        </Card>
      </Form>
      <!--自定义页脚-->
      <div slot="footer">
        <Button type="text" @click="cancelEditModal">取消</Button>
        <Button type="primary" @click="doAccessEdit">确认</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
  export default {
    name: "access-list",
    data() {
      return {
        isAdd:false,
        isEdit:false,
        rules:{},
        columnsList: [
          {
            title: '名称',
            key: 'name',
          },
          {
            title: '后端api',
            key: 'url',
          },
          {
            title: '前端标记',
            key: 'front'
          },
          {
            title: '操作',
            key: 'handle',
            width: 200,
            type: 'template',
            template: 'handle'
          }
        ],
        accessData: [
          {
            name: 'Jack',
            url: 'male',
            front: 10,
            children: [
              {
                name: 'Ashley',
                url: 'female',
                front: 20,
                children: [
                  {
                    name: 'Ashley',
                    url: 'female',
                    front: 20
                  },
                  {
                    name: 'Taki',
                    url: 'male',
                    front: 10,
                    children: [
                      {
                        name: 'Ashley',
                        url: 'female',
                        front: 20
                      }
                    ]
                  }
                ]
              },
              {
                name: 'Taki',
                url: 'male',
                front: 10
              }
            ]
          },
        ],
        accessAddForm:{},
        accessEditForm:{},
        accessCas:[]
      }
    },
    methods:{
      //权限添加
      async doAccessAdd(){

      },
      //权限编辑
      async doAccessEdit(){

      },
      // 添加modal打开
      openAddModal () {
        this.accessAddForm = {}
        this.isAdd = true
      },
      // 添加modal关闭
      cancelAddModal () {
        this.$refs.accessAddForm.resetFields()// 重置表单
        this.accessAddForm = {}
        this.isAdd = false
      },
      // 编辑modal打开
      openEditModal (params) {
        console.log(params)
        this.accessEditForm = params
        this.isEdit = true
      },
      // 编辑modal关闭
      cancelEditModal(){
        this.$refs.accessEditForm.resetFields()// 重置表单
        this.isEdit = false
      },
    }
  }
</script>

<style scoped>

</style>
