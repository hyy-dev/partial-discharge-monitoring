import React from 'react';
import { ProFormSelect, ProFormText, ModalForm } from '@ant-design/pro-form';
import type { ActionType } from '@ant-design/pro-table';
import { useModel } from '@@/plugin-model/useModel';

type UpdateFormProps = {
  title: string;
  hasInitialType: boolean;
  isDisabled: boolean;
  actionRef: React.MutableRefObject<ActionType | undefined>;
  currentDeviceConfig: API.DeviceInfo;
  visible: boolean;
  handleVisibleChange: (value: React.SetStateAction<boolean>) => void;
  handleUpdate: (value: API.DeviceInfo) => Promise<boolean>;
};

type FormContentType = {
  deviceId: number;
  name: string;
  type: 0 | 1;
};

const UpdateForm: React.FC<UpdateFormProps> = (props) => {
  const {
    title,
    hasInitialType,
    isDisabled,
    actionRef,
    currentDeviceConfig,
    visible,
    handleVisibleChange,
    handleUpdate,
  } = props;

  return (
    <ModalForm
      title={title}
      width="400px"
      visible={visible}
      onVisibleChange={handleVisibleChange}
      onFinish={async (values: FormContentType) => {
        const success = await handleUpdate({
          sortWeight: currentDeviceConfig.sortWeight,
          ...values,
        });
        if (success) {
          handleVisibleChange(false);
          if (actionRef.current) {
            actionRef.current.reload();
          }
        }
      }}
      modalProps={{
        destroyOnClose: true,
        onCancel: () => handleVisibleChange(false),
      }}
    >
      <ProFormText
        rules={[{ required: true, message: '请输入设备id!' }]}
        width="md"
        name="deviceId"
        label="设备id"
        initialValue={currentDeviceConfig.deviceId}
        fieldProps={{ type: 'number' }}
        disabled={isDisabled}
      />
      <ProFormText
        rules={[{ required: true, message: '请输入设备名称!' }]}
        width="md"
        name="name"
        label="设备名称"
        initialValue={currentDeviceConfig.name}
        placeholder="请输入设备名称"
      />
      <ProFormSelect
        rules={[{ required: true, message: '请选择设备类型!' }]}
        width="md"
        name="type"
        label="设备类型"
        initialValue={hasInitialType ? currentDeviceConfig.type : undefined}
        options={[
          {
            label: '开关柜',
            value: 0,
          },
          {
            label: '电缆',
            value: 1,
          },
        ]}
      />
    </ModalForm>
  );
};

export default UpdateForm;
