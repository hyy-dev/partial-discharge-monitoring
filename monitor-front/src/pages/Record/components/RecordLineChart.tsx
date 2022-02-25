import React from 'react';
import {Line} from '@ant-design/charts';
import styles from "@/pages/Record/index.less";
import {Col, Empty, Row, Statistic} from "antd";

type RecordLineChartConfig = {
  recordData: API.MonitorRecord[];
  type: 0 | 1;
}

const typeConfig = {
  0: {
    text: '电缆',
    quota: ['qpda', 'qpdp']
  },
  1: {
    text: '开关柜',
    quota: ['qsda', 'qsdp']
  }
}

type chartDataType = {
  time: string;
  value: number;
  category: string;
}

const RecordLineChart: React.FC<RecordLineChartConfig> = ({recordData, type}) => {

  const splitData = (data: API.MonitorRecord[]): chartDataType[] => {
    const result = [];
    for(let i=0;i<data.length;i++) {
      result.push({time: data[i].collectedTime, value: data[i][typeConfig[type].quota[0]], category: typeConfig[type].quota[0]});
      result.push({time: data[i].collectedTime, value: data[i][typeConfig[type].quota[1]], category: typeConfig[type].quota[1]});
    }
    return result;
  }

  const config = {
    height: 400,
    xField: 'time',
    yField: 'value',
    seriesField: 'category',
    smooth: true,
    // areaStyle: {
    //   fill: 'l(270) 0:#ffffff 0.5:#7ec2f3 1:#1890ff',
    // }
  };

  const getAverage = (arr: number[]) =>
    Math.round(arr.reduce((pre, cur) => pre + cur, 0) / arr.length);


  return <>
    {
      <div className={styles.chartContainer}>
        {
          recordData.length === 0 ?
            <Empty style={{ marginTop: 100 }} /> :
            <>
              <Row gutter={16}>
                <Col span={12}>
                  <Statistic title={typeConfig[type].text + "放电峰值（pC）"} value={Math.max(...recordData.map((val)=>val[typeConfig[type].quota[1]])) ?? undefined} />
                </Col>
                <Col span={12}>
                  <Statistic title={typeConfig[type].text + "放电均值（pC）"} value={getAverage(recordData.map((val)=>val[typeConfig[type].quota[0]])) ?? undefined} />
                </Col>
              </Row>
              <div style={{ width: '100%', height: 400}}>
                <Line {...config} data={splitData(recordData)} />
              </div>

            </>
        }
      </div>}
  </>
}
export default RecordLineChart;
