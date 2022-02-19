import React, {MutableRefObject} from "react";
import {ActionType} from "@ant-design/pro-table";
import {DrawerForm, ProFormSelect, ProFormTextArea} from "@ant-design/pro-form";
import {updateAlarmUsingPOST7 as updateAlarm} from "@/services/api/alarmRecordController";
import {message} from "antd";
import {AlarmStatusConfig} from "@/pages/AlarmManage/index";

const AlarmManageDrawer: React.FC<{
  alarm: API.AlarmInfo;
  tableRef: MutableRefObject<ActionType | undefined>;
}> = ({ alarm, tableRef }) => {
  return (
    <DrawerForm
      title="报警处理"
      trigger={<a>报警处理</a>}
      autoFocusFirstInput
      drawerProps={{
        destroyOnClose: true,
      }}
      onFinish={async (values) => {
        const res = await updateAlarm({ ...alarm, ...values });
        if (res.code === 0) {
          message.success(res.msg);
          tableRef?.current?.reload();
          return true;
        } else {
          message.error(res.msg);
          return false;
        }
      }}
    >
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
