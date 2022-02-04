package com.wjup.shorturl.entity;

import java.io.Serializable;

public class AlarmRecordEntity implements Serializable {

	private int AlarmId;
	private int deviceId;
	private String reason;
	private String content;
	private int status;
	private String results;
	private String createTime;
	
	public int getAlarmId() {
		return AlarmId;
	}
	public void setAlarmId(int alarmId) {
		AlarmId = alarmId;
	}
	public int getDeviceId() {
		return deviceId;
	}
	public void setDeviceId(int deviceId) {
		this.deviceId = deviceId;
	}
	public String getReason() {
		return reason;
	}
	public void setReason(String reason) {
		this.reason = reason;
	}
	public String getContent() {
		return content;
	}
	public void setContent(String content) {
		this.content = content;
	}
	public int getStatus() {
		return status;
	}
	public void setStatus(int status) {
		this.status = status;
	}
	public String getCreateTime() {
		return createTime;
	}
	public void setCreateTime(String createTime) {
		this.createTime = createTime;
	}
	public String getResults() {
		return results;
	}
	public void setResults(String results) {
		this.results = results;
	}
}
