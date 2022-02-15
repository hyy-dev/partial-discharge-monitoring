import { PlusOutlined } from '@ant-design/icons';
import { Button, message, Input, Drawer } from 'antd';
import React, { useState, useRef } from 'react';
import { useIntl, FormattedMessage } from 'umi';
import { PageContainer, FooterToolbar } from '@ant-design/pro-layout';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { ModalForm, ProFormText, ProFormTextArea } from '@ant-design/pro-form';
import type { ProDescriptionsItemProps } from '@ant-design/pro-descriptions';
import ProDescriptions from '@ant-design/pro-descriptions';
import type { FormValueType } from './components/UpdateForm';
import UpdateForm from './components/UpdateForm';
import { rule, addRule, updateRule, removeRule } from '@/services/ant-design-pro/api';
import {
  getDevicesUsingGET7 as getDevices,
  updateDeviceUsingPOST7 as updateDevice,
} from '@/services/api/deviceController';
import { Link } from '@umijs/preset-dumi/lib/theme';
import { MenuOutlined } from '@ant-design/icons';
import { SortableContainer, SortableElement, SortableHandle } from 'react-sortable-hoc';
import { arrayMoveImmutable } from 'array-move';
import './index.less';
import { useModel } from '@@/plugin-model/useModel';

/**
 * @en-US Add node
 * @zh-CN 添加节点
 * @param fields
 */
const handleAdd = async (fields: API.RuleListItem) => {
  const hide = message.loading('正在添加');
  try {
    await addRule({ ...fields });
    hide();
    message.success('Added successfully');
    return true;
  } catch (error) {
    hide();
    message.error('Adding failed, please try again!');
    return false;
  }
};

/**
 * @en-US Update node
 * @zh-CN 更新节点
 *
 * @param fields
 */
const handleUpdate = async (fields: FormValueType) => {
  const hide = message.loading('Configuring');
  try {
    await updateRule({
      name: fields.name,
      desc: fields.desc,
      key: fields.key,
    });
    hide();

    message.success('Configuration is successful');
    return true;
  } catch (error) {
    hide();
    message.error('Configuration failed, please try again!');
    return false;
  }
};

/**
 *  Delete node
 * @zh-CN 删除节点
 *
 * @param selectedRows
 */
const handleRemove = async (selectedRows: API.RuleListItem[]) => {
  const hide = message.loading('正在删除');
  if (!selectedRows) return true;
  try {
    await removeRule({
      key: selectedRows.map((row) => row.key),
    });
    hide();
    message.success('Deleted successfully and will refresh soon');
    return true;
  } catch (error) {
    hide();
    message.error('Delete failed, please try again');
    return false;
  }
};

const DragHandle = SortableHandle(() => <MenuOutlined style={{ cursor: 'grab', color: '#999' }} />);
const SortableItem = SortableElement((props) => <tr {...props} />);
const SortableBody = SortableContainer((props) => <tbody {...props} />);

const TableList: React.FC = () => {
  /**
   * @en-US Pop-up window of new window
   * @zh-CN 新建窗口的弹窗
   *  */
  const [createModalVisible, handleModalVisible] = useState<boolean>(false);
  /**
   * @en-US The pop-up window of the distribution update window
   * @zh-CN 分布更新窗口的弹窗
   * */
  const [updateModalVisible, handleUpdateModalVisible] = useState<boolean>(false);

  // const [showDetail, setShowDetail] = useState<boolean>(false);

  const actionRef = useRef<ActionType>();
  const [currentRow, setCurrentRow] = useState<API.RuleListItem>();
  // const [selectedRowsState, setSelectedRows] = useState<API.RuleListItem[]>([]);

  const [dataSource, setDataSource] = useState<API.DeviceInfo[]>([]);
  const { initialState } = useModel('@@initialState');

  /**
   * @en-US International configuration
   * @zh-CN 国际化配置
   * */
  const intl = useIntl();

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
            handleUpdateModalVisible(true);
            setCurrentRow(record);
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
            return updateDevice({ ...value }, userInfo?.token ?? '');
          } else {
            return true;
          }
        }),
      ).then(
        (res) => {
          console.log('success res', res);
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
            <PlusOutlined /> <FormattedMessage id="pages.searchTable.new" defaultMessage="New" />
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
        // rowSelection={{
        //   onChange: (_, selectedRows) => {
        //     setSelectedRows(selectedRows);
        //   },
        // }}
      />
      {/*{selectedRowsState?.length > 0 && (*/}
      {/*  <FooterToolbar*/}
      {/*    extra={*/}
      {/*      <div>*/}
      {/*        <FormattedMessage id="pages.searchTable.chosen" defaultMessage="Chosen" />{' '}*/}
      {/*        <a style={{ fontWeight: 600 }}>{selectedRowsState.length}</a>{' '}*/}
      {/*        <FormattedMessage id="pages.searchTable.item" defaultMessage="项" />*/}
      {/*        &nbsp;&nbsp;*/}
      {/*        <span>*/}
      {/*          <FormattedMessage*/}
      {/*            id="pages.searchTable.totalServiceCalls"*/}
      {/*            defaultMessage="Total number of service calls"*/}
      {/*          />{' '}*/}
      {/*          {selectedRowsState.reduce((pre, item) => pre + item.callNo!, 0)}{' '}*/}
      {/*          <FormattedMessage id="pages.searchTable.tenThousand" defaultMessage="万" />*/}
      {/*        </span>*/}
      {/*      </div>*/}
      {/*    }*/}
      {/*  >*/}
      {/*    <Button*/}
      {/*      onClick={async () => {*/}
      {/*        await handleRemove(selectedRowsState);*/}
      {/*        setSelectedRows([]);*/}
      {/*        actionRef.current?.reloadAndRest?.();*/}
      {/*      }}*/}
      {/*    >*/}
      {/*      <FormattedMessage*/}
      {/*        id="pages.searchTable.batchDeletion"*/}
      {/*        defaultMessage="Batch deletion"*/}
      {/*      />*/}
      {/*    </Button>*/}
      {/*    <Button type="primary">*/}
      {/*      <FormattedMessage*/}
      {/*        id="pages.searchTable.batchApproval"*/}
      {/*        defaultMessage="Batch approval"*/}
      {/*      />*/}
      {/*    </Button>*/}
      {/*  </FooterToolbar>*/}
      {/*)}*/}
      {/*<ModalForm*/}
      {/*  title='新增设备'*/}
      {/*  width="400px"*/}
      {/*  visible={createModalVisible}*/}
      {/*  onVisibleChange={handleModalVisible}*/}
      {/*  onFinish={async (value) => {*/}
      {/*    const success = await handleAdd(value as API.RuleListItem);*/}
      {/*    if (success) {*/}
      {/*      handleModalVisible(false);*/}
      {/*      if (actionRef.current) {*/}
      {/*        actionRef.current.reload();*/}
      {/*      }*/}
      {/*    }*/}
      {/*  }}*/}
      {/*>*/}
      {/*  <ProFormText*/}
      {/*    rules={[*/}
      {/*      {*/}
      {/*        required: true,*/}
      {/*        message: (*/}
      {/*          <FormattedMessage*/}
      {/*            id="pages.searchTable.ruleName"*/}
      {/*            defaultMessage="Rule name is required"*/}
      {/*          />*/}
      {/*        ),*/}
      {/*      },*/}
      {/*    ]}*/}
      {/*    width="md"*/}
      {/*    name="name"*/}
      {/*  />*/}
      {/*  <ProFormTextArea width="md" name="desc" />*/}
      {/*</ModalForm>*/}
      {/*<UpdateForm*/}
      {/*  onSubmit={async (value) => {*/}
      {/*    const success = await handleUpdate(value);*/}
      {/*    if (success) {*/}
      {/*      handleUpdateModalVisible(false);*/}
      {/*      setCurrentRow(undefined);*/}
      {/*      if (actionRef.current) {*/}
      {/*        actionRef.current.reload();*/}
      {/*      }*/}
      {/*    }*/}
      {/*  }}*/}
      {/*  onCancel={() => {*/}
      {/*    handleUpdateModalVisible(false);*/}
      {/*    if (!showDetail) {*/}
      {/*      setCurrentRow(undefined);*/}
      {/*    }*/}
      {/*  }}*/}
      {/*  updateModalVisible={updateModalVisible}*/}
      {/*  values={currentRow || {}}*/}
      {/*/>*/}

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
