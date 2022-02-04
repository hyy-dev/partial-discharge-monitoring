package com.wjup.shorturl.entity;

import java.io.Serializable;

public class MonitorRecordEntity implements Serializable {

	private int recordId;
	private int deviceId;
	private double qpda;
	private double qpdp;
	private double qsda;
	private double qsdp;
	private String collectedTime;
	
	public int getRecordId() {
		return recordId;
	}
	public void setRecordId(int recordId) {
		this.recordId = recordId;
	}
	public int getDeviceId() {
		return deviceId;
	}
	public void setDeviceId(int deviceId) {
		this.deviceId = deviceId;
	}
	public double getQpda() {
		return qpda;
	}
	public void setQpda(double qpda) {
		this.qpda = qpda;
	}
	public double getQpdp() {
		return qpdp;
	}
	public void setQpdp(double qpdp) {
		this.qpdp = qpdp;
	}
	public double getQsda() {
		return qsda;
	}
	public void setQsda(double qsda) {
		this.qsda = qsda;
	}
	public double getQsdp() {
		return qsdp;
	}
	public void setQsdp(double qsdp) {
		this.qsdp = qsdp;
	}
	public String getCollectedTime() {
		return collectedTime;
	}
	public void setCollectedTime(String collectedTime) {
		this.collectedTime = collectedTime;
	}
	
	
}
