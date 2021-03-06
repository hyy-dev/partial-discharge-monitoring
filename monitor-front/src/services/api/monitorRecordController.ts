// @ts-ignore
/* eslint-disable */
import { request } from 'umi';

/** 获取监测记录 GET /record */
export async function getRecordUsingGET7(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getRecordUsingGET7Params,
  options?: { [key: string]: any },
) {
  return request<API.getRecordUsingGET7Result>('/api/record', {
    method: 'GET',
    params: {
      ...params,
    },
    headers: {
      'Cache-Control': 'public;max-age:3600',
    },
    ...(options || {}),
  });
}
