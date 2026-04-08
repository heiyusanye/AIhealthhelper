<template>
    <div class="backend-layout">
        <el-container class="main-container">
            <Aside />
            <el-container>
                <el-header>
                    <Head />
                </el-header>
                <el-main class="main-content">
                    <router-view class="content" />
                </el-main>
            </el-container>
        </el-container>
    </div>
</template>

<script setup>
import Head from '@/components/Head.vue'
import Aside from '@/components/Aside.vue'

</script>

<style lang="scss" scoped>
.backend-layout {
    height: 100vh;

    .main-container {
        height: 100vh;

        .el-header {
            height: 72px !important;
        }

        .content {
            height: 100%;
            overflow: auto;
            padding: 20px;
            background: white;
            height: calc(100% - 74px);
        }
    }
}
</style>