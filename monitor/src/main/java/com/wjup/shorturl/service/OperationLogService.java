package com.wjup.shorturl.service;

import com.wjup.shorturl.entity.OperationLogEntity;

public interface OperationLogService {
    OperationLogEntity[] getLogs(int alarmId);

    void createLog(int alarmId, int status, String results, String userName, String operateTime);
}
