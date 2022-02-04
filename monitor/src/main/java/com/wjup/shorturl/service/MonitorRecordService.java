package com.wjup.shorturl.service;

import com.wjup.shorturl.entity.MonitorRecordEntity;

public interface MonitorRecordService {
	MonitorRecordEntity[] getRecord(int deviceId, String startTime, String endTime);
	
	MonitorRecordEntity[] getExceptionRecord(int threshold);

	MonitorRecordEntity[] getExceptionRecordAfter(int threshold, String start);

}
