package com.wjup.shorturl.service.serviceimpl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.wjup.shorturl.entity.DeviceEntity;
import com.wjup.shorturl.mapper.DeviceMapper;
import com.wjup.shorturl.service.DeviceService;

@Service
public class DeviceServiceImpl implements DeviceService {

	@Autowired
	private DeviceMapper deviceMapper;
	
	@Override
	public void createDevice(DeviceEntity device) {
		deviceMapper.createDevice(device);
	}

	@Override
	public void deleteDeviceById(int id) {
		deviceMapper.deleteDeviceById(id);
	}

	@Override
	public void updateDeviceById(DeviceEntity device) {
		deviceMapper.updateDeviceById(device);

	}

	@Override
	public DeviceEntity[] getDevices() {
		return deviceMapper.getDevices();
	}

	@Override
	public DeviceEntity getDeviceById(int id) {
		return deviceMapper.getDeviceById(id);
	}

	@Override
	public DeviceEntity[] getDeviceByName(String name) {
		return deviceMapper.getDeviceByName(name);
	}

}
