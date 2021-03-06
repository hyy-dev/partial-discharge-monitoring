package com.wjup.shorturl.mapper;

import org.springframework.stereotype.Repository;

import com.wjup.shorturl.entity.AlarmRecordDetail;
import com.wjup.shorturl.entity.AlarmRecordEntity;
import com.wjup.shorturl.entity.MonitorRecordEntity;

@Repository
public interface AlarmRecordMapper {
    AlarmRecordEntity[] getAlarm();

    AlarmRecordDetail[] getAlarmDetail();

//    AlarmRecordDetail[] getAlarmDetailByTime(String startTime, String endTime);
AlarmRecordDetail[] getAlarmDetailByTime(String startTime, String endTime, int deviceId);

    void addAlarm(AlarmRecordEntity alarm);

    void deleteAlarm(int alarmId);

    void updateAlarm(int alarmId, int status, String results);
}
