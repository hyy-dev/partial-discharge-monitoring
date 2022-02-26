import { PlusOutlined } from '@ant-design/icons';
import { Button, message } from 'antd';
import React, { useState, useRef } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import UpdateForm from './components/UpdateForm';
import {
  addDevice,
  getDevicesUsingGET7 as getDevices,
  editDevice,
} from '@/services/api/deviceController';
import { Link } from '@umijs/preset-dumi/lib/theme';
import { MenuOutlined } from '@ant-design/icons';
import { SortableContainer, SortableElement, SortableHandle } from 'react-sortable-hoc';
import { arrayMoveImmutable } from 'array-move';
import './index.less';
import { useModel } from '@@/plugin-model/useModel';

/**
 *  Delete node
 * @zh-CN 删除节点
 *
 * @param selectedRows
 */

const DragHandle = SortableHandle(() => <MenuOutlined style={{ cursor: 'grab', color: '#999' }} />);
const SortableItem = SortableElement((props) => <tr {...props} />);
const SortableBody = SortableContainer((props) => <tbody {...props} />);

const TableList: React.FC = () => {
  /**
   * @en-US The pop-up window of the distribution update window
   * @zh-CN 分布更新窗口的弹窗
   * */
  const [editModalVisible, handleEditModalVisible] = useState<boolean>(false);

  const [currentDeviceConfig, setCurrentDeviceConfig] = useState<API.DeviceInfo>({
    deviceId: -1,
    name: '',
    type: 0,
    sortWeight: 0,
  });

  const [createModalVisible, handleModalVisible] = useState<boolean>(false);

  const actionRef = useRef<ActionType>();

  const [dataSource, setDataSource] = useState<API.DeviceInfo[]>([]);
  const { initialState } = useModel('@@initialState');

  const handleEdit = async (values: API.DeviceInfo) => {
    const hide = message.loading('正在修改');
    try {
      hide();
      const res = await editDevice(values, initialState?.currentUser?.token || '');
      if (res.code === 0) {
        message.success('修改成功');
        return true;
      } else {
        throw new Error(res.error);
      }
    } catch (error) {
      message.error((error as Error).message ?? '修改失败, 请重试');
      return false;
    }
  };

  const handleAdd = async (values: API.DeviceInfo) => {
    const hide = message.loading('正在添加');
    try {
      hide();
      const res = await addDevice(values, initialState?.currentUser?.token || '');
      if (res.code === 0) {
        message.success('添加成功');
        return true;
      } else {
        throw new Error(res.error);
      }
    } catch (error) {
      message.error((error as Error).message ?? '添加失败, 请重试');
      return false;
    }
  };

  const columns: ProColumns<API.DeviceInfo>[] = [
    {
      title: '排序',
      dataIndex: 'sort',
      width: 50,
      className: 'drag-visible',
      render: () => <DragHandle />,
      search: false,
    },
    {
      title: '设备id',
      dataIndex: 'deviceId',
      tip: '设备的唯一标识',
      sorter: true,
    },
    {
      title: '设备名称',
      dataIndex: 'name',
      render: (dom, record) => {
        return <Link to={`/record/${record.deviceId}`}>{dom}</Link>;
      },
    },
    {
      title: '设备类型',
      dataIndex: 'type',
      filters: true,
      onFilter: false,
      valueType: 'select',
      valueEnum: {
        all: { text: '全部' },
        0: { text: '开关柜' },
        1: { text: '电缆' },
      },
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      render: (_, record) => [
        <a
          key="config"
          onClick={() => {
            handleEditModalVisible(true);
            setCurrentDeviceConfig(record);
          }}
        >
          编辑
        </a>,
        <a key="subscribeAlert" href={`/record/${record.deviceId}`}>
          查看监测记录
        </a>,
        // <Button type='danger'>删除</Button>
      ],
    },
  ];

  const onSortEnd = async ({ oldIndex, newIndex }: { oldIndex: number; newIndex: number }) => {
    const userInfo = initialState?.currentUser;
    const initialDataSource = [...dataSource];
    if (oldIndex !== newIndex) {
      const newData = arrayMoveImmutable(dataSource, oldIndex, newIndex)
        .filter((el) => !!el)
        .map((value, index) => ({ ...value, sortWeight: index }));
      await setDataSource(newData);
      Promise.all(
        newData.map((value) => {
          const oldSortWeight =
            dataSource.find((x) => x.deviceId === value.deviceId)?.sortWeight ?? 0;
          if (value.sortWeight !== oldSortWeight) {
            return editDevice({ ...value }, userInfo?.token ?? '');
          } else {
            return true;
          }
        }),
      ).then(
        (res) => {
          message.success('修改设备权重成功');
        },
        () => {
          message.error('权限检验不通过');
          // 还原datasource
          setDataSource(initialDataSource);
        },
      );
    }
  };

  const DraggableContainer = (props) => (
    <SortableBody
      useDragHandle
      disableAutoscroll
      helperClass="row-dragging"
      onSortEnd={onSortEnd}
      {...props}
    />
  );

  const DraggableBodyRow = ({ className, style, ...restProps }) => {
    // function findIndex base on Table rowKey props and should always be a right array index
    // const index = dataSource.findIndex((value) => value.sortWeight === restProps['data-row-key']);
    const index =
      dataSource.find((value) => value.deviceId === restProps['data-row-key'])?.sortWeight ?? 0;
    return <SortableItem index={index} {...restProps} />;
  };

  return (
    <PageContainer>
      <ProTable<API.DeviceInfo, API.PageParams>
        dataSource={dataSource}
        headerTitle="设备列表"
        actionRef={actionRef}
        rowKey="deviceId"
        search={{
          labelWidth: 120,
        }}
        components={{
          body: {
            wrapper: DraggableContainer,
            row: DraggableBodyRow,
          },
        }}
        pagination={{ defaultPageSize: 10 }}
        toolBarRender={() => [
          <Button
            type="primary"
            key="primary"
            onClick={() => {
              handleModalVisible(true);
            }}
          >
            <PlusOutlined /> 新增设备
          </Button>,
        ]}
        request={async (params, sort, filter) => {
          const { pageSize = 20, current = 1 } = params;
          const res = await getDevices();
          let managedRes: API.DeviceInfo[] = [];
          if (res.data) {
            managedRes = res.data.filter(
              (val) =>
                (!params.deviceId || (val.deviceId + '').includes(params.deviceId)) &&
                (!params.name || val.name.includes(params.name)) &&
                (!params.type || params.type === 'all' || val.type == params.type) &&
                (!filter.type || filter.type.includes(val.type + '')),
            );
            // 排序
            if (sort.deviceId) {
              const asc = sort.deviceId === 'ascend' ? 1 : -1;
              managedRes.sort((a, b) => (a.deviceId - b.deviceId) * asc);
            }
          }
          const data = managedRes.slice((current - 1) * pageSize, current * pageSize);
          setDataSource(data);
          return {
            data,
            success: res.code === 0,
            total: managedRes.length ?? 0,
          };
        }}
        columns={columns}
      />
      <UpdateForm
        title="添加设备"
        isDisabled={false}
        hasInitialType={false}
        actionRef={actionRef}
        currentDeviceConfig={{
          deviceId: Math.max(...dataSource.map((device) => device.deviceId)) + 1,
          name: '',
          sortWeight: Math.max(...dataSource.map((device) => device.sortWeight)) + 1,
          type: 0,
        }}
        visible={createModalVisible}
        handleVisibleChange={handleModalVisible}
        handleUpdate={handleAdd}
      />
      <UpdateForm
        title="修改设备信息"
        isDisabled={true}
        hasInitialType={true}
        actionRef={actionRef}
        currentDeviceConfig={currentDeviceConfig}
        visible={editModalVisible}
        handleVisibleChange={handleEditModalVisible}
        handleUpdate={handleEdit}
      />

      {/*<Drawer*/}
      {/*  width={600}*/}
      {/*  visible={showDetail}*/}
      {/*  onClose={() => {*/}
      {/*    setCurrentRow(undefined);*/}
      {/*    setShowDetail(false);*/}
      {/*  }}*/}
      {/*  closable={false}*/}
      {/*>*/}
      {/*  {currentRow?.name && (*/}
      {/*    <ProDescriptions<API.RuleListItem>*/}
      {/*      column={2}*/}
      {/*      title={currentRow?.name}*/}
      {/*      request={async () => ({*/}
      {/*        data: currentRow || {},*/}
      {/*      })}*/}
      {/*      params={{*/}
      {/*        id: currentRow?.name,*/}
      {/*      }}*/}
      {/*      columns={columns as ProDescriptionsItemProps<API.RuleListItem>[]}*/}
      {/*    />*/}
      {/*  )}*/}
      {/*</Drawer>*/}
    </PageContainer>
  );
};

export default TableList;
