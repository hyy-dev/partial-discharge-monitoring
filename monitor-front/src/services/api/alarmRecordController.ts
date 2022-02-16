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
export async function getAlarmsUsingGET7(
  params?: { startTime?: string; endTime?: string; deviceId?: number;},
  options?: { [key: string]: any }) {
  return request<{ code: number; msg: string; alarms?: API.AlarmInfo[] }>('/api/alarms', {
    method: 'GET',
    params: {
      ...params
    },
    ...(options || {}),
  });
}

/** 更新报警状态 POST /alarms/update */
export async function updateAlarmUsingPOST7(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  data: { alarmId: number; status: number; results: string;},
  options?: { [key: string]: any },
) {
  return request<{ code: number; msg: string; }>('/api/alarms/update', {
    method: 'POST',
    data,
    requestType: 'form',
    ...(options || {}),
  });
}
