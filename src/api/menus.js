import request from '@/utils/request'

export function list(query) {
  return request({
    url: '/sys-permission/list',
    method: 'get',
    params: query
  })
}

export function roleGroup(query) {
  return request({
    url: '/sys-role/getRoleGroup',
    method: 'get',
    params: query
  })
}

export function getRole(id) {
  return request({
    url: '/sys-role/getById/' + id,
    method: 'get'
  })
}

export function updateOrSaveData(data) {
  return request({
    url: '/sys-role/updateOrSave',
    method: 'put',
    data: data
  })
}

export function delRole(id) {
  return request({
    url: '/sys-role/del/' + id,
    method: 'delete'
  })
}
