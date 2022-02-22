import React, { MutableRefObject } from 'react';
import { ActionType } from '@ant-design/pro-table';
import { DrawerForm, ProFormSelect, ProFormTextArea } from '@ant-design/pro-form';
import { updateAlarmUsingPOST7 as updateAlarm } from '@/services/api/alarmRecordController';
import { message, Popover, Timeline } from 'antd';
import { AlarmStatusConfig } from '@/pages/AlarmManage/index';
import { useModel } from 'umi';
import { useRequest } from '@@/plugin-request/request';
import { getLog } from '@/services/api/OperationLogController';

const AlarmManageDrawer: React.FC<{
  alarm: API.AlarmInfo;
  tableRef: MutableRefObject<ActionType | undefined>;
}> = ({ alarm, tableRef}) => {
  const { initialState } = useModel('@@initialState');
  const { data: logData, run: updateLog } = useRequest(() => getLog({ alarmId: alarm.alarmId }));

  return (
    <DrawerForm
      title="报警处理"
      trigger={<a>报警处理</a>}
      autoFocusFirstInput
      drawerProps={{
        destroyOnClose: true,
      }}
      onFinish={async (values) => {
        const user = initialState?.currentUser;
        const res = await updateAlarm({ ...alarm, userName: user?.userName ?? '', ...values });
        if (res.code === 0) {
          message.success(res.msg);
          tableRef?.current?.reload();
          await updateLog();
          return true;
        } else {
          message.error(res.msg);
          return false;
        }
      }}
    >
      <div>
        <p>操作日志</p>
        {logData?.length ? (
          <Timeline mode="left">
            {logData?.map((val) => (
              <Timeline.Item
                color={AlarmStatusConfig[val.status].color}
                label={val.operateTime + ` 操作人：${val.userName}`}
              >
                <Popover content={AlarmStatusConfig[val.status].label} placement="bottom">
                  {val.results}
                </Popover>
              </Timeline.Item>
            ))}
            <Timeline.Item color="red" label={alarm.createTime + ' 系统告警'}>
              {alarm.reason}
            </Timeline.Item>
          </Timeline>
        ) : (
          <Timeline mode="left" pending="等待处理中..." reverse={true}>
            <Timeline.Item color="red" label={alarm.createTime + ' 系统告警'}>
              {alarm.reason}
            </Timeline.Item>
          </Timeline>
        )}
      </div>
      <ProFormSelect
        options={new Array(4).fill(0).map((_, index) => ({
          // label: statusSelectConfig[index],
          label: AlarmStatusConfig[index].label,
          value: index,
        }))}
        name="status"
        label="报警状态"
        initialValue={alarm.status}
        rules={[{ required: true, message: '请选择报警状态' }]}
      />
      <ProFormTextArea
        name="results"
        label="处理结果"
        fieldProps={{ rows: 4 }}
        initialValue={alarm.results}
        placeholder="请输入处理结果"
      />
    </DrawerForm>
  );
};

export default AlarmManageDrawer;
