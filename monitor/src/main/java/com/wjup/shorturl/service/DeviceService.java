package com.wjup.shorturl.service;

import com.wjup.shorturl.entity.DeviceEntity;

public interface DeviceService {
	void createDevice(DeviceEntity device);
	
	void deleteDeviceById(int id);
	
	void updateDeviceById(DeviceEntity device);
	
	DeviceEntity[] getDevices();
	
	DeviceEntity getDeviceById(int id);
	
	DeviceEntity[] getDeviceByName(String name);

}
