package com.wjup.shorturl.service;

import com.wjup.shorturl.entity.AlarmRecordDetail;
import com.wjup.shorturl.entity.AlarmRecordEntity;

public interface AlarmRecordService {
	AlarmRecordEntity[] getAlarm();
	
	AlarmRecordDetail[] getAlarmDetail();
	
	void addAlarm(AlarmRecordEntity alarm);
	
	void deleteAlarm(int alarmId);
	
	void updateAlarm(int alarmId, int status, String results);
}
