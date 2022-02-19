package com.wjup.shorturl.controller;

import java.lang.reflect.Array;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Vector;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import com.alibaba.fastjson.JSONObject;
import com.wjup.shorturl.entity.AlarmRecordDetail;
import com.wjup.shorturl.entity.AlarmRecordEntity;
import com.wjup.shorturl.entity.MonitorRecordEntity;
import com.wjup.shorturl.service.AlarmRecordService;
import com.wjup.shorturl.service.MonitorRecordService;

@Controller
@Api(value = "报警管理",description = "报警管理操作 API", protocols = "http")
@RequestMapping("/api")
public class AlarmRecordController {
	
	@Autowired
	private AlarmRecordService alarmService;
	@Autowired
	private MonitorRecordService monitorRecordService;
	
	private static final int THRESHOLD = 800;

	@ApiOperation(value = "获取报警信息", httpMethod = "GET",
			produces="application/json")
	@RequestMapping("/alarm")
	@ResponseBody
	public String getAlarm() {
		JSONObject json = new JSONObject();
		try {
			AlarmRecordEntity[] alarms = alarmService.getAlarm(); 
			Vector<Integer> alarmsId = new Vector<Integer>();
			for(int i=0;i<alarms.length;i++) {
				alarmsId.add(alarms[i].getAlarmId());
			}
			
			MonitorRecordEntity[] exceptionRecords = monitorRecordService.getExceptionRecord(THRESHOLD);
			for(int i=0;i<exceptionRecords.length;i++) {
				if(alarmsId.indexOf(exceptionRecords[i].getRecordId()) != -1) {
					continue;
				}
				MonitorRecordEntity exceptionRecord = exceptionRecords[i];
				AlarmRecordEntity alarm = new AlarmRecordEntity();
				alarm.setAlarmId(exceptionRecord.getRecordId());
				
				String alarmReason = "";
				if(exceptionRecord.getQpda() > THRESHOLD) {
					alarmReason = alarmReason.concat("Qpda:" + exceptionRecord.getQpda() + " ");
				}
				if(exceptionRecord.getQpdp() > THRESHOLD) {
					alarmReason = alarmReason.concat("Qpdp:" + exceptionRecord.getQpdp() + " ");
				}
				if(exceptionRecord.getQsda() > THRESHOLD) {
					alarmReason = alarmReason.concat("Qsda:" + exceptionRecord.getQsda() + " ");
				}
				if(exceptionRecord.getQsdp() > THRESHOLD) {
					alarmReason = alarmReason.concat("Qsdp:" + exceptionRecord.getQsdp() + " ");
				}
				
				alarm.setReason(alarmReason);
				alarm.setContent(JSONObject.toJSONString(exceptionRecord));
				alarm.setCreateTime(exceptionRecord.getCollectedTime());
				alarm.setDeviceId(exceptionRecord.getDeviceId());
				alarm.setStatus(0);
				
				alarmService.addAlarm(alarm);
			}
			json.put("code", 0);
			json.put("msg", "获取成功");
			json.put("alarms", alarmService.getAlarm());
		}catch(Exception e) {
			json.put("code", 1);
			json.put("msg", "服务器错误，获取报警失败");
			json.put("error", e.toString());
		}
		
		return json.toJSONString();
	}

	@ApiOperation(value = "获取报警详情列表", httpMethod = "GET",
			produces = "application/json")
	@RequestMapping("/alarms")
	@ResponseBody
	public String getAlarms(String startTime, String endTime, String deviceId) {
		JSONObject json = new JSONObject();

		try {
			AlarmRecordEntity[] alarms = alarmService.getAlarm();
			MonitorRecordEntity[] exceptionRecords;
			if (alarms.length == 0) {
				exceptionRecords = monitorRecordService.getExceptionRecord(THRESHOLD);
			} else {
				// todo: 监测的开始时间可进一步优化为上一次监测的时间
				exceptionRecords = monitorRecordService.getExceptionRecordAfter(THRESHOLD, alarms[0].getCreateTime());
			}
			
			for(int i=0;i<exceptionRecords.length;i++) {
				// 异常记录插入报警表
				MonitorRecordEntity exceptionRecord = exceptionRecords[i];
				AlarmRecordEntity alarm = new AlarmRecordEntity();
				alarm.setAlarmId(exceptionRecord.getRecordId());
				
				String alarmReason = "";
				if(exceptionRecord.getQpda() > THRESHOLD) {
					alarmReason = alarmReason.concat("Qpda:" + exceptionRecord.getQpda() + " ");
				}
				if(exceptionRecord.getQpdp() > THRESHOLD) {
					alarmReason = alarmReason.concat("Qpdp:" + exceptionRecord.getQpdp() + " ");
				}
				if(exceptionRecord.getQsda() > THRESHOLD) {
					alarmReason = alarmReason.concat("Qsda:" + exceptionRecord.getQsda() + " ");
				}
				if(exceptionRecord.getQsdp() > THRESHOLD) {
					alarmReason = alarmReason.concat("Qsdp:" + exceptionRecord.getQsdp() + " ");
				}
				
				alarm.setReason(alarmReason);
				alarm.setContent(JSONObject.toJSONString(exceptionRecord));
				alarm.setCreateTime(exceptionRecord.getCollectedTime());
				alarm.setDeviceId(exceptionRecord.getDeviceId());
				alarm.setStatus(0);

				alarmService.addAlarm(alarm);
			}

			json.put("code", 0);
			json.put("msg", "获取成功");
			json.put("alarms", alarmService.getAlarmDetailByTime(startTime, endTime, deviceId == null ? -1 : Integer.parseInt(deviceId)));

		} catch(Exception e) {
			json.put("code", 1);
			json.put("msg", "服务器错误，获取报警失败");
			json.put("error", e.toString());
		}
		
		return json.toJSONString();
	}

	@ApiOperation(value = "更新报警状态", httpMethod = "POST",
			produces = "application/json", consumes = "application/json")
	@RequestMapping("/alarms/update")
	@ResponseBody
	public String updateAlarm(int alarmId, int status, String results) {
		JSONObject json = new JSONObject();

		try {
			alarmService.updateAlarm(alarmId, status, results);
			json.put("code", 0);
			json.put("msg", "报警状态更新成功");
		} catch (Exception e) {
			json.put("code", 1);
			json.put("msg", "服务器错误，修改报警状态失败");
		}
		return json.toJSONString();
	}
}
