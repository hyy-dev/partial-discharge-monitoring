package com.wjup.shorturl.mapper;

import com.wjup.shorturl.entity.OperationLogEntity;
import org.springframework.stereotype.Repository;

@Repository
public interface OperationLogMapper {
    OperationLogEntity[] getLogs(int alarmId);

    void createLog(int alarmId, int status, String results, String userName, String operateTime);
}
