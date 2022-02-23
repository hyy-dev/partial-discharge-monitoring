package com.wjup.shorturl.mapper;

import com.wjup.shorturl.entity.RecordSpanEntity;
import org.springframework.stereotype.Repository;

import com.wjup.shorturl.entity.MonitorRecordEntity;

@Repository
public interface MonitorRecordMapper {
	MonitorRecordEntity[] getRecord(int deviceId, String startTime, String endTime);

	MonitorRecordEntity[] getExceptionRecord(int threshold);

	MonitorRecordEntity[] getExceptionRecordAfter(int threshold, String start);

	void createRecord(MonitorRecordEntity monitorRecordEntity);

	RecordSpanEntity getRecordSpan(int deviceId);
}
