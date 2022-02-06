// @ts-ignore
/* eslint-disable */
import { request } from 'umi';

/** 获取报警信息 GET /alarm */
export async function getAlarmUsingGET7(options?: { [key: string]: any }) {
  return request<string>('/alarm', {
    method: 'GET',
    ...(options || {}),
  });
}

/** 获取报警详情列表 GET /alarms */
export async function getAlarmsUsingGET7(options?: { [key: string]: any }) {
  return request<string>('/api/alarms', {
    method: 'GET',
    ...(options || {}),
  });
}

/** 更新报警状态 POST /alarms/update */
export async function getAlarmsUsingPOST7(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getAlarmsUsingPOST7Params,
  options?: { [key: string]: any },
) {
  return request<string>('/alarms/update', {
    method: 'POST',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}
