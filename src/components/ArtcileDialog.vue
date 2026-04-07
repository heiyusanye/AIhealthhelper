<template>
    <el-dialog :title="idEdit ? '编辑文章' : '新增文章'" v-model="dialogVisible" width="50%" @close="handleClose">
        <el-form :model="formData" :rules="rules" ref="formRef" label-width="120px">
            <el-form-item label="文章标题" prop="title">
                <el-input v-model="formData.title" placeholder="请输入文章标题" maxlength="200" show-word-limit clearable />
            </el-form-item>
            <el-form-item label="所属分类" prop="categoryId">
                <el-select v-model="formData.categoryId" placeholder="请选择分类">
                    <el-option v-for="item in props.categoryList" :key="item.value" :label="item.label"
                        :value="item.value" />
                </el-select>
            </el-form-item>
            <el-form-item label="文章摘要" prop="summary">
                <el-input type="textarea" v-model="formData.summary" placeholder="请输入文章摘要" maxlength="1000"
                    show-word-limit clearable :rows="4" />
            </el-form-item>
            <el-form-item label="标签" prop="tags">
                <el-select v-model="formData.tagArray" placeholder="请输入文章标签" multiple filterable allow-create
                    style="width: 100%;">
                    <el-option v-for="item in commonTags" :key="item" :label="item" :value="item" />
                </el-select>
            </el-form-item>
            <el-form-item label="封面图片">
                <div class="cover-upload">
                    <el-upload :show-file-list="false" class="avatar-uploader" action="#" :before-upload="beforeUpload"
                        :http-request="httpRequest" accept="image/*">
                        <div v-if="!imgUrl" class="cover-placeholder">
                            <p>点击上传封面图片</p>
                        </div>
                        <img v-else :src="imgUrl" class="cover-image" alt="封面图片">
                    </el-upload>
                    <div v-if="imgUrl" class="remove-image">
                        <el-button type="danger" @click="handleRemoveImage">移除封面</el-button>
                    </div>
                </div>
            </el-form-item>
            <el-form-item label="文章内容" prop="content">
                <RichTextEditor v-model="formData.content" placeholder="请输入文章内容，支持富文本格式\n\n可以使用加粗、斜体、列表、标题等格式来丰富文章内容"
                    maxCharCount="5000" @change="handleContentChange" @created="handleEditorCreated"
                    minHeight="400px" />
            </el-form-item>
        </el-form>
        <div v-if="btnPreview" class="preview-container">
            <div class="preview-title">预览效果</div>
            <div class="preview-content">
                <div v-html="formData.content"></div>
            </div>
        </div>
        <template #footer>
            <el-button @click="btnPreview = !btnPreview">{{ btnPreview ? '隐藏预览' : '预览效果' }}</el-button>
            <el-button @click="handleClose">{{ '取消' }}</el-button>
            <el-button type="primary" @click="handleSubmit" :loading="loading">{{ idEdit ? '更新文章' : '创建文章'
            }}</el-button>
        </template>
    </el-dialog>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { ElMessage } from 'element-plus'
import { uploadFile } from '@/api/admin'
import { fileBaseUrl } from '@/config/index.js'
import { Editor } from '@wangeditor/editor-for-vue'
import RichTextEditor from '@/components/RichTextEditor.vue'
import { nextTick } from 'vue'
import { createArticle, updateArticle } from '@/api/admin.js'

const props = defineProps({
    modelValue: {
        type: Boolean,
        default: false
    },
    categoryList: {
        type: Array,
        default: () => []
    },
    currentArticle: {
        type: Object,
        default: null
    }
})
const emit = defineEmits(['update:modelValue', 'success'])
const dialogVisible = computed({
    get() {
        return props.modelValue
    },
    set(val) {
        emit('update:modelValue', val)
    }
})

const idEdit = computed(() => {
    return !!props.currentArticle?.id
})
watch(() => props.currentArticle, (newVal) => {
    if (newVal) {
        nextTick(() => {
            businessId.value = newVal.id
            formData.value = {
                ...newVal,
                tagArray: newVal.tags ? newVal.tags.split(',') : []
            }
            // 检查 coverImage 是否已经是完整的 URL
            if (newVal.coverImage) {
                if (newVal.coverImage.startsWith('http')) {
                    imgUrl.value = newVal.coverImage
                } else {
                    imgUrl.value = `${fileBaseUrl}${newVal.coverImage}`
                }
            } else {
                imgUrl.value = ''
            }
        })
    }
})
const handleClose = () => {
    formRef.value.resetFields()
    businessId.value = null
    handleRemoveImage()
    formData.value.tagArray = []
    dialogVisible.value = false
}
const formData = ref({
    "title": "",
    "content": "",
    "coverImage": "",
    "categoryId": "",
    "summary": "",
    "tags": "",
    "id": ""
})
const commonTags = [
    '情绪管理', '焦虑', '抑郁', '压力', '睡眠',
    '冥想', '正念', '放松', '心理健康', '自我成长',
    '人际关系', '工作压力', '学习方法', '生活技巧'
]
const imgUrl = ref('')
const beforeUpload = (file) => {
    const isJPG = file.type === 'image/jpeg'
    const isPNG = file.type === 'image/png'
    const isSize = file.size / 1024 / 1024 < 5
    if (!isSize) {
        ElMessage.error('上传图片大小不能超过 5MB!')
        return false
    }
    if (!isJPG && !isPNG) {
        ElMessage.error('上传图片只能是 JPG/PNG 格式!')
        return false
    }
    return true
}
const businessId = ref('')
const httpRequest = async ({ file }) => {
    businessId.value = crypto.randomUUID()
    const fileRes = await uploadFile(file, { businessId: businessId.value })
    if (fileRes) {
        imgUrl.value = `${fileBaseUrl}${fileRes.filePath}`
        formData.value.coverImage = fileRes.filePath
    } else {
        throw new Error('上传失败')
    }
}
const handleRemoveImage = () => {
    imgUrl.value = ''
    formData.value.coverImage = ''
}
const handleContentChange = (data) => {
    nextTick(() => {
        formData.value.content = data.html
    })
}
const editorInstance = ref(null)
const handleEditorCreated = (editor) => {
    editorInstance.value = editor
    // 编辑时，设置文章内容
    if (formData.value.content && editor) {
        editor.setHtml(formData.value.content)
    }
}
const btnPreview = ref(false)

const rules = ref({
    title: [
        { required: true, message: '请输入文章标题', trigger: 'blur' }
        , { max: 200, message: '文章标题最多200个字符', trigger: 'blur' }
    ],
    categoryId: [
        { required: true, message: '请选择分类', trigger: 'blur' }
    ],
    summary: [
        { required: true, message: '请输入文章摘要', trigger: 'blur' }
        , { max: 1000, message: '文章摘要最多1000个字符', trigger: 'blur' }
    ],
    tags: [
        { message: '请输入文章标签', trigger: 'blur' }
        , { max: 200, message: '文章标签最多200个字符', trigger: 'blur' }
    ],
    content: [
        { message: '请输入文章内容', trigger: 'blur' }
        , { max: 5000, message: '文章内容最多5000个字符', trigger: 'blur' }
    ]
})
const formRef = ref()
const loading = ref(false)
const handleSubmit = async () => {
    formRef.value.validate(async (valid, fileds) => {
        if (valid) {
            loading.value = true
            try {
                const submitData = {
                    ...formData.value,
                    tags: formData.value.tagArray?.join(',') || ''
                }
                delete submitData.tagArray

                if (!idEdit.value) {
                    // 新增
                    submitData.id = businessId.value
                    await createArticle(submitData)
                    ElMessage.success('创建文章成功')
                } else {
                    // 编辑
                    await updateArticle(formData.value.id, submitData)
                    ElMessage.success('更新文章成功')
                }
                emit('success')
                dialogVisible.value = false
            } catch (error) {
                ElMessage.error('操作失败，请重试')
                console.error('文章操作失败:', error)
            } finally {
                loading.value = false
            }
        }
    })
}

</script>

<style scoped>
.cover-upload {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
}

.cover-placeholder {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 200px;
    height: 120px;
    color: #8b949e;
    background: #f6f8fa;
    border: 1px solid #ccc;
    border-radius: 5px;
}

.cover-placeholder p {
    margin: 0;
}

.cover-image {
    width: 200px;
    height: 120px;
    object-fit: cover;
}
</style>