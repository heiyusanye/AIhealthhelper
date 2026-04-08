<script setup>
import { Expand } from '@element-plus/icons-vue';
import { useAdminStore } from '@/stores/admin';
import { useTitleStore } from '@/stores/admin'
import { ElMessageBox } from 'element-plus'
import { logout } from '@/api/admin'
import router from '@/router'

const titleStore = useTitleStore()

const changeCollapse = () => {
    useAdminStore().toggleCollapse()
}

const handleCommand = (command) => {
    if (command === 'out') {
        // 退出登录
        ElMessageBox.confirm('确定退出登录吗？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
        }).then(() => {
            // 清除本地存储中的用户信息
            logout().then(() => {
                localStorage.removeItem('token')
                localStorage.removeItem('userInfo')
                // 跳转到登录页
                router.push('/author/login')
            })     
    })
}}

</script>

<template>
    <div class="header">
        <div class="left flexbox">
            <el-button :icon="Expand" @click="changeCollapse"></el-button>
            <p class="text">{{ titleStore.title }}</p>
        </div>
        <div class="right flexbox">
            <el-dropdown @command="handleCommand">
                <span class="el-dropdown-link">
                    <div class="flexbox">
                        <el-avatar
                            src="https://cube.elemecdn.com/0/88/c530d2554b4394c400021336853c48.png?wh=40x40"></el-avatar>
                        <p class="username">用户</p>
                        <el-icon class="el-icon--right"><arrow-down /></el-icon>
                    </div>
                </span>
                <template #dropdown>
                    <el-dropdown-menu>
                        <el-dropdown-item command="out">退出登录</el-dropdown-item>
                    </el-dropdown-menu>
                </template>
            </el-dropdown>
        </div>
    </div>
</template>
<style lang="scss" scoped>
.header {
    height: 72px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 15px;
    background: white;
    box-shadow: 0 2px 4px rgba(0, 21, 41, 0.08);
    border-bottom: 1px solid #e5e7eb;

    .flexbox {
        display: flex;
        align-items: center;
        justify-content: center;

        .text {
            margin-left: 20px;
            font-size: 26px;
            font-weight: bold;
            color: #1f2937;
        }
    }
}
</style>
