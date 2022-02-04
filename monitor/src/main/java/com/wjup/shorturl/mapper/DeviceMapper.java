package com.wjup.shorturl.mapper;

import org.springframework.stereotype.Repository;

import com.wjup.shorturl.entity.DeviceEntity;

@Repository
public interface DeviceMapper {
	
	void createDevice(DeviceEntity device);
	
	void deleteDeviceById(int id);
	
	void updateDeviceById(DeviceEntity device);
	
	DeviceEntity[] getDevices();
	
	DeviceEntity getDeviceById(int id);
	
	DeviceEntity[] getDeviceByName(String name);
}
