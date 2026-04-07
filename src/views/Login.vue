<template>
    <div class="login-page">
        <div class="title">
            <div class="back-home">
                <el-icon>
                    <Back />
                </el-icon>
                <span>返回首页</span>
            </div>
            <div class="title-text">
                <h2>登录您的帐户</h2>
                <p>请输入您的登录信息</p>
            </div>
        </div>
        <div class="form-container">
            <el-form ref="ruleFormRef" :model="formData" :rules="rules" label-position="top">
                <el-form-item label="用户名或邮箱" prop="username">
                    <el-input v-model="formData.username" size="large" placeholder="请输入用户名" />
                </el-form-item>
                <el-form-item label="密码" prop="password">
                    <el-input v-model="formData.password" size="large" type="password" placeholder="请输入密码"
                        show-password />
                </el-form-item>
                <el-button class="login-btn" type="primary" size="large" @click="submitForm(ruleFormRef)">登录</el-button>
            </el-form>
        </div>
        <div class="footer">
            <p>还没有账户？<router-link to="/author/register">去注册</router-link></p>
        </div>
    </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { login } from '@/api/admin'
import { ElMessage } from 'element-plus'
import router from '@/router'

const formData = reactive({
    username: '',
    password: ''
})

const rules = reactive({
    username: [
        { required: true, message: '请输入用户名', trigger: 'blur' }
    ],
    password: [
        { required: true, message: '请输入密码', trigger: 'blur' }
    ]
})

const ruleFormRef = ref()
const submitForm = async (formEl) => {
    if (!formEl) return
    await formEl.validate((valid, fields) => {
        if (valid) {
            // console.log(formData)
            login(formData).then(data => {
                if (!data.token) {
                    return ElMessage.error('登录失败')
                }
                ElMessage.success('登录成功')
                localStorage.setItem('token', data.token)
                localStorage.setItem('userInfo', JSON.stringify(data.userInfo))
                // window.location.href = '/author/index'
                //根据用户角色跳转不同的页面
                if (data.userInfo.userType === 2) {
                    router.push('/back/dataanalysis')
                } else {
                    router.push('/user/index')
                }
            })
        }
    })
}

</script>

<style>
.login-page {
    width: 384px;
    padding: 20px;

    .back-home {
        margin-bottom: 60px;
    }

    .title-text {
        text-align: center;

        h2 {
            font-size: 36px;
            margin-bottom: 10px;
        }

        p {
            font-size: 18px;
            color: #6b7280;
        }
    }

    .form-container {
        margin-top: 30px;

        .login-btn {
            margin-top: 40px;
            width: 100%;
        }
    }

    .footer {
        padding: 30px;
        text-align: center;
    }
}
</style>