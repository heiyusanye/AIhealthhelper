<template>
    <div class="knowledge-article">
        <PageHead title="知识文章">
            <template #buttons>
                <el-button @click="handleEdit" type="primary">新增</el-button>
            </template>
        </PageHead>
        <TableForm :formItem="formItem" @search="handleSearch" />
        <el-table :data="tableData" style="width: 100%;margin-top: 20px;">
            <el-table-column label="文章标题" fixed="left" width="240">
                <template #default="scope">
                    <div style="display: flex;align-items: center;">
                        <el-icon>
                            <timer />
                        </el-icon>
                        <span>{{ scope.row.title }}</span>
                    </div>
                </template>
            </el-table-column>
            <el-table-column label="分类" width="200">
                <template #default="scope">
                    <div style="display: flex;align-items: center;">
                        <el-icon>
                            <timer />
                        </el-icon>
                        <span>{{ categoryOptions[scope.row.categoryId] }}</span>
                    </div>
                </template>
            </el-table-column>
            <el-table-column prop="authorName" label="作者" width="150" />
            <el-table-column prop="readCount" label="阅读量" width="150" />
            <el-table-column prop="updatedAt" label="发布时间" width="150" />
            <el-table-column label="操作" width="240" fixed="right">
                <template #default="scope">
                    <el-button text type="primary" @click="handleEdit(scope.row)">编辑</el-button>
                    <el-button text @click="handlePublish(scope.row)"
                        v-if="scope.row.status === 0 || scope.row.status === 2" type="success">发布</el-button>
                    <el-button text @click="handleOffline(scope.row)" v-if="scope.row.status === 1"
                        type="danger">下线</el-button>
                    <el-button text @click="handleDelete(scope.row)" type="danger">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-pagination layout="total, sizes, prev, pager, next, jumper" :total="pagination.total"
            :page-size="pagination.size" @change="handleChange" @size-change="handleSizeChange"
            style="margin-top: 25px;" />
        <ArtcileDialog v-model="dialogVisible" :categoryList="categoryList" @success="handleSuccess"
            :currentArticle="currentArticle" />
    </div>
</template>
<script setup>
import { onMounted, reactive, ref } from 'vue'
import PageHead from '@/components/PageHead.vue';
import TableForm from '@/components/TableForm.vue';
import { categoryTree, articlePage, getArticleDetail, deleteArticle } from '@/api/admin';
import ArtcileDialog from '@/components/ArtcileDialog.vue';
import { ElMessageBox, ElMessage } from 'element-plus'
import { changeArticleStatus } from '@/api/admin.js'
const dialogVisible = ref(false)
const formItem = [
    {
        label: '文章标题',
        prop: 'title',
        type: 'input',
        placeholder: '请输入文章标题'
    },
    {
        type: 'select',
        prop: 'categoryId',
        label: '分类',
        placeholder: '请选择分类',
    },
    {
        type: 'select',
        prop: 'status',
        label: '状态',
        placeholder: '请选择状态',
        options: [
            {
                label: '草稿',
                value: 0
            },
            {
                label: '已发布',
                value: 1
            },
            {
                label: '已下线',
                value: 2
            }
        ]
    }
]

const pagination = reactive({
    total: 0,
    size: 10,
    currentPage: 1
})
const handleSearch = async (formData) => {

    const params = {
        ...pagination,
        ...formData,
    }
    const { records, total } = await articlePage(params)
    tableData.value = records
    pagination.total = total
}
const handleChange = (page) => {
    pagination.currentPage = page
    handleSearch({})
}
const handleSizeChange = (size) => {
    pagination.size = size
    handleSearch({})
}
// 分类选项
const categoryOptions = reactive({})
const categoryList = ref([])
const tableData = ref([])
onMounted(async () => {
    const data = await categoryTree()
    categoryList.value = data.map(item => {
        categoryOptions[item.id] = item.categoryName
        return {
            label: item.categoryName,
            value: item.id
        }
    })
    formItem[1].options = categoryList.value
    handleSearch({})
})
const handleSuccess = () => {
    dialogVisible.value = false
    handleSearch({})
}
const currentArticle = ref({})
const handleEdit = (row) => {
    if (!row.id) {
        currentArticle.value = {}
        dialogVisible.value = true
        return
    }
    getArticleDetail(row.id).then(res => {
        dialogVisible.value = true
        currentArticle.value = res
    })
}
const handlePublish = (row) => {
    ElMessageBox.confirm(`确认发布文章${row.title}吗？`, '提示', {
        confirmButtonText: '确定发布',
        cancelButtonText: '取消',
        type: 'info'
    }).then(() => {
        changeArticleStatus(row.id, { status: 1 }).then(res => {
            if (res.code === '200') {
                ElMessage.success('发布成功')
                handleSearch({})
            }
        })
    })
}
const handleOffline = (row) => {
    ElMessageBox.confirm(`确认下线文章${row.title}吗？`, '提示', {
        confirmButtonText: '确定下线',
        cancelButtonText: '取消',
        type: 'info'
    }).then(() => {
        changeArticleStatus(row.id, { status: 2 }).then(res => {
            if (res.code === '200') {
                ElMessage.success('下线成功')
                handleSearch({})
            }
        })
    })
}
const handleDelete = (row) => {
    ElMessageBox.confirm(`确认删除文章${row.title}吗？`, '提示', {
        confirmButtonText: '确定删除',
        cancelButtonText: '取消',
        type: 'danger'
    }).then(() => {
        deleteArticle(row.id).then(res => {
            if (res.code === '200') {
                ElMessage.success('删除成功')
                handleSearch({})
            }
        })
    })
}

</script>