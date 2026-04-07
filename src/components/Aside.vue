<template>
    <el-aside :width="isCollapse ? '64px' : '200px'">
        <el-menu class="el-menu-vertical-demo" :collapse="isCollapse" :collapse-transition="false">
            <div class="brand">
                <img :src="logoURL" alt="logo">
                <div v-show="!isCollapse" class="text">
                    <h1>心理健康AI助手</h1>
                    <span>管理后台</span>
                </div>
            </div>
            <el-menu-item v-for="item in router.options.routes[0].children" :key="item.path"
                :index="`/back/${item.path}`" @click="routerChoose(`/back/${item.path}`)">
                <el-icon>
                    <component :is="item.meta.icon" />
                </el-icon>
                <span>{{ item.meta.title }}</span>
            </el-menu-item>
        </el-menu>
    </el-aside>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { useAdminStore } from '@/stores/admin';
import { computed } from 'vue'
import { useTitleStore } from '@/stores/admin'

const titleStore = useTitleStore()

const isCollapse = computed(() => useAdminStore().isCollapse)

const router = useRouter()

// 获取所有后端路由
const backendRoutes = router.options.routes[0].children

const routerChoose = (path) => {
    // 根据路径找到对应的路由项，获取标题
    const routeItem = backendRoutes.find(item => `/back/${item.path}` === path)
    if (routeItem?.meta?.title) {
        titleStore.setTitle(routeItem.meta.title)
    }
    router.push(path)
}

const logoURL = new URL('@/assets/images/机器人.png', import.meta.url).href

</script>

<style lang="scss" scoped>
.el-aside {
    height: 100%;

    .el-menu-vertical-demo {
        width: 100%;
        height: 100%;
    }
}

.brand {
    box-sizing: border-box;
    height: 72px;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 10px;
    background-color: #fff;
    border-bottom: 1px solid #e5e7eb;
}

.brand img {
    width: 50px;
    height: 50px;
}

.brand .text {
    margin-left: 10px;
    font-weight: bold;
}

.brand .text h1 {
    font-size: 16px;
    margin-bottom: 5px;
    color: #1f2937;
}

.brand .text span {
    font-size: 14px;
    color: #909399;
}
</style>
