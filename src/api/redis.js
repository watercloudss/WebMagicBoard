import request from '@/utils/request'

// 获取服务信息
export function getRedis() {
  return request({
    url: '/sys-redis/redis',
    method: 'get'
  })
}

