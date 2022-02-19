package com.wjup.shorturl.service;

import com.wjup.shorturl.entity.AlarmRecordDetail;
import com.wjup.shorturl.entity.AlarmRecordEntity;

public interface AlarmRecordService {
	AlarmRecordEntity[] getAlarm();

	AlarmRecordDetail[] getAlarmDetail();

	AlarmRecordDetail[] getAlarmDetailByTime(String startTime, String endTime, int deviceId); // 根据时间查询报警记录

	void addAlarm(AlarmRecordEntity alarm);

	void deleteAlarm(int alarmId);

	void updateAlarm(int alarmId, int status, String results);
}
