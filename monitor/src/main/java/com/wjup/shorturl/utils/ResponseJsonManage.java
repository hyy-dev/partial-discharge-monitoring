package com.wjup.shorturl.utils;

import com.alibaba.fastjson.JSONObject;

public class ResponseJsonManage {
	public static JSONObject okStatus(JSONObject json) {
		json.put("code", 0);
		json.put("msg", "请求成功");
		
		return json;
	}
}
