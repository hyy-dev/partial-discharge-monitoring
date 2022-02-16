import React from 'react';
import { message } from 'antd';
import { ProFormSelect, ProFormText, ModalForm } from '@ant-design/pro-form';
import type { ActionType } from '@ant-design/pro-table';
import { addDevice } from '@/services/api/deviceController';
import { useModel } from 'umi';

type AddFormProps = {
  actionRef: React.MutableRefObject<ActionType | undefined>;
  deviceId: number;
  sortWeight: number;
  visible: boolean;
  handleVisibleChange: (value: React.SetStateAction<boolean>) => void;
};

type AddFormReq = {
  deviceId: number;
  name: string;
  type: 0 | 1;
};

const AddForm: React.FC<AddFormProps> = (props) => {
  const { actionRef, deviceId, visible, handleVisibleChange, sortWeight } = props;

  const { initialState } = useModel('@@initialState');

  const handleAdd = async (values: API.DeviceInfo) => {
    const hide = message.loading('正在添加');
    try {
      hide();
      message.success('添加成功');
      await addDevice(values, initialState?.currentUser?.token || '');
      console.log('2334');
      return true;
    } catch (error) {
      hide();
      console.log('233');
      message.error('添加失败，请重试');
      return false;
    }
  };

  return (
    <ModalForm
      title="新增设备"
      width="400px"
      visible={visible}
      onVisibleChange={handleVisibleChange}
      onFinish={async (values: AddFormReq) => {
        console.log(values);
        const success = await handleAdd({ ...values, sortWeight });
        if (success) {
          handleVisibleChange(false);
          if (actionRef.current) {
            actionRef.current.reload();
          }
        }
      }}
      modalProps={{ destroyOnClose: true }}
    >
      <ProFormText
        // rules={[{ required: true, message: '请选择设备id!' }]}
        width="md"
        name="deviceId"
        label="设备id"
        initialValue={deviceId}
        fieldProps={{ type: 'number' }}
      />
      <ProFormText
        rules={[{ required: true, message: '请输入设备名称!' }]}
        width="md"
        name="name"
        label="设备名称"
        placeholder="请输入设备名称"
      />
      <ProFormSelect
        rules={[{ required: true, message: '请选择设备类型!' }]}
        width="md"
        name="type"
        label="设备类型"
        valueEnum={{
          0: '开关柜',
          1: '电缆',
        }}
        placeholder="请选择设备类型"
      />
    </ModalForm>
  );
};

export default AddForm;
