<template>
    <div class="common-layout main-login-class">
        <el-container class="login-body">
            <div class="login-main">
                <div class="common-layout">
                    <el-container>
                        <el-header class="login-main-header">
                            <h1>STONE</h1>
                        </el-header>
                        <el-main class="login-main-main">
                            <el-form ref="passwordLoginRef" v-if="loginInfo.loginModel==='01'" :inline="false" :model="loginInfo" class="demo-form-inline" :rules="loginInfoPasswordRules">
                                <el-form-item>
                                    <el-button link type="primary" style="font-size: 14px" size="small" @click="changeloginModel">{{ changeloginModelDesc }}</el-button>
                                </el-form-item>
                                <el-form-item prop="userName">
                                    <el-input v-model="loginInfo.userName" size="large" placeholder="用户名" prefix-icon="User" clearable />
                                </el-form-item>
                                <el-form-item prop="password">
                                    <el-input v-model="loginInfo.password" size="large" placeholder="密码" prefix-icon="Key" type="password" @keyup.enter="requestLogin('passwordLoginRef')" clearable />
                                </el-form-item>
                            </el-form>
                            <el-form ref="userPhoneLoginRef" v-if="loginInfo.loginModel==='02'" :inline="false" :model="loginInfo" class="demo-form-inline" :rules="loginInfoPhoneRules">
                                <el-form-item>
                                    <el-button link type="primary" style="font-size: 14px" size="small" @click="changeloginModel">{{ changeloginModelDesc }}</el-button>
                                </el-form-item>
                                <el-form-item prop="userPhone">
                                    <el-input v-model="loginInfo.userPhone" size="large" placeholder="手机号码" prefix-icon="Iphone" clearable />
                                </el-form-item>
                                <el-form-item prop="verificationCode">
                                    <el-row :gutter="20">
                                        <el-col :span="17">
                                            <el-input v-model="loginInfo.verificationCode" size="large" placeholder="验证码" prefix-icon="Key" @keyup.enter="requestLogin('userPhoneLoginRef')" clearable />
                                        </el-col>
                                        <el-col :span="3" style="height: 12px; margin-top: 12px;">
                                            <el-button :disabled="countdown > 0" link type="primary" size="small" @click="getVerificationCode">{{ getVerificationCodeText }}</el-button>
                                        </el-col>
                                    </el-row>
                                </el-form-item>
                            </el-form>
                        
                        </el-main>
                        <el-footer class="login-main-footer">
                            <el-form :inline="false" >
                                <el-form-item prop="verificationCode">
                                    <!-- <el-checkbox v-model="rememberMe" style="float: left;">记住密码</el-checkbox> -->
                                    <el-button type="primary" v-if="loginInfo.loginModel==='01'" style="width: 100%;" @click="requestLogin('passwordLoginRef')">登录</el-button>
                                    <el-button type="primary" v-if="loginInfo.loginModel==='02'" style="width: 100%;" @click="requestLogin('userPhoneLoginRef')">登录</el-button>
                                </el-form-item>
                                <el-form-item>
                                    <el-row :gutter="20">
                                        <el-col :span="17">
                                        </el-col>
                                    </el-row>
                                </el-form-item>
                            </el-form>
                        </el-footer>
                    </el-container>
                </div>
            </div>
        </el-container>
    </div>
</template>

<script>
import {
    userLogin
} from '@/api/userApi/userLoginApi'
export default {
    data() {
        const loginInfo = {
            userName: '',
            password: '',
            userPhone: '',
            verificationCode: '',
            loginModel: '01'
        }
        const finalLoginInfoPasswordRules = {
            userName: [
                {required: true, message: '', trigger: ['blur', 'change']},
                { pattern: /^[0-9a-zA-Z_]+$/, message: '输入内容必须只包含数字和字母或\'_\'', trigger: ['blur', 'change']},
                { min: 6, max: 16, message: '用户名称在长度6到16之间', trigger: ['blur', 'change']}
            ],
            password: [
                {required: true, message: '', trigger: ['blur', 'change']},
                { min: 6, max: 16, message: '用户密码在长度6到16之间', trigger: ['blur', 'change']}
            ],
        }
        const finalLoginInfoPhoneRules = {
            userPhone: [
                {required: true, message: '', trigger: ['blur', 'change']},
                { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号', trigger: ['blur', 'change']}
            ],
            verificationCode: [
                {required: true, message: '', trigger: ['blur', 'change']}
            ],
        }
        return {
            loginInfo: loginInfo,
            rememberMe: false,
            loginInfoPasswordRules: finalLoginInfoPasswordRules,
            loginInfoPhoneRules: finalLoginInfoPhoneRules,
            finalLoginInfoPasswordRules: finalLoginInfoPasswordRules,
            finalLoginInfoPhoneRules: finalLoginInfoPhoneRules,
            changeloginModelDesc: '手机验证登录',
            getVerificationCodeFlag: false,
            countdown: 0,
            getVerificationCodeText: '获取验证码',
            timer: null     // 定时器变量
        }
    },
    methods: {
        changeloginModel() {
            this.loginInfo.loginModel = this.loginInfo.loginModel === '01'?  '02': '01';
            this.changeloginModelDesc = this.loginInfo.loginModel === '01'?  '手机验证登录': '账户密码登录';
            this.loginInfo.userName = '';
            this.loginInfo.password = '';
            this.loginInfo.userPhone = '';
            this.loginInfo.verificationCode = '';
        },
        getVerificationCode() {
            // 这里模拟发送验证码的操作
            console.log('验证码已发送');

            // 重置剩余时间并启动倒计时
            this.countdown = 60;
            this.getVerificationCodeText = '重新发送（' + this.countdown + '）';
            this.startCountdown();
        },
        startCountdown(){
            if (this.timer) clearInterval(this.timer); // 如果已经有一个定时器在运行，先清除它
      
            this.timer = setInterval(() => {
                if (this.countdown > 0) {
                    this.countdown--;       // 减少剩余时间
                    
                    if (this.countdown > 0) {
                        this.getVerificationCodeText = '重新发送（' + this.countdown + '）';
                    } else {
                        this.getVerificationCodeText = '重新发送';
                    }
                } else {
                    clearInterval(this.timer);      // 时间到了，清除定时器
                    this.timer = null;              // 重置定时器变量
                    this.countdown = 0;             // 重置倒计时时间
                    console.log('倒计时结束');
                }
            }, 1000);           // 每秒更新一次倒计时

        },
        requestLogin(formName) {
            this.$refs[formName].validate((valid, fields) => {
                if (valid) {
                    // 校验成功
                    this.sendUserLoginRequest();
                } else {
                    console.log('校验失败', fields);
                }
            });
        },
        sendUserLoginRequest() {
            userLogin(this.loginInfo).then(res => {
                if (res.code == '00000') {
                    console.log('--- 发起登录请求出参 ---', res)
                    sessionStorage.setItem('Stone-Token', res.data.token);
                    sessionStorage.setItem('stoneFileToken', res.data.fileToken);
                    this.$router.push('/');
                }
            })
        },
    }
}
</script>

<style>
.login-body {
    background-image: url("@/assets/image/login/login_background.jpg");
    background-size: cover;
    height: 100vh;
    opacity: 0.8;
}
.login-main {
    border: 1px solid #545c64;
    border-radius: 12px;
    width: 350px;
    height: 500px;
    margin: calc((50vh - 250px) * 0.618) auto;
    background-color: #ffffff;
    opacity: 0.85;
}
.login-main-header {
    height: 120px;
    text-align: center;
    font-size: 24px;
    padding: 20px;
}
.login-main-main {
    height: 230px;
}
.login-main-footer {
    height: 150px;
    padding: 20px;
}
</style>