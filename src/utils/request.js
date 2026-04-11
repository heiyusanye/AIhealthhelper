import { ElMessage } from 'element-plus'

// 模拟 axios 实例
const service = {
  get: (url, config = {}) => {
    return new Promise((resolve, reject) => {
      // 模拟网络延迟
      setTimeout(() => {
        fetch('/mock/data.json')
          .then(response => response.json())
          .then(data => {
            const mockData = data.mockData
            let response
            
            // 根据URL返回对应数据
            switch (url) {
              case '/user/login':
                response = mockData.userLogin
                break
              case '/user/add':
                response = mockData.userAdd
                break
              case '/user/logout':
                response = mockData.userLogout
                break
              case '/knowledge/category/tree':
                response = mockData.knowledgeCategoryTree
                break
              case '/knowledge/article/page':
                // 处理筛选参数
                if (config.params) {
                  let filteredRecords = [...mockData.knowledgeArticlePage.data.records]
                  
                  // 按标题筛选
                  if (config.params.title) {
                    filteredRecords = filteredRecords.filter(record => 
                      record.title.includes(config.params.title)
                    )
                  }
                  
                  // 按分类筛选
                  if (config.params.categoryId) {
                    filteredRecords = filteredRecords.filter(record => 
                      record.categoryId === parseInt(config.params.categoryId)
                    )
                  }
                  
                  // 按状态筛选
                  if (config.params.status !== undefined) {
                    filteredRecords = filteredRecords.filter(record => 
                      record.status === parseInt(config.params.status)
                    )
                  }
                  
                  // 处理分页
                  const page = config.params.currentPage || 1
                  const size = config.params.size || 10
                  const start = (page - 1) * size
                  const end = start + size
                  const paginatedRecords = filteredRecords.slice(start, end)
                  
                  response = {
                    code: '200',
                    data: {
                      total: filteredRecords.length,
                      records: paginatedRecords
                    },
                    msg: '获取成功'
                  }
                } else {
                  response = mockData.knowledgeArticlePage
                }
                break
              case '/psychological-chat/sessions':
                response = mockData.psychologicalChatSessions
                break
              case '/psychological-chat/sessions/1/messages':
                response = mockData.psychologicalChatMessages
                break
              case '/psychological-chat/session/1/emotion':
                response = mockData.psychologicalChatEmotion
                break
              case '/emotion-diary/admin/page':
                // 处理筛选参数
                if (config.params) {
                  let filteredRecords = [...mockData.emotionDiaryAdminPage.data.records]
                  
                  // 按用户ID筛选
                  if (config.params.userId) {
                    filteredRecords = filteredRecords.filter(record => 
                      record.userId === parseInt(config.params.userId)
                    )
                  }
                  
                  // 按情绪评分范围筛选
                  if (config.params.minMoodScore && config.params.maxMoodScore) {
                    filteredRecords = filteredRecords.filter(record => 
                      record.emotionScore >= parseInt(config.params.minMoodScore) && 
                      record.emotionScore <= parseInt(config.params.maxMoodScore)
                    )
                  }
                  
                  // 处理分页
                  const page = config.params.current || 1
                  const size = config.params.size || 10
                  const start = (page - 1) * size
                  const end = start + size
                  const paginatedRecords = filteredRecords.slice(start, end)
                  
                  // 转换字段名以匹配前端期望
                  const transformedRecords = paginatedRecords.map(record => ({
                    ...record,
                    moodScore: record.emotionScore,
                    diaryDate: record.createdAt.split(' ')[0],
                    sleepQuality: Math.floor(Math.random() * 5) + 1,
                    stressLevel: Math.floor(Math.random() * 5) + 1,
                    emotionTriggers: record.triggerFactor,
                    diaryContent: record.content,
                    username: record.userNickname,
                    nickname: record.userNickname,
                    aiEmotionAnalysis: JSON.stringify({
                      primaryEmotion: record.emotionScore >= 7 ? '快乐' : record.emotionScore >= 4 ? '平静' : '焦虑',
                      emotionScore: Math.floor(Math.random() * 100),
                      riskLevel: record.emotionScore >= 7 ? '低' : record.emotionScore >= 4 ? '中' : '高',
                      isNegative: record.emotionScore < 4,
                      suggestion: '保持积极心态，适当运动，注意休息。',
                      riskDescription: record.emotionScore < 4 ? '情绪状态较低，建议关注' : '情绪状态良好',
                      improvementSuggestions: [
                        '每天进行30分钟有氧运动',
                        '保持规律的作息时间',
                        '与朋友或家人交流感受'
                      ]
                    })
                  }))
                  
                  response = {
                    code: '200',
                    data: {
                      total: filteredRecords.length,
                      records: transformedRecords
                    },
                    msg: '获取成功'
                  }
                } else {
                  // 转换默认数据的字段名
                  const transformedRecords = mockData.emotionDiaryAdminPage.data.records.map(record => ({
                    ...record,
                    moodScore: record.emotionScore,
                    diaryDate: record.createdAt.split(' ')[0],
                    sleepQuality: Math.floor(Math.random() * 5) + 1,
                    stressLevel: Math.floor(Math.random() * 5) + 1,
                    emotionTriggers: record.triggerFactor,
                    diaryContent: record.content,
                    username: record.userNickname,
                    nickname: record.userNickname,
                    aiEmotionAnalysis: JSON.stringify({
                      primaryEmotion: record.emotionScore >= 7 ? '快乐' : record.emotionScore >= 4 ? '平静' : '焦虑',
                      emotionScore: Math.floor(Math.random() * 100),
                      riskLevel: record.emotionScore >= 7 ? '低' : record.emotionScore >= 4 ? '中' : '高',
                      isNegative: record.emotionScore < 4,
                      suggestion: '保持积极心态，适当运动，注意休息。',
                      riskDescription: record.emotionScore < 4 ? '情绪状态较低，建议关注' : '情绪状态良好',
                      improvementSuggestions: [
                        '每天进行30分钟有氧运动',
                        '保持规律的作息时间',
                        '与朋友或家人交流感受'
                      ]
                    })
                  }))
                  
                  response = {
                    code: '200',
                    data: {
                      total: mockData.emotionDiaryAdminPage.data.total,
                      records: transformedRecords
                    },
                    msg: '获取成功'
                  }
                }
                break
              case '/data-analytics/overview':
                // 构造符合前端期望的数据结构
                response = {
                  code: '200',
                  data: {
                    systemOverview: {
                      totalUsers: mockData.dataAnalyticsOverview.data.userCount,
                      activeUsers: Math.floor(mockData.dataAnalyticsOverview.data.userCount * 0.7),
                      totalDiaries: mockData.dataAnalyticsOverview.data.diaryCount,
                      todayNewDiaries: 20,
                      totalSessions: mockData.dataAnalyticsOverview.data.sessionCount,
                      todayNewSessions: 50,
                      avgMoodScore: 7.5
                    },
                    consultationStats: {
                      totalSessions: mockData.dataAnalyticsOverview.data.sessionCount,
                      avgDurationMinutes: 30,
                      dailyTrend: [
                        { date: '1月1日', sessionCount: 120, userCount: 80 },
                        { date: '1月2日', sessionCount: 150, userCount: 100 },
                        { date: '1月3日', sessionCount: 130, userCount: 90 },
                        { date: '1月4日', sessionCount: 140, userCount: 95 },
                        { date: '1月5日', sessionCount: 160, userCount: 110 }
                      ]
                    },
                    emotionTrend: [
                      { date: '1月1日', avgMoodScore: 7.2, recordCount: 120 },
                      { date: '1月2日', avgMoodScore: 6.8, recordCount: 130 },
                      { date: '1月3日', avgMoodScore: 7.5, recordCount: 110 },
                      { date: '1月4日', avgMoodScore: 7.0, recordCount: 140 },
                      { date: '1月5日', avgMoodScore: 7.3, recordCount: 150 }
                    ],
                    userActivity: [
                      { date: '1月1日', activeUsers: 700, newUsers: 50, diaryUsers: 400, consultationUsers: 300 },
                      { date: '1月2日', activeUsers: 750, newUsers: 60, diaryUsers: 450, consultationUsers: 350 },
                      { date: '1月3日', activeUsers: 720, newUsers: 45, diaryUsers: 420, consultationUsers: 320 },
                      { date: '1月4日', activeUsers: 780, newUsers: 55, diaryUsers: 480, consultationUsers: 380 },
                      { date: '1月5日', activeUsers: 800, newUsers: 70, diaryUsers: 500, consultationUsers: 400 }
                    ]
                  },
                  msg: '获取成功'
                }
                break
              default:
                // 处理动态路径
                if (url.startsWith('/knowledge/article/')) {
                  const id = url.split('/')[3]
                  const article = mockData.knowledgeArticles.find(a => a.id === parseInt(id))
                  if (article) {
                    response = {
                      code: '200',
                      data: article,
                      msg: '获取成功'
                    }
                  } else {
                    response = {
                      code: '404',
                      data: null,
                      msg: '文章不存在'
                    }
                  }
                } else {
                  response = {
                    code: '404',
                    data: null,
                    msg: '接口不存在'
                  }
                }
            }
            
            if (response.code === '200') {
              resolve(response.data)
            } else {
              ElMessage.error(response.msg || '请求失败')
              reject(response.msg || '网络请求失败')
            }
          })
          .catch(error => {
            console.error('获取mock数据失败:', error)
            ElMessage.error('获取数据失败')
            reject('网络请求失败')
          })
      }, 300)
    })
  },
  post: (url, loginData = {}) => {
    // 处理AI咨询流式回复
    if (url === '/psychological-chat/stream') {
      // 直接返回，由fetchEventSource处理
      return null
    }
    
    return new Promise((resolve, reject) => {
      // 模拟网络延迟
      setTimeout(() => {
        fetch('/mock/data.json')
          .then(response => response.json())
          .then(data => {
            const mockData = data.mockData
            let response
            
            // 根据URL返回对应数据
            switch (url) {
              case '/user/login':
                // 根据用户名返回不同的userType
                if (loginData.username === 'admin') {
                  response = {
                    code: '200',
                    data: {
                      token: 'mock-token-admin-123456',
                      userInfo: {
                        id: 1,
                        username: 'admin',
                        nickname: '系统管理员',
                        userType: 2
                      }
                    },
                    msg: '登录成功'
                  }
                } else if (loginData.username === 'allen') {
                  response = {
                    code: '200',
                    data: {
                      token: 'mock-token-allen-123456',
                      userInfo: {
                        id: 2,
                        username: 'allen',
                        nickname: '普通用户',
                        userType: 1
                      }
                    },
                    msg: '登录成功'
                  }
                } else {
                  response = mockData.userLogin
                }
                break
              case '/user/logout':
                response = mockData.userLogout
                break
              case '/user/add':
                response = mockData.userAdd
                break
              case '/file/upload':
                response = mockData.fileUpload
                break
              case '/knowledge/article':
                response = mockData.knowledgeArticleCreate
                break
              case '/psychological-chat/session/start':
                response = mockData.psychologicalChatStart
                break
              case '/emotion-diary':
                response = mockData.emotionDiary
                break
              case '/psychological-chat/stream':
                response = mockData.psychologicalChatStream
                break
              default:
                response = {
                  code: '404',
                  data: null,
                  msg: '接口不存在'
                }
            }
            
            if (response.code === '200') {
              resolve(response.data)
            } else {
              ElMessage.error(response.msg || '请求失败')
              reject(response.msg || '网络请求失败')
            }
          })
          .catch(error => {
            console.error('获取mock数据失败:', error)
            ElMessage.error('获取数据失败')
            reject('网络请求失败')
          })
      }, 300)
    })
  },
  put: (url, data = {}) => {
    return new Promise((resolve, reject) => {
      // 模拟网络延迟
      setTimeout(() => {
        fetch('/mock/data.json')
          .then(response => response.json())
          .then(data => {
            const mockData = data.mockData
            let response
            
            // 根据URL返回对应数据
            switch (url) {
              case '/knowledge/article/1':
                response = mockData.knowledgeArticleUpdate
                break
              case '/knowledge/article/1/status':
                response = mockData.knowledgeArticleStatus
                break
              default:
                response = {
                  code: '404',
                  data: null,
                  msg: '接口不存在'
                }
            }
            
            if (response.code === '200') {
              resolve(response.data)
            } else {
              ElMessage.error(response.msg || '请求失败')
              reject(response.msg || '网络请求失败')
            }
          })
          .catch(error => {
            console.error('获取mock数据失败:', error)
            ElMessage.error('获取数据失败')
            reject('网络请求失败')
          })
      }, 300)
    })
  },
  delete: (url) => {
    return new Promise((resolve, reject) => {
      // 模拟网络延迟
      setTimeout(() => {
        fetch('/mock/data.json')
          .then(response => response.json())
          .then(data => {
            const mockData = data.mockData
            let response
            
            // 根据URL返回对应数据
            switch (url) {
              case '/user/logout':
                response = mockData.userLogout
                break
              case '/knowledge/article/1':
                response = mockData.knowledgeArticleDelete
                break
              case '/psychological-chat/sessions/1':
                response = mockData.psychologicalChatDelete
                break
              case '/emotion-diary/admin/1':
                response = mockData.emotionDiaryAdminDelete
                break
              default:
                response = {
                  code: '404',
                  data: null,
                  msg: '接口不存在'
                }
            }
            
            if (response.code === '200') {
              resolve(response.data)
            } else {
              ElMessage.error(response.msg || '请求失败')
              reject(response.msg || '网络请求失败')
            }
          })
          .catch(error => {
            console.error('获取mock数据失败:', error)
            ElMessage.error('获取数据失败')
            reject('网络请求失败')
          })
      }, 300)
    })
  }
}

export default service