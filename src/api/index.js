import http from '@/utils/http';

/**
 * 获取客户列表
 */
export function getCustomerList(params) {
  return http.post('/scrm/customer/listCustomer/all', params);
}

/**
 * 我的
 */
export function getUserInfo(params) {
  return http.post('/scrm/comm/rest/tenant-staff/get-by-token', params);
}
