import request from '@/utils/request'

export function list(query) {
  return request({
    url: '/sys-permission/list',
    method: 'get',
    params: query
  })
}

export function getMenusGroup(query) {
  return request({
    url: '/sys-permission/getGroup/' + query,
    method: 'get'
  })
}

export function getPermission(id) {
  return request({
    url: '/sys-permission/getById/' + id,
    method: 'get'
  })
}

export function updateOrSaveData(data) {
  return request({
    url: '/sys-permission/updateOrSave',
    method: 'put',
    data: data
  })
}

export function delPermission(id) {
  return request({
    url: '/sys-permission/del/' + id,
    method: 'delete'
  })
}
