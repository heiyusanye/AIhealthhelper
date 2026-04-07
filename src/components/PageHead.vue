<template>
    <div class="page-head">
        <p class="page-title">{{ props.title }}</p>
        <div class="btns">
            <slot name="buttons"></slot>
        </div>
    </div>
</template>

<script setup lang="js">
const props = defineProps({
    title: {
        type: String,
        default: '页面标题'
    }
})

</script>
<style scoped>
.page-head {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
    .page-title {
        font-size: 24px;
        color: #2d3748;
    }
}
</style>