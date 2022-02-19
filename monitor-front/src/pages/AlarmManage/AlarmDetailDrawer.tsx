import React, { ReactNode, useEffect, useState } from 'react';
import { DrawerForm } from '@ant-design/pro-form';
import { Drawer, Popover, Timeline } from 'antd';
import { useRequest } from '@@/plugin-request/request';
import { getAlarmsUsingGET7 as getAlarms } from '@/services/api/alarmRecordController';
import { AlarmStatusConfig } from '@/pages/AlarmManage/index';

type AlarmDetailDrawerProps = {
  alarm: API.AlarmInfo;
  visible: boolean;
  setVisible: (visible: boolean) => void;
};

const AlarmDetailDrawer: React.FC<AlarmDetailDrawerProps> = ({ alarm, visible, setVisible }) => {
  // const [visible, setVisible] = useState<boolean>(false);
  const { data, loading } = useRequest(
    () => {
      return getAlarms({ deviceId: alarm.deviceId });
    },
    { formatResult: (res) => res?.alarms, refreshDeps: [alarm.deviceId] },
  );

  return (
    <>
      <Drawer
        title={`${alarm.deviceName} 报警历史`}
        placement="right"
        onClose={() => setVisible(false)}
        visible={visible}
        contentWrapperStyle={{ width: '50%' }}
      >
        <Timeline mode="left">
          {data?.map((val) => (
            <Timeline.Item color={AlarmStatusConfig[val.status].color} label={val.createTime}>
              <Popover
                title={AlarmStatusConfig[val.status].label}
                content={val.results ?? '暂无处理结果'}
                placement="bottom"
              >
                {val.reason}
              </Popover>
            </Timeline.Item>
          ))}
        </Timeline>
      </Drawer>
    </>
  );
};

export default AlarmDetailDrawer;
