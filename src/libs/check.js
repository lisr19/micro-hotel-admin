//校验用判断

//用户管理
export const userRules={
  username:[
    { required: true, message: '用户名不能为空', trigger: 'blur' },
    { max: 20, message: '请输入20个以内字符', trigger: 'blur' },
    {
      pattern: /^(?!_)(?!.*?_$)[0-9a-zA-Z_]+$/,
      message: '用户名只含有字母、数字、下划线不能以下划线开头和结尾',
      trigger: 'blur'
    }
  ],
  name: [
    { required: true, message: '姓名不能为空', trigger: 'blur' },
    { max: 20, message: '请输入20个以内字符', trigger: 'blur' },
    {
      pattern: /^(?!_)(?!.*?_$)[a-zA-Z_\u4e00-\u9fa5]+$/,
      message: '姓名只含有汉字、字母、下划线不能以下划线开头和结尾',
      trigger: 'blur'
    }
  ],
  emergencyContact:[
    { max: 20, message: '请输入20个以内字符', trigger: 'blur' },
    {
      pattern: /^(?!_)(?!.*?_$)[a-zA-Z_\u4e00-\u9fa5]+$/,
      message: '姓名只含有汉字、字母、下划线不能以下划线开头和结尾',
      trigger: 'blur'
    }
  ],
  emergencyContactPhone:[
    { pattern: /^[1][3,4,5,7,8][0-9]{9}$/, message: '手机格式不正确', trigger: 'blur' }
  ],
  phone: [
    { required: true, message: '电话号码不能为空', trigger: 'blur' },
    { pattern: /^[1][3,4,5,7,8][0-9]{9}$/, message: '手机格式不正确', trigger: 'blur' }
  ],
  idNumber: [
    { pattern: /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/, message: '身份证格式不正确', trigger: 'blur' }
  ],
  gender: [{ required: true, message: '性别不能为空', trigger: 'blur' }],
  email: [
    {
      pattern: /^[A-Za-z0-9]+([._\\-]*[A-Za-z0-9])*@([A-Za-z0-9]+[-A-Za-z0-9]*[A-Za-z0-9]+.){1,63}[A-Za-z0-9]+$/,
      message: '不合法的邮箱',
      trigger: 'blur'
    }
  ],
  password: [
    {
      pattern: /^[^~# $……^。，；：“”‘’{}()[`%*&|+<>/,.;:'"=\]\\]{6,20}$/,
      message: '密码格式不正确,密码由6-20位大小写字母、数字、符号：?、!、@组成',
      trigger: 'blur'
    }
  ]
}

//标签管理
export const labelRules={
  content: [
    { required: true, message: '名称不能为空', trigger: 'blur' },
    { max: 20, message: '请输入20个以内字符', trigger: 'blur' },
  ],
  type_name: [
    { required: true, message: '类型不能为空', trigger: 'blur' },
    { max: 20, message: '请输入20个以内字符', trigger: 'blur' },
  ],
}

//酒店管理
export const hotelRules={
  phone: [
    // { pattern: /^[1][3,4,5,7,8][0-9]{9}$/, message: '手机格式不正确', trigger: 'blur' }
  ],
  name: [
    { required: true, message: '名称不能为空', trigger: 'blur' }
  ],
  price:[
    { pattern: /(^[1-9]\d*(\.\d{1,2})?$)|(^0(\.\d{1,2})?$)/, message: '请输入正确的价格:整数或者保留两位小数', trigger: 'blur' }
  ],
  kindType:[
    { required: true, message: '类型不能为空', trigger: 'blur' }
  ],
  desc:[
    { required: true, message: '介绍不能为空', trigger: 'blur' },
    { max: 100, message: '请输入100个以内字符', trigger: 'blur' },
  ],
}

//管理员管理
export const adminRules={
  name: [
    { required: true, message: '姓名不能为空', trigger: 'blur' },
    { max: 20, message: '请输入20个以内字符', trigger: 'blur' },
    {
      pattern: /^(?!_)(?!.*?_$)[a-zA-Z_\u4e00-\u9fa5]+$/,
      message: '姓名只含有汉字、字母、下划线不能以下划线开头和结尾',
      trigger: 'blur'
    }
  ],
  username:[
    { required: true, message: '用户名不能为空', trigger: 'blur' },
    { max: 20, message: '请输入20个以内字符', trigger: 'blur' },
    {
      pattern: /^(?!_)(?!.*?_$)[0-9a-zA-Z_]+$/,
      message: '用户名只含有字母、数字、下划线不能以下划线开头和结尾',
      trigger: 'blur'
    }
  ],
  phone: [
    { pattern: /^[1][3,4,5,7,8][0-9]{9}$/, message: '手机格式不正确', trigger: 'blur' }
  ],
  role: [{required: true, message: '请选择角色', trigger: 'change' }],
  password: [
    { required: true, message: '密码不能为空', trigger: 'blur' },
    {
      pattern: /^[^~# $……^。，；：“”‘’{}()[`%*&|+<>/,.;:'"=\]\\]{6,20}$/,
      message: '密码格式不正确,密码由6-20位大小写字母、数字、符号：?、!、@组成',
      trigger: 'blur'
    }
  ],
  mail: [
    {
      pattern: /^[A-Za-z0-9]+([._\\-]*[A-Za-z0-9])*@([A-Za-z0-9]+[-A-Za-z0-9]*[A-Za-z0-9]+.){1,63}[A-Za-z0-9]+$/,
      message: '不合法的邮箱',
      trigger: 'blur'
    }
  ],
}

export const orderRules={
  userId:[{type:'number', required: true, message: '用户账号不能为空', trigger: 'change' }],
  linkman:[{ required: true, message: '联系人不能为空', trigger: 'blur' }],
  phone:[{ required: true, message: '联系电话不能为空', trigger: 'blur' },
    { pattern: /^[1][3,4,5,7,8][0-9]{9}$/, message: '手机格式不正确', trigger: 'blur' }],
  livingPeriod:[{ pattern: /^(0|[1-9][0-9]*)$/, message: '请输入正确格式数字', trigger: 'blur' }],
  totalPrice:[
    { required: true, message: '总金额不能为空', trigger: 'blur' },
    { pattern: /(^[1-9]\d*(\.\d{1,2})?$)|(^0(\.\d{1,2})?$)/, message: '请输入正确的价格:整数或者保留两位小数', trigger: 'blur' }
  ],
  status:[{ required: true, message: '状态不能为空', trigger: 'change' }]
}

export const roomRules={
  type:[{required: true, message: '房型不能为空', trigger: 'blur' }],
  hotelId:[{type:'number',required: true, message: '请选择所属酒店/民宿', trigger: 'change' }],
  square:[{ pattern: /^(0|[1-9][0-9]*)$/, message: '请输入正确格式数字', trigger: 'blur' }],
  availableAdult:[
    {required: true, message: '可容纳成人数不能为空', trigger: 'blur' },
    { pattern: /^(0|[1-9][0-9]*)$/, message: '请输入正确格式数字', trigger: 'blur' }
    ],
  availableChild:[{ pattern: /^(0|[1-9][0-9]*)$/, message: '请输入正确格式数字', trigger: 'blur' }],
  count:[
    { required: true, message: '可用房间数不能为空', trigger: 'blur' },
    { pattern: /^(0|[1-9][0-9]*)$/, message: '请输入正确格式数字', trigger: 'blur' }
    ],
  roomCount:[
    { required: true, message: '房间总数不能为空', trigger: 'blur' },
    { pattern: /^(0|[1-9][0-9]*)$/, message: '请输入正确格式数字', trigger: 'blur' }
    ],
  cancelPrice:[
    { required: true, message: '可取消价格不能为空', trigger: 'blur' },
    { pattern: /(^[1-9]\d*(\.\d{1,2})?$)|(^0(\.\d{1,2})?$)/, message: '请输入正确的价格:整数或者保留两位小数', trigger: 'blur' }
    ],
  price:[
    { required: true, message: '不可取消价格不能为空', trigger: 'blur' },
    { pattern: /(^[1-9]\d*(\.\d{1,2})?$)|(^0(\.\d{1,2})?$)/, message: '请输入正确的价格:整数或者保留两位小数', trigger: 'blur' }
    ],
}

export const policyTypeRules={
  name:[{required: true, message: '类型名不能为空', trigger: 'blur' }],
  flag:[{required: true, message: '请选择标志', trigger: 'change' }],
  type:[{required: true, message: '请选择所属类型', trigger: 'change' }]
}

export const policyRules={
  ruleType:[{type:'number',required: true, message: '类型名不能为空', trigger: 'change' }],
  hotelId:[{type:'number',required: true, message: '请选择关联酒店/民宿', trigger: 'change' }],
  roomId:[{type:'number',required: true, message: '请选择关联房间', trigger: 'change' }],
  flag:[{required: true, message: '请选择标志', trigger: 'change' }]
}

export const facRules={
  type:[{type:'number',required: true,message: '请选择所属类型',trigger: 'change' }],
  flag:[{required: true, message: '请选择标志', trigger: 'change' }],
  hotelId:[{type:'number',required: true, message: '请选择关联酒店/民宿', trigger: 'change' }],
  roomId:[{type:'number',required: true, message: '请选择关联房间', trigger: 'change' }],
  name:[{required: true, message: '类型名不能为空', trigger: 'blur' }],
  facilityServiceId:[{type:'number',required: true, message: '请选择服务', trigger: 'change' }]
}

export const sliderRules = {
  name:[{required: true, message: '名称不能为空', trigger: 'blur' }],
  typeId:[{type:'number',required: true,message: '请选择所属类型',trigger: 'change' }],
}
