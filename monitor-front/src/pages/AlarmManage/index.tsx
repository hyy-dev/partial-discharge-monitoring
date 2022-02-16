import React, { useEffect } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import ProTable, { ProColumns } from '@ant-design/pro-table';
import {getAlarmsUsingGET7 as getAlarms, updateAlarmUsingPOST7 as updateAlarm} from '@/services/api/alarmRecordController';
import { Link } from '@umijs/preset-dumi/lib/theme';
import { Button, DatePicker, message, Tag } from 'antd';
import moment from 'moment';
import './index.less';
import { getDevicesUsingGET7 as getDevices } from '@/services/api/deviceController';
import {DrawerForm, ProFormSelect, ProFormText, ProFormTextArea} from '@ant-design/pro-form';
import record from '@/pages/Record';

const statusSelectConfig = {
  0: '待处理',
  1: '已解决',
  2: '已忽略',
  3: '未解决',
};

const statusConfigMap = [
  {
    color: 'red',
    content: '待处理',
  },
  {
    color: 'green',
    content: '已解决',
  },
  {
    color: 'grey',
    content: '已忽略',
  },
  {
    color: 'orange',
    content: '未解决',
  },
];

const AlarmManageForm: React.FC<{ alarm: API.AlarmInfo }> = ({ alarm }) => {
  return (
    <DrawerForm
      title="报警处理"
      trigger={<a>报警处理</a>}
      autoFocusFirstInput
      drawerProps={{
        destroyOnClose: true,
      }}
      onFinish={async (values) => {
        console.log(values);
        const res = await updateAlarm({ alarmId: alarm.alarmId,
          status: values.status ?? alarm.status,
          results: values.results ?? alarm.results
        });
        if(res.code === 0) {
          message.success(res.msg);
          return true;
        }else {
          message.error(res.msg);
          return false;
        }
      }}
    >
      <ProFormSelect
        options={new Array(4).fill(0).map((_, index) => ({
          label: statusSelectConfig[index],
          value: index,
        }))}
        name="status"
        label="报警状态"
        fieldProps={{
          defaultValue: alarm.status,
        }}
      />
      <ProFormTextArea
        name="results"
        label="处理结果"
        fieldProps={{
          defaultValue: alarm.results,
          rows: 4
        }}
        placeholder="请输入处理结果"
      ></ProFormTextArea>
    </DrawerForm>
  );
};

const columns: ProColumns<API.AlarmInfo> = [
  {
    title: '报警时间',
    dataIndex: 'createTime',
    colSize: 1.5,
    renderFormItem: (item, props, form) => {
      return (
        <DatePicker.RangePicker
          showTime={{ format: 'HH:mm' }}
          format="YYYY-MM-DD HH:mm"
          placeholder={['开始时间', '结束时间']}
        />
      );
    },
  },
  {
    title: '设备名称',
    dataIndex: 'deviceName',
    render: (dom: any, record: API.AlarmInfo) => {
      return <Link to={`/record/${record.deviceId}`}>{dom}</Link>;
    },
    colSize: 1.5,
    valueType: 'select',
    request: async () => {
      const res: API.getDevicesResult = await getDevices();
      if (res.code === 0) {
        return res.data?.map(({ name, deviceId }) => ({
          label: name,
          value: deviceId,
        }));
      }
      return [{ label: '全部', value: 'all' }];
    },
  },
  {
    title: '报警原因',
    dataIndex: 'reason',
    hideInSearch: true,
  },
  {
    title: '报警状态',
    dataIndex: 'status',
    hideInSearch: true,
    valueType: 'select',
    valueEnum: statusSelectConfig,
    render: (_: any, record: API.AlarmInfo) => {
      return (
        <Tag color={statusConfigMap[record.status]?.color}>
          {statusConfigMap[record.status]?.content}
        </Tag>
      );
    },
  },
  {
    title: '报警详情',
    valueType: 'option',
    render: (_: any, record: API.AlarmInfo) => [<a>查看报警文件</a>],
  },
  {
    title: '操作',
    valueType: 'option',
    render: (_: any, record: API.AlarmInfo) => <AlarmManageForm alarm={record} />,
  },
];

const AlarmManage: React.FC = () => {
  return (
    <PageContainer>
      <ProTable<API.AlarmInfo, API.PageParams>
        headerTitle="异常数据告警"
        rowKey="alarmId"
        search={{ labelWidth: 120 }}
        pagination={{ defaultPageSize: 10 }}
        columns={columns}
        request={async (params, sort) => {
          console.log('params:', params);
          const requestParams = {
            startTime: params.createTime?.[0],
            endTime: params.createTime?.[1],
            deviceId: params.deviceName ?? undefined,
          };
          console.log('request params', requestParams);
          const res = await getAlarms(requestParams);
          return {
            data: res.alarms,
            success: res.code === 0,
          };
        }}
      />
    </PageContainer>
  );
};

export default AlarmManage;
