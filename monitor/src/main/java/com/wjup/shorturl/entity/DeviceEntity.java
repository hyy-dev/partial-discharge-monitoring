package com.wjup.shorturl.entity;

import java.io.Serializable;

public class DeviceEntity implements Serializable {
	
//	设备类
	private int deviceId;
	private String name;
	private int type; // 0:开关柜, 1:电缆
	private int sortWeight;
	
	public int getDeviceId() {
		return deviceId;
	}
	public void setDeviceId(int deviceId) {
		this.deviceId = deviceId;
	}
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	public int getType() {
		return type;
	}
	public void setType(int type) {
		this.type = type;
	}
	public int getSortWeight() {
		return sortWeight;
	}
	public void setSortWeight(int sortWeight) {
		this.sortWeight = sortWeight;
	}
	
	
}
