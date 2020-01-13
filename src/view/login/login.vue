<style lang="less">
  @import './login.less';
</style>

<template>
  <div class="login">
    <div class="login-con">
      <Card icon="log-in" title="微酒店后台管理" :bordered="false">
        <div class="form-con">
          <login-form @on-success-valid="handleSubmit"></login-form>
        </div>
      </Card>
    </div>
  </div>
</template>

<script>
import LoginForm from '_c/login-form'
import { mapActions } from 'vuex'
export default {
  components: {
    LoginForm
  },
  methods: {
    ...mapActions([
      'handleLogin',
      // 'getUserInfo'
    ]),
    async handleSubmit ({ userName, password }) {
      console.log('账号密码',userName, password);
      this.handleLogin({ userName, password }).then(res => {
        if(res.code !== 200){//登录不成功
          this.$Message.error(res.data)
        }else{
          this.$router.push({
            name: this.$config.homeName
          })
        }
        // this.getUserInfo().then(res => {
        //   this.$router.push({
        //     name: this.$config.homeName
        //   })
        // })
      })
    }
  }
}
</script>

<style>

</style>
