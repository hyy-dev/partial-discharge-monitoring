package com.wjup.shorturl.service.serviceimpl;

import com.wjup.shorturl.entity.RecordSpanEntity;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.wjup.shorturl.entity.MonitorRecordEntity;
import com.wjup.shorturl.mapper.MonitorRecordMapper;
import com.wjup.shorturl.service.MonitorRecordService;

@Service
public class MonitorRecordImpl implements MonitorRecordService {

	@Autowired
	private MonitorRecordMapper mapper;
	
	@Override
	public MonitorRecordEntity[] getRecord(int deviceId, String startTime, String endTime) {
		return mapper.getRecord(deviceId, startTime, endTime);
	}

	@Override
	public MonitorRecordEntity[] getExceptionRecord(int threshold) {
		return mapper.getExceptionRecord(threshold);
	}

	@Override
	public MonitorRecordEntity[] getExceptionRecordAfter(int threshold, String start) {
		return mapper.getExceptionRecordAfter(threshold, start);
	}

	@Override
	public void createRecord(MonitorRecordEntity monitorRecordEntity) {
		mapper.createRecord(monitorRecordEntity);
	}

	@Override
	public RecordSpanEntity getRecordSpan(int deviceId) {
		return mapper.getRecordSpan(deviceId);
	}

}
