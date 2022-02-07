// @ts-ignore
/* eslint-disable */
import { request } from 'umi';

/** 用户登录 返回token及用户身份信息 POST /login */
export async function loginUsingPOST7(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  data: API.LoginParams,
  options?: { [key: string]: any },
) {
  return request<API.LoginResult>('/api/login', {
    method: 'POST',
    // headers: {
    //   'Content-Type': 'multipart/form-data',
    // },
    // params: body,
    data,
    requestType: 'form',
    ...(options || {}),
  });
}

/** 用户注册 POST /register */
export async function registerUsingPOST7(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  data: API.RegisterParams,
  options?: { [key: string]: any },
) {
  return request<string>('/api/register', {
    method: 'POST',
    data,
    requestType: 'form',
    ...(options || {}),
  });
}
