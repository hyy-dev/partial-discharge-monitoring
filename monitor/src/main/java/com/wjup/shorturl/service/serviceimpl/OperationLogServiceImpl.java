package com.wjup.shorturl.service.serviceimpl;

import com.wjup.shorturl.entity.OperationLogEntity;
import com.wjup.shorturl.mapper.OperationLogMapper;
import com.wjup.shorturl.service.OperationLogService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class OperationLogServiceImpl implements OperationLogService {

    @Autowired
    OperationLogMapper mapper;

    @Override
    public OperationLogEntity[] getLogs(int alarmId) {
        return mapper.getLogs(alarmId);
    }

    @Override
    public void createLog(int alarmId, int status, String results, String userName, String operateTime) {
        mapper.createLog(alarmId, status, results, userName, operateTime);
    }
}
