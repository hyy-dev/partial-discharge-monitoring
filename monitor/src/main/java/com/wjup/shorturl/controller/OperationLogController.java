package com.wjup.shorturl.controller;

import com.alibaba.fastjson.JSONObject;
import com.wjup.shorturl.entity.MonitorRecordEntity;
import com.wjup.shorturl.entity.OperationLogEntity;
import com.wjup.shorturl.service.OperationLogService;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

@Api(value = "报警操作日志管理", description = "报警操作日志管理 API", protocols = "http")
@Controller
@RequestMapping("/api")
public class OperationLogController {

    @Autowired
    OperationLogService logService;

    @ApiOperation(value = "获取操作日志", httpMethod = "GET")
    @RequestMapping("/log")
    @ResponseBody
    public String getLog(int alarmId) {
        JSONObject json = new JSONObject();

        try {
            OperationLogEntity[] logs = logService.getLogs(alarmId);
            json.put("code", 0);
            json.put("msg", "查询成功");
            json.put("data", logs);
        } catch (Exception e) {
            json.put("code", 1);
            json.put("msg", "查询失败");
            json.put("error", e.toString());
        }

        return json.toJSONString();
    }
}
