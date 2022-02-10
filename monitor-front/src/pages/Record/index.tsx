import React, {useEffect, useState} from 'react';
import styles from './index.less';
import {Card, Radio, DatePicker, Space, Divider, Tag, Button} from "antd";

import type {Moment} from "moment";
import moment from "moment";
import {getRecordUsingGET7 as getRecord} from "@/services/api/monitorRecordController";
import RecordLineChart from "@/pages/Record/components/RecordLineChart";
import {getDevicesUsingGET7 as getDevices} from "@/services/api/deviceController";
import DeviceList from "@/pages/Record/components/DeviceList";
import {MenuUnfoldOutlined} from "@ant-design/icons";
import {PageContainer} from "@ant-design/pro-layout";

type Range = 'day' | 'week' | 'month';


const Record: React.FC<{}> = (props) => {
  const [rangeKey, setRangeKey] = useState<Range>('week');
  const [range, setRange] = useState<Moment[] | string[]>([
    moment('2021-02-08 00:00:00', 'YYYY-MM-DD HH:mm:ss'),
    moment('2021-02-15 00:00:00', 'YYYY-MM-DD HH:mm:ss')]);
  const [monitorData, setMonitorData] = useState<API.MonitorRecord[]>([]);
  const [deviceId, setDeviceId] = useState<number>(Number(props.match.params.id));
  const [devices, setDevices] = useState<API.DeviceInfo[]>([]);
  const [showList, setShowList] = useState<boolean>(true);

  useEffect(()=>{
    (async function(){
      const res = await getDevices();
      if(res.code === 0) {
        setDevices(res.data ?? []);
      }
    })();
  }, []);

  useEffect (() => {
    (async function(){
      const res = await getRecord({ deviceId,
        startTime: (range[0] as Moment).format('YYYY-MM-DD HH:mm:ss'),
        endTime: (range[1] as Moment).format('YYYY-MM-DD HH:mm:ss')});
      if(res.data) {
        setMonitorData(res.data);
      }
    })();
  }, [deviceId, range]);


  return (
    <PageContainer>
    <div className={styles.record}>
      <div className={styles.data} style={ showList ? undefined : { width: '100%'}}>
        <Card
          title={devices.find((val)=> val.deviceId === deviceId)?.name ?? "设备名称"}
          extra={
          <Space>
            <Tag color="green">
              设备id&nbsp;
              {deviceId}
            </Tag>
            <Tag color="blue">
              {devices.find((val)=> val.deviceId === deviceId)?.type === 0 ? '开关柜' : '电缆'}
            </Tag>
            { showList ? null : <Button type='primary' onClick={()=>{ setShowList(true);}}>切换设备</Button>}
        </Space>} style={{marginRight: 20, height: '100%'}}>
          <div>
          <Space>
          <Radio.Group defaultValue="week" value={rangeKey} buttonStyle="solid"
                       onChange={(e)=>{
                         setRangeKey(e.target.value);
                         const baseTime = range[1] || range[0] ||
                           moment('2021-02-15 00:00:00', 'YYYY-MM-DD HH:mm:ss');

                           switch (e.target.value) {
                             case 'day': {
                               setRange([
                                 moment(moment(baseTime).subtract(1, 'days')
                                     .format('YYYY-MM-DD HH:mm:ss'),
                                   'YYYY-MM-DD HH:mm:ss'),
                                 moment(moment(baseTime).format('YYYY-MM-DD HH:mm:ss'),
                                   'YYYY-MM-DD HH:mm:ss')]);
                               break;}
                             case 'week':  {
                               setRange([
                                 moment(moment(baseTime).subtract(7, 'days')
                                     .format('YYYY-MM-DD HH:mm:ss'),
                                   'YYYY-MM-DD HH:mm:ss'),
                                 moment(moment(baseTime).format('YYYY-MM-DD HH:mm:ss'),
                                   'YYYY-MM-DD HH:mm:ss')]);
                               break;}
                             case 'month': setRange([
                               moment(moment(baseTime).subtract(1, 'months')
                                   .format('YYYY-MM-DD HH:mm:ss'),
                                 'YYYY-MM-DD HH:mm:ss'),
                               moment(moment(baseTime).format('YYYY-MM-DD HH:mm:ss'),
                                 'YYYY-MM-DD HH:mm:ss')]);;break;
                           }
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
            onOk={async (value)=>{
              // todo: 和单选框联动
              setRange(value);
              const res = await getRecord({
                deviceId,
                startTime: value?.[0]?.format('YYYY-MM-DD HH:mm:ss') ?? '',
                endTime: value?.[1]?.format('YYYY-MM-DD HH:mm:ss') ?? ''});
              if(res.data) {
                setMonitorData(res.data);
              }
            }}
          />
          </Space>
          </div>
          <RecordLineChart recordData={monitorData}  type={0}/>
          <RecordLineChart recordData={monitorData}  type={1}/>

        </Card>
      </div>
      <div className={styles.device} style={showList ? undefined : { width: 0}} >
        {showList ? <Card title="设备列表" style={{height: '100%'}} bodyStyle={{ paddingTop: 10 }}
                          extra={<Button icon={<MenuUnfoldOutlined />}
                                         onClick={()=>{setShowList(false)}}
                                         type='text' />}>
          <DeviceList deviceList={devices} deviceId={deviceId} setDeviceId={(id)=>{setDeviceId(id)}} />
        </Card> : null}
      </div>
    </div>
    </PageContainer>
  )
}

export default Record;
