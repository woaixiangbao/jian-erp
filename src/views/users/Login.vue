<template>
  <div>
    <div class="loading-wrapper" v-show="showLoading">
    </div>
    <div class="login-wrapper" v-show="!showLoading">
      <!-- <img :src="imgUrl" alt="" width="100%" height="100%"> -->
      <div class="login">
        <p class="title">Vue</p>
        <el-form
          :model="ruleForm"
          status-icon
          :rules="rules"
          ref="ruleForm"
          label-width="0"
          class="demo-ruleForm"
        >
          <el-form-item prop="name">
            <el-input v-model="ruleForm.name" auto-complete="off" placeholder="请输入用户名"></el-input>
          </el-form-item>
          <el-form-item prop="pass">
            <el-input
              type="password"
             v-model="ruleForm.pass" auto-complete="off" placeholder="输入密码"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="login('ruleForm')" style="width:100%;">登录</el-button>
            <p class="register" @click="gotoRegist">没有账户？立即注册</p>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
import { mapMutations } from 'vuex';
import CryptoJS from 'crypto-js'; // md5 加密
// eslint-disable-next-line import/no-cycle
import axios from '../../axios';

export default {
  name: 'Login',
  data() {
    const checkName = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入用户名'));
      } else {
        callback();
      }
    };
    const validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码'));
      } else {
        callback();
      }
    };
    return {
      showLoading: true,
      // eslint-disable-next-line global-require
      imgUrl: require('../../assets/images/bg-img-1.jpg'),
      ruleForm: {
        name: '',
        pass: '',
      },
      rules: {
        name: [{ validator: checkName, trigger: 'change' }],
        pass: [{ validator: validatePass, trigger: 'change' }],
      },
    };
  },
  mounted() {
    const bgImg = new Image();
    bgImg.src = this.imgUrl;
    bgImg.onerror = () => {
      console.log('img onerror');
    };
    bgImg.onload = () => { // 图片加载成功后 去除loading
      this.showLoading = false;
    };
  },
  methods: {
    ...mapMutations({
      bindLogin: 'BIND_LOGIN',
      saveUser: 'SAVE_USER',
    }),
    login(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          const sendData = {
            username: encodeURIComponent(this.ruleForm.name),
            password: CryptoJS.MD5(this.ruleForm.pass).toString(),
          };
          axios.userLogin(sendData).then((res) => {
            if (res.status === 200) {
              console.log(res, 8888);
              if (res.data && res.data.code === 0) {
                this.bindLogin(res.data.token);
                this.saveUser(res.data.username);
                this.$notify({
                  title: '成功',
                  message: '恭喜，登录成功。',
                  duration: 1000,
                  type: 'success',
                });
                setTimeout(() => {
                  this.$router.push({
                    path: '/product',
                  });
                }, 500);
              } else {
                this.$notify({
                  title: '错误',
                  message: res.data.msg,
                  duration: 1000,
                  type: 'error',
                });
              }
            } else {
              this.$notify({
                title: '错误',
                message: '服务器出错，请稍后重试',
                duration: 1000,
                type: 'error',
              });
            }
          });
        }
      });
    },
    gotoRegist() {
      this.$router.push({
        path: '/register',
      });
    },
  },
};
</script>
<style scoped>
.loading-wrapper {
  position: fixed;
  top: 0;
  right: 0;
  left: 0;
  bottom: 0;
  background: #aedff8;
  display: flex;
  align-items: center;
  justify-content: center;
}
.login-wrapper {
  background: rgba(0, 0, 0, 0.25);
  position: fixed;
  top: 0;
  right: 0;
  left: 0;
  bottom: 0;
}
.login-wrapper img {
  position: absolute;
  z-index: 1;
  left: 0;
}
.login {
  max-width: 340px;
  margin: 60px auto;
  background: #fff;
  padding: 20px 40px;
  border-radius: 10px;
  position: relative;
  z-index: 9;
}
.title {
  font-size: 26px;
  line-height: 50px;
  font-weight: bold;
  margin: 10px;
  text-align: center;
}
#login-form>input {
  width: 100%;
  height: 34px;
  display: block;
  margin-top: 26px;
  background: #fff;
  color: #333;
  border: 1px solid #7da9c7;
  outline: none;
  text-indent: 20px;
  font-size: 14px;
}
#login-form>button {
  width: 100%;
  height: 34px;
  display: block;
  margin-top: 26px;
  background: #1ab2ff;
  color: #fff;
  border: 1px solid #1ab2ff;
  outline: none;
  border-radius: 100px;
  text-align: center;
  font-size: 16px;
  cursor: pointer;
}
.register {
  margin-top: 10px;
  font-size: 14px;
  line-height: 22px;
  text-indent: 8px;
  color: #1ab2ff;
  cursor: pointer;
  display: inline-block;
}
.register:hover {
  color: #2c2fd6;
}
@media (max-width: 768px) {
  .login {
    max-width: 260px;
    margin: 60px auto;
    background: #fff;
    padding: 20px 20px;
    border-radius: 10px;
    position: relative;
    z-index: 9;
  }
}
</style>
