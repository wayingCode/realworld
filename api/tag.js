import { request } from '@/plugins/request'

// 获取所有的文章标签列表
export const getTags = () => {
  return request({
    method: 'GET',
    url: '/api/tags'
  })
}

