package com.wjup.shorturl.service;

import com.wjup.shorturl.entity.MonitorRecordEntity;
import com.wjup.shorturl.entity.RecordSpanEntity;

public interface MonitorRecordService {
	MonitorRecordEntity[] getRecord(int deviceId, String startTime, String endTime);

	MonitorRecordEntity[] getExceptionRecord(int threshold);

	MonitorRecordEntity[] getExceptionRecordAfter(int threshold, String start);

	void createRecord(MonitorRecordEntity monitorRecordEntity);

	RecordSpanEntity getRecordSpan(int deviceId);
}
