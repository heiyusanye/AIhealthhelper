<template>
    <el-form ref="ruleFormRef" :model="formData">
        <el-row :gutter="20">
            <template v-for="item in formItemWithCol" :key="item.prop"> 
                <el-col v-bind="item.col">
                    <el-form-item :label="item.label" :prop="item.prop">
                        <component v-model="formData[item.prop]" :is="isInputType(item.type)"
                            :placeholder="item.placeholder">
                            <template v-if="item.type === 'select'">
                                <el-option label="全部" value="" />
                                <el-option v-for="option in item.options" :key="option.value" :label="option.label"
                                    :value="option.value"></el-option>
                            </template>
                        </component>
                    </el-form-item>
                </el-col>
            </template>
        </el-row>
        <el-row>
            <el-button type="primary" @click="handleSearch">查询</el-button>
            <el-button type="default" @click="handleReset(ruleFormRef)">重置</el-button>
             <!-- 重置查询条件reset会报错 -->
        </el-row>
    </el-form>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { defineProps } from 'vue'
const ruleFormRef = ref(null)
const props = defineProps({
    formItem: {
        type: Array,
        default: () => [],
    },
})
const isInputType = (type) => {
    return {
        input: 'el-input',
        select: 'el-select',
    }[type]
}
const formItemWithCol = computed(() => {
    const { formItem } = props
    formItem.forEach(item => {
        item.col = { xs: 24, sm: 12, md: 6, lg: 4 }
    })
    return formItem
})
const emit = defineEmits(['search'])
const formData = reactive({})

const handleSearch = () => {
    emit('search', formData)
}
const handleReset = (formEl) => {
    if (!formEl) return
    formEl.resetFields()
    emit('search', formData)
}
</script>
