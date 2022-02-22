import { request } from 'umi';

/** 获取操作日志 GET /api/log */
export async function getLog(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: { alarmId: number },
  options?: { [key: string]: any },
) {
  return request<{ code: number; msg: string; error?: string; data?: API.LogInfo[]}>('/api/log', {
    method: 'GET',
    params: {...params},
    ...(options || {}),
  });
}
