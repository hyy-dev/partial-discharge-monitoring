// @ts-ignore
/* eslint-disable */
import { request } from 'umi';

/** 增加设备 POST /addDevice */
export async function addDeviceUsingPOST7(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.addDeviceUsingPOST7Params,
  options?: { [key: string]: any },
) {
  return request<string>('/api/addDevice', {
    method: 'POST',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 根据id删除设备 DELETE /deleteDevice/${param0} */
export async function deleteDeviceUsingDELETE7(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.deleteDeviceUsingDELETE7Params,
  options?: { [key: string]: any },
) {
  const { id: param0, ...queryParams } = params;
  return request<string>(`/api/deleteDevice/${param0}`, {
    method: 'DELETE',
    params: { ...queryParams },
    ...(options || {}),
  });
}

/** 根据id查询设备 GET /device/${param0} */
export async function getDeviceByIdUsingGET7(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getDeviceByIdUsingGET7Params,
  options?: { [key: string]: any },
) {
  const { id: param0, ...queryParams } = params;
  return request<string>(`/api/device/${param0}`, {
    method: 'GET',
    params: { ...queryParams },
    ...(options || {}),
  });
}

/** 获取设备列表 GET /devices */
export async function getDevicesUsingGET7(options?: { [key: string]: any }) {
  return request<API.getDevicesResult>('/api/devices', {
    method: 'GET',
    ...(options || {}),
  });
}

/** 根据设备名称查询 GET /devices/${param0} */
export async function getDeviceByNameUsingGET7(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getDeviceByNameUsingGET7Params,
  options?: { [key: string]: any },
) {
  const { name: param0, ...queryParams } = params;
  return request<string>(`/api/devices/${param0}`, {
    method: 'GET',
    params: { ...queryParams },
    ...(options || {}),
  });
}

/** 更新设备信息 POST /updateDevice */
export async function updateDeviceUsingPOST7(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  data: API.DeviceInfo,
  token: string,
  options?: { [key: string]: any },
) {
  return request<string>('/api/updateDevice', {
    method: 'POST',
    data,
    requestType: 'form',
    headers: {
      Authorization: token
    },
    ...(options || {}),
  });
}
