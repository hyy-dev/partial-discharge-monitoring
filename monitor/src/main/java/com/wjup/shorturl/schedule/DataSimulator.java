package com.wjup.shorturl.schedule;

import com.wjup.shorturl.entity.DeviceEntity;
import com.wjup.shorturl.entity.MonitorRecordEntity;
import com.wjup.shorturl.entity.RecordSpanEntity;
import com.wjup.shorturl.mapper.MonitorRecordMapper;
import com.wjup.shorturl.service.DeviceService;
import com.wjup.shorturl.service.MonitorRecordService;
import com.wjup.shorturl.service.serviceimpl.MonitorRecordImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.annotation.Scheduled;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Date;

@Configuration
@EnableScheduling
public class DataSimulator {

    @Autowired
    private MonitorRecordService monitorRecordService;
    @Autowired
    private DeviceService deviceService;

    private long INTERVAL = 12 * 60 * 60 * 1000; // 模拟数据时间差 默认为12小时

    @Scheduled(cron = "0 0 0/1 * * ?")
    private void simulateData() {
        SimpleDateFormat ft = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        System.out.println("模拟数据" + ft.format(new Date()));
        DeviceEntity[] devices = deviceService.getDevices();
        for (int i = 0; i < devices.length; i++) {
            DeviceEntity device = devices[i];

            RecordSpanEntity span = monitorRecordService.getRecordSpan(device.getDeviceId());
            if (span == null) continue;
            try {
                Date lastTime = ft.parse(span.getLastCollectedTime());
                // 时间差大于4小时需要插入数据
                while (new Date().getTime() - lastTime.getTime() > INTERVAL) {
                    // 时间递增
                    lastTime = new Date(lastTime.getTime() + INTERVAL);
                    MonitorRecordEntity record = new MonitorRecordEntity();
                    record.setDeviceId(device.getDeviceId());
                    record.setCollectedTime(ft.format(lastTime));
                    record.setQpda(getRandom(span.getMinQpda(), span.getMaxQpda()));
                    record.setQsda(getRandom(span.getMinQsda(), span.getMaxQsda()));
                    // 判断 不能小于平均值 最大值设为1000控制报警比例
                    record.setQpdp(getRandom(span.getMinQpdp() < record.getQpda() ? record.getQpda() : span.getMinQpdp(),
                            span.getMaxQpdp() > 1000 ? 1000 : span.getMaxQpdp()));
                    record.setQsdp(getRandom(span.getMinQsdp() < record.getQsda() ? record.getQsda() : span.getMinQsdp(),
                            span.getMaxQsdp() > 1000 ? 1000 : span.getMaxQsdp()));
                    monitorRecordService.createRecord(record);
                }
            } catch (Exception e) {
                continue;
            }
        }

    }

    int getRandom(double min, double max) {
        return (int) (Math.random() * (max - min) + min);
    }
}
