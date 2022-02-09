import React, {useState} from 'react';
import {Input, List} from "antd";
import styles from "@/pages/Record/index.less";
import {SearchOutlined} from "@ant-design/icons";
type DeviceListConfig = {
  deviceList: API.DeviceInfo[];
  deviceId: number;
  setDeviceId: (id: number) => void;
}

const DeviceList: React.FC<DeviceListConfig> = ({ deviceList, deviceId, setDeviceId }) => {
  const [searchText, setSearchText] = useState<string>('');

  return <>
    <Input
      value={searchText}
      onChange={(e)=>{
        setSearchText(e.target.value);
      }}
      placeholder="请输入设备名称"
      suffix={<SearchOutlined />} />
  <List
    dataSource={deviceList.filter((val)=>val.name.includes(searchText))}
    renderItem={item => (
      <List.Item
        className={styles.listItem}
        style={ item.deviceId === deviceId ? { color: '#1890ff'} : undefined}
        onClick={() => {
          setDeviceId(item.deviceId);
          history.replaceState(null, '', `/record/${item.deviceId}`);
        }}
      >
        {item.name}
      </List.Item>
    )}
  />
  </>
}

export default DeviceList;
