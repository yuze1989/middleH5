import http from '@/utils/http';

/**
 * 获取员工信息
 */
export function getStaffInfo() {
  return http.post('/scrm/comm/rest/tenant-staff/get-staff-info');
}

/**
 * 获取昨日概况数据
 */
export function getDetail(params) {
  return http.post('/scrm/comm/rest/daily-summary/detail', params);
}

/**
 * 获取我的排行
 * @param {Object} params
 * rankType: 1：昨日新增客户，2：昨日新入群客户，3：本周新增客户，4：本周新入群客户，5：当月新增客户，6：当月新入群客户，7：客户总数
 */
export function getMyRank(params) {
  return http.post('/scrm/comm/rest/daily-summary/my-rank', params);
}

/**
 * 获取排行列表
 * @param {Object} params
 * rankType: 1：昨日新增客户，2：昨日新入群客户，3：本周新增客户，4：本周新入群客户，5：当月新增客户，6：当月新入群客户，7：客户总数
 */
export function getRankList(params) {
  return http.post('/scrm/comm/rest/daily-summary/page-rank-list', params);
}

/**
 * 查询我的客户统计
 * @param {Object} params
 */
export function getCustomerStatistics(params) {
  return http.post('/scrm/comm/rest/daily-summary/my-customer-statistics', params);
}

/**
 * 查询我的群聊统计
 * @param {Object} params
 */
export function getGroupStatistics(params) {
  return http.post('/scrm/comm/rest/daily-summary/my-group-statistics', params);
}

/**
 * 查询我的聊天统计
 * @param {Object} params
 */
export function getChatStatistics(params) {
  return http.post('/scrm/comm/rest/daily-summary/my-chat-statistics', params);
}

/**
 * 查询我的朋友圈统计
 * @param {Object} params
 */
export function getWechatStatistics(params) {
  return http.post('/scrm/comm/rest/daily-summary/my-wechat-moments-statistics', params);
}

/**
 * 获取员工列表
 */
export function getDepartments() {
  return http.post('/scrm/comm/rest/tenant-staff/get-all-departments-tree');
}

/**
 * 获取客户列表
 */
export function getCustomerList(params) {
  return http.post('/customer/listCustomer/all', params);
}

export default {};
