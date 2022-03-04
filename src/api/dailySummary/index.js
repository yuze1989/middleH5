import http from '@/utils/http';

export function getStaffInfo() {
  return http.post('/scrm/comm/rest/tenant-staff/get-staff-info');
}

export default {};
