package com.wjup.shorturl.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import com.alibaba.fastjson.JSONObject;
import com.wjup.shorturl.entity.MonitorRecordEntity;
import com.wjup.shorturl.service.MonitorRecordService;

@Controller
public class MonitorRecordController {
	
	@Autowired
	private MonitorRecordService recordService;
	
	@RequestMapping("/record")
	@ResponseBody
	public String getRecord(String deviceId, String startTime, String endTime) {
		JSONObject json = new JSONObject();
		
		try {
			MonitorRecordEntity[] records = recordService.getRecord(Integer.parseInt(deviceId), startTime, endTime);
			if(records.length != 0) {
				json.put("code", 0);
				json.put("msg", "查询成功");
				json.put("data", records);
			}
			else {
				json.put("code", 1);
				json.put("msg", "查询结果为空");
			}
		} catch(Exception e) {
			json.put("code", 2);
			json.put("msg", "查询失败");
			json.put("error", e.toString());
		}
		
		return json.toJSONString();
	}
}
