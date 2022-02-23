import React, { MutableRefObject, useEffect, useRef, useState } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import ProTable, { ActionType, ProColumns } from '@ant-design/pro-table';
import {
  getAlarmsUsingGET7 as getAlarms,
  updateAlarmUsingPOST7 as updateAlarm,
} from '@/services/api/alarmRecordController';
import { Link } from '@umijs/preset-dumi/lib/theme';
import { Button, DatePicker, message, Tag, Tooltip } from 'antd';
import moment from 'moment';
import './index.less';
import { getDevicesUsingGET7 as getDevices } from '@/services/api/deviceController';
import { DrawerForm, ProFormSelect, ProFormText, ProFormTextArea } from '@ant-design/pro-form';
import record from '@/pages/Record';
import AlarmManageDrawer from '@/pages/AlarmManage/AlarmManageDrawer';
import AlarmDetailDrawer from '@/pages/AlarmManage/AlarmDetailDrawer';

// 轮询时间
const INTERVAL = 60 * 1000;

export const AlarmStatusConfig = {
  0: {
    label: '待处理',
    color: 'red',
  },
  1: {
    label: '已解决',
    color: 'green',
  },
  2: {
    label: '已忽略',
    color: 'blue',
  },
  3: {
    label: '未解决',
    color: 'orange',
  },
};

const AlarmManage: React.FC = (props) => {
  const ref = useRef<ActionType>();
  const [targetAlarm, setTargetAlarm] = useState<API.AlarmInfo>();
  const [alarmDetailDrawerVisible, setAlarmDetailDrawerVisible] = useState<boolean>(false);
  const [alarmManageDrawerVisible, setAlarmManageDrawerVisible] = useState<boolean>(false);
  const [alarmList, setAlarmList] = useState<API.AlarmInfo[]>([]);

  useEffect(() => {
    // 从消息栏进入页面，默认显示该报警详情
    if (props.location?.query?.target) {
      (async () => {
        const id = Number(props.location?.query?.target);
        const res = await getAlarms();
        setTargetAlarm(res.alarms?.find((val) => val.alarmId === id));
        setAlarmDetailDrawerVisible(true);
      })();
    }
  }, [props.location?.query?.target]);

  const columns: ProColumns<API.AlarmInfo> = [
    {
      title: '报警时间',
      dataIndex: 'createTime',
      colSize: 1.5,
      renderFormItem: () => {
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
      render: (dom: any, alarm: API.AlarmInfo) => {
        return <Link to={`/record/${alarm.deviceId}`}>{dom}</Link>;
      },
      fieldProps: { showSearch: true },
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
      filters: true,
      valueType: 'select',
      valueEnum: Object.keys(AlarmStatusConfig).reduce(
        (pre, cur) => ({ ...pre, [Number(cur)]: AlarmStatusConfig[cur].label }),
        {},
      ),
      render: (_: any, alarm: API.AlarmInfo) => (
        <Tooltip title={alarm.results ?? '暂无处理结果'} placement="bottom">
          <Tag color={AlarmStatusConfig[alarm.status]?.color}>
            {AlarmStatusConfig[alarm.status]?.label}
          </Tag>
        </Tooltip>
      ),
    },
    {
      title: '报警详情',
      valueType: 'option',
      render: (_: any, alarm: API.AlarmInfo) => (
        <a
          onClick={() => {
            setAlarmDetailDrawerVisible(true);
            setTargetAlarm(alarm);
          }}
        >
          查看报警文件
        </a>
      ),
    },
    {
      title: '操作',
      valueType: 'option',
      render: (_: any, alarm: API.AlarmInfo) => <AlarmManageDrawer alarm={alarm} tableRef={ref} />,
    },
  ];
  return (
    <PageContainer>
      <ProTable<API.AlarmInfo, API.PageParams>
        headerTitle="异常数据告警"
        rowKey="alarmId"
        search={{ labelWidth: 120 }}
        pagination={{ defaultPageSize: 10 }}
        columns={columns}
        actionRef={ref}
        polling={INTERVAL}
        request={async (params, sort, filter) => {
          const requestParams = {
            startTime: params.createTime?.[0],
            endTime: params.createTime?.[1],
            deviceId: params.deviceName ?? undefined,
          };
          const res = await getAlarms(requestParams);
          setAlarmList(res.alarms ?? []);
          const result =
            res.alarms?.filter(
              (val) => !filter.status || filter.status.includes('' + val.status),
            ) ?? [];
          return {
            data: result,
            success: res.code === 0,
          };
        }}
      />
      {targetAlarm && (
        <AlarmDetailDrawer
          alarm={targetAlarm}
          visible={alarmDetailDrawerVisible}
          setVisible={(v) => setAlarmDetailDrawerVisible(v)}
        />
      )}
      {/*{alarmManageDrawerVisible && (*/}
      {/*  <AlarmManageDrawer*/}
      {/*    alarm={targetAlarm}*/}
      {/*    tableRef={ref}*/}
      {/*    visible={alarmManageDrawerVisible}*/}
      {/*    setVisible={(v) => setAlarmManageDrawerVisible(v)}*/}
      {/*  />*/}
      {/*)}*/}
    </PageContainer>
  );
};

export default AlarmManage;
