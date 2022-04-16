import React, { useEffect, useState } from 'react';
import styles from './index.less';
import { Card, Radio, DatePicker, Space, Tag, Button, Switch } from 'antd';

import type { Moment } from 'moment';
import moment from 'moment';
import { getRecordUsingGET7 as getRecord } from '@/services/api/monitorRecordController';
import RecordLineChart from '@/pages/Record/components/RecordLineChart';
import { getDevicesUsingGET7 as getDevices } from '@/services/api/deviceController';
import DeviceList from '@/pages/Record/components/DeviceList';
import { MenuUnfoldOutlined, MenuFoldOutlined } from '@ant-design/icons';
import { PageContainer } from '@ant-design/pro-layout';
import { useRequest } from '@@/plugin-request/request';

type Range = 'day' | 'week' | 'month';
const INTERVAL = 60 * 1000; // 轮询时间

const Record: React.FC<{}> = (props) => {
  const [rangeKey, setRangeKey] = useState<Range | undefined>('week');
  const [range, setRange] = useState<Moment[]>([moment().subtract(7, 'days'), moment()]);
  // const [monitorData, setMonitorData] = useState<API.MonitorRecord[]>([]);
  const [deviceId, setDeviceId] = useState<number>(Number(props.match.params.id));
  const [devices, setDevices] = useState<API.DeviceInfo[]>([]);
  const [showList, setShowList] = useState<boolean>(true);
  const [willUpdate, setWillUpdate] = useState<boolean>(true);
  const {
    data: monitorData,
    run: updateMonitorDate,
    cancel,
  } = useRequest(
    async () => {
      if (willUpdate) {
        setRange([range[0], moment()]);
      }
      const params = {
        deviceId,
        startTime: (range[0] as Moment).format('YYYY-MM-DD HH:mm:ss'),
        endTime: (willUpdate ? moment() : (range[1] as Moment)).format('YYYY-MM-DD HH:mm:ss'),
      };
      return getRecord(params);
    },
    {
      refreshDeps: [deviceId],
      pollingInterval: INTERVAL,
    },
  );

  useEffect(() => {
    (async function () {
      const res = await getDevices();
      if (res.code === 0) {
        setDevices(res.data ?? []);
      }
    })();
  }, []);

  return (
    <PageContainer>
      <div className={styles.record}>
        <div className={styles.data} style={showList ? undefined : { width: '100%' }}>
          <Card
            title={devices.find((val) => val.deviceId === deviceId)?.name ?? '设备名称'}
            extra={
              <Space>
                <Tag color="green">
                  设备id&nbsp;
                  {deviceId}
                </Tag>
                <Tag color="blue">
                  {devices.find((val) => val.deviceId === deviceId)?.type === 0 ? '开关柜' : '电缆'}
                </Tag>
                {showList ? null : (
                  <Button
                    type="primary"
                    onClick={() => {
                      setShowList(true);
                    }}
                    icon={<MenuFoldOutlined />}
                  >
                    切换设备
                  </Button>
                )}
              </Space>
            }
            style={{ marginRight: 20, height: '100%' }}
          >
            <div>
              <Space wrap>
                <Radio.Group
                  defaultValue="week"
                  value={rangeKey}
                  buttonStyle="solid"
                  onChange={async (e) => {
                    setRangeKey(e.target.value);
                    const baseTime =
                      range[1] || range[0] || moment('2021-02-15 00:00:00', 'YYYY-MM-DD HH:mm:ss');

                    switch (e.target.value) {
                      case 'day': {
                        await setRange([
                          moment(
                            moment(baseTime).subtract(1, 'days').format('YYYY-MM-DD HH:mm:ss'),
                            'YYYY-MM-DD HH:mm:ss',
                          ),
                          moment(
                            moment(baseTime).format('YYYY-MM-DD HH:mm:ss'),
                            'YYYY-MM-DD HH:mm:ss',
                          ),
                        ]);
                        break;
                      }
                      case 'week': {
                        await setRange([
                          moment(
                            moment(baseTime).subtract(7, 'days').format('YYYY-MM-DD HH:mm:ss'),
                            'YYYY-MM-DD HH:mm:ss',
                          ),
                          moment(
                            moment(baseTime).format('YYYY-MM-DD HH:mm:ss'),
                            'YYYY-MM-DD HH:mm:ss',
                          ),
                        ]);
                        break;
                      }
                      case 'month':
                        await setRange([
                          moment(
                            moment(baseTime).subtract(1, 'months').format('YYYY-MM-DD HH:mm:ss'),
                            'YYYY-MM-DD HH:mm:ss',
                          ),
                          moment(
                            moment(baseTime).format('YYYY-MM-DD HH:mm:ss'),
                            'YYYY-MM-DD HH:mm:ss',
                          ),
                        ]);
                        break;
                    }
                    await updateMonitorDate();
                    if (!willUpdate) cancel();
                  }}
                >
                  <Radio.Button value="day">近一日</Radio.Button>
                  <Radio.Button value="week">近一周</Radio.Button>
                  <Radio.Button value="month">近一月</Radio.Button>
                </Radio.Group>
                <DatePicker.RangePicker
                  value={range}
                  showTime={{ format: 'HH:mm' }}
                  format="YYYY-MM-DD HH:mm"
                  disabled={[false, willUpdate]}
                  disabledDate={(current) => {
                    return current > moment().endOf('day');
                  }}
                  onOk={async (value) => {
                    await setRange(value);
                    await updateMonitorDate();
                    if (!willUpdate) cancel();
                    // todo: 和单选框联动
                    setRangeKey(undefined);
                    // const res = await getRecord({
                    //   deviceId,
                    //   startTime: value?.[0]?.format('YYYY-MM-DD HH:mm:ss') ?? '',
                    //   endTime: value?.[1]?.format('YYYY-MM-DD HH:mm:ss') ?? '',
                    // });
                    // if (res.data) {
                    //   setMonitorData(res.data);
                    // }
                  }}
                />
                <span>
                  <span style={{ marginRight: 5 }}>实时更新</span>
                  <Switch
                    defaultChecked
                    onChange={async (v) => {
                      setWillUpdate(v);
                      if (v) await updateMonitorDate(v);
                      else cancel();
                    }}
                  />
                </span>
              </Space>
            </div>
            <RecordLineChart recordData={monitorData ?? []} type={0} />
            <RecordLineChart recordData={monitorData ?? []} type={1} />
          </Card>
        </div>
        <div className={styles.device} style={showList ? undefined : { width: 0 }}>
          {showList ? (
            <Card
              title="设备列表"
              style={{ height: '100%' }}
              bodyStyle={{ paddingTop: 10 }}
              extra={
                <Button
                  icon={<MenuUnfoldOutlined />}
                  onClick={() => {
                    setShowList(false);
                  }}
                  type="text"
                />
              }
            >
              <DeviceList
                deviceList={devices}
                deviceId={deviceId}
                setDeviceId={(id) => {
                  setDeviceId(id);
                }}
              />
            </Card>
          ) : null}
        </div>
      </div>
    </PageContainer>
  );
};

export default Record;
