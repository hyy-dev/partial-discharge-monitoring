import React from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import ProTable, { ProColumns } from '@ant-design/pro-table';
import { getAlarmsUsingGET7 as getAlarms } from '@/services/api/alarmRecordController';
import { Link } from '@umijs/preset-dumi/lib/theme';
import { Button, DatePicker, Tag } from 'antd';
import moment from 'moment';
import './index.less';

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

const columns: ProColumns<API.AlarmInfo> = [
  {
    title: '报警时间',
    dataIndex: 'createTime',
    colSize: 2,
    renderFormItem: (item, props, form) => {
      return (
        <DatePicker.RangePicker
          showTime={{ format: 'HH:mm' }}
          format="YYYY-MM-DD HH:mm"
          // defaultValue={[
          //   moment('2021-01-01 00:00:00', 'YYYY-MM-DD HH:mm:ss'),
          //   moment('2021-02-15 00:00:00', 'YYYY-MM-DD HH:mm:ss'),
          // ]}
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
  },
  {
    title: '报警原因',
    dataIndex: 'reason',
  },
  {
    title: '报警状态',
    dataIndex: 'status',
    valueType: 'select',
    valueEnum: {
      0: '待处理',
      1: '已解决',
      2: '已忽略',
      3: '未解决',
    },
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
    render: (_: any, record: API.AlarmInfo) => [
      <a
        onClick={() => {
          console.log('报警处理：', record);
        }}
      >
        报警处理
      </a>,
    ],
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
          const res = await getAlarms();
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
