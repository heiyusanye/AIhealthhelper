import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useAdminStore = defineStore('admin',() =>{
    const isCollapse = ref(false)
    const toggleCollapse = () => {
        isCollapse.value = !isCollapse.value
    }
    return {
        isCollapse,
        toggleCollapse
    }
})

export const useTitleStore = defineStore('title',() =>{
    const title = ref('数据分析')
    const setTitle = (newTitle) => {
        title.value = newTitle
    }
    return {
        title,
        setTitle
    }
})
