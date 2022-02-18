package com.wjup.shorturl.service.serviceimpl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.wjup.shorturl.entity.AlarmRecordDetail;
import com.wjup.shorturl.entity.AlarmRecordEntity;
import com.wjup.shorturl.mapper.AlarmRecordMapper;
import com.wjup.shorturl.service.AlarmRecordService;

@Service
public class AlarmRecordServiceImpl implements AlarmRecordService {

	@Autowired
	private AlarmRecordMapper alarmMapper;
	
	@Override
	public AlarmRecordEntity[] getAlarm() {
		return alarmMapper.getAlarm();
	}

	@Override
	public void addAlarm(AlarmRecordEntity alarm) {
		alarmMapper.addAlarm(alarm);
	}

	@Override
	public void deleteAlarm(int alarmId) {
		alarmMapper.deleteAlarm(alarmId);
	}

	@Override
	public void updateAlarm(int alarmId, int status, String results) {
		alarmMapper.updateAlarm(alarmId, status, results);
	}

	@Override
	public AlarmRecordDetail[] getAlarmDetail() {
		return alarmMapper.getAlarmDetail();
	}

	@Override
	public AlarmRecordDetail[] getAlarmDetailByTime(String startTime, String endTime) {
		return alarmMapper.getAlarmDetailByTime(startTime, endTime);
	}

}
