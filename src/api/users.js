import request from '@/utils/request'

export function list(query) {
  return request({
    url: '/sys-user/list',
    method: 'get',
    params: query
  })
}

export function get(id) {
  return request({
    url: '/sys-user/getById/' + id,
    method: 'get'
  })
}

export function updateOrSaveData(data) {
  return request({
    url: '/sys-user/updateOrSave',
    method: 'put',
    data: data
  })
}

export function del(id) {
  return request({
    url: '/sys-user/del/' + id,
    method: 'delete'
  })
}
