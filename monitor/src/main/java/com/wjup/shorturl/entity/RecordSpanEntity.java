package com.wjup.shorturl.entity;

public class RecordSpanEntity {

    private int deviceId;

    private double minQpda;
    private double maxQpda;

    private double minQpdp;
    private double maxQpdp;

    private double minQsda;
    private double maxQsda;

    private double minQsdp;
    private double maxQsdp;

    private String lastCollectedTime;

    public int getDeviceId() {
        return deviceId;
    }

    public void setDeviceId(int deviceId) {
        this.deviceId = deviceId;
    }

    public String getLastCollectedTime() {
        return lastCollectedTime;
    }

    public void setLastCollectedTime(String lastCollectedTime) {
        this.lastCollectedTime = lastCollectedTime;
    }

    public double getMinQpda() {
        return minQpda;
    }

    public void setMinQpda(double minQpda) {
        this.minQpda = minQpda;
    }

    public double getMaxQpda() {
        return maxQpda;
    }

    public void setMaxQpda(double maxQpda) {
        this.maxQpda = maxQpda;
    }

    public double getMinQpdp() {
        return minQpdp;
    }

    public void setMinQpdp(double minQpdp) {
        this.minQpdp = minQpdp;
    }

    public double getMaxQpdp() {
        return maxQpdp;
    }

    public void setMaxQpdp(double maxQpdp) {
        this.maxQpdp = maxQpdp;
    }

    public double getMinQsda() {
        return minQsda;
    }

    public void setMinQsda(double minQsda) {
        this.minQsda = minQsda;
    }

    public double getMaxQsda() {
        return maxQsda;
    }

    public void setMaxQsda(double maxQsda) {
        this.maxQsda = maxQsda;
    }

    public double getMinQsdp() {
        return minQsdp;
    }

    public void setMinQsdp(double minQsdp) {
        this.minQsdp = minQsdp;
    }

    public double getMaxQsdp() {
        return maxQsdp;
    }

    public void setMaxQsdp(double maxQsdp) {
        this.maxQsdp = maxQsdp;
    }


    @Override
    public String toString() {
        return "RecordSpanEntity{" +
                "deviceId=" + deviceId +
                ", minQpda=" + minQpda +
                ", maxQpda=" + maxQpda +
                ", minQpdp=" + minQpdp +
                ", maxQpdp=" + maxQpdp +
                ", minQsda=" + minQsda +
                ", maxQsda=" + maxQsda +
                ", minQsdp=" + minQsdp +
                ", maxQsdp=" + maxQsdp +
                ", lastCollectedTime='" + lastCollectedTime + '\'' +
                '}';
    }
}
