package com.wjup.shorturl.controller;

import javax.servlet.http.HttpServletRequest;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DuplicateKeyException;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import com.alibaba.fastjson.JSONObject;
import com.wjup.shorturl.entity.DeviceEntity;
import com.wjup.shorturl.entity.UserEntity;
import com.wjup.shorturl.service.DeviceService;
import com.wjup.shorturl.service.UserService;
import com.wjup.shorturl.token.TokenUtils;

@Controller
@Api(value = "设备管理",description = "设备管理操作 API", protocols = "http")
public class DeviceController {
	
	@Autowired
	private DeviceService deviceService;
	
	@Autowired
	private UserService userService;

	@ApiOperation(value = "获取设备列表", httpMethod = "GET",
			produces="application/json")
	@RequestMapping("/devices")
	@ResponseBody
	public String getDevices() {
		JSONObject json = new JSONObject();
		
		try {
			DeviceEntity[] devices = deviceService.getDevices();
			json.put("code", 0);
			json.put("msg", "请求成功");
			json.put("data", devices);
		}catch(Exception e) {
			json.put("code", 1);
			json.put("msg", "请求失败");
			json.put("error", e.toString());
		}
		
		return json.toJSONString();
	}

	@ApiOperation(value = "根据id查询设备", httpMethod = "GET",
			produces="application/json")
	@RequestMapping(value = "/device/{id}")
	@ResponseBody
	public String getDeviceById(@PathVariable("id") String deviceId) {
		JSONObject json = new JSONObject();
		
		try {
			DeviceEntity device = deviceService.getDeviceById(Integer.parseInt(deviceId));
			if(device != null) {
				json.put("code", 0);
				json.put("msg", "请求成功");
				json.put("data", device);
			}
			else {
				json.put("code", 1);
				json.put("msg", "设备不存在");
			}
		}catch(Exception e) {
			json.put("code", 2);
			json.put("msg", "服务器出错，请稍后再试");
			json.put("error", e.toString());
		}
		
		return json.toJSONString();
	}

	@ApiOperation(value = "根据设备名称查询", httpMethod = "GET",
			produces="application/json")
	@RequestMapping(value = "/devices/{name}")
	@ResponseBody
	public String getDeviceByName(@PathVariable("name") String name) {
		JSONObject json = new JSONObject();
		
		try {
			DeviceEntity[] devices = deviceService.getDeviceByName(name);
			if(devices.length != 0) {
				json.put("code", 0);
				json.put("msg", "请求成功");
				json.put("data", devices);
			}
			else {
				json.put("code", 1);
				json.put("msg", "设备不存在");
			}
		}catch(Exception e) {
			json.put("code", 2);
			json.put("msg", "服务器出错，请稍后再试");
			json.put("error", e.toString());
		}
		
		return json.toJSONString();
	}

	@ApiOperation(value = "增加设备", httpMethod = "POST",
			produces="application/json", consumes = "application/json")
	@RequestMapping(value="/addDevice")
	@ResponseBody
	public String addDevice(HttpServletRequest request, String deviceId, String name, String type, String sortWeight) {
		JSONObject json = new JSONObject();
		
		// 用户鉴权
		JSONObject checkResult = checkAuthority(userService, request.getHeader("Authorization"));
		if(checkResult.get("code") != null && checkResult.get("code").equals(1)) {
			return checkResult.toJSONString();
		}
		
		DeviceEntity device = new DeviceEntity();
		device.setDeviceId(Integer.parseInt(deviceId));
		device.setName(name);
		device.setType(Integer.parseInt(type));
		device.setSortWeight(Integer.parseInt(sortWeight));
		
		try {
			deviceService.createDevice(device);
			json.put("code", 0);
			json.put("msg", "添加设备成功");
		}catch(Exception e) {
			json.put("code", 2);
			json.put("msg", "添加失败");
			json.put("error", e.toString());
			if(e instanceof DuplicateKeyException) {
				json.put("error", "设备id已存在，请先删除原设备或更换设备id重试");
			}
		}
		
		return json.toJSONString();
	}

	@ApiOperation(value = "根据id删除设备", httpMethod = "DELETE",
			produces="application/json", consumes = "application/json")
	@RequestMapping(value="/deleteDevice/{id}")
	@ResponseBody
	public String deleteDevice(HttpServletRequest request,@PathVariable("id") String id) {
		JSONObject json = new JSONObject();
		
		JSONObject checkResult = checkAuthority(userService, request.getHeader("Authorization"));
		if(checkResult.get("code") != null && checkResult.get("code").equals(1)) {
			return checkResult.toJSONString();
		}
		
		try {
			DeviceEntity device = deviceService.getDeviceById(Integer.parseInt(id));
			if(device == null) {
				json.put("code", 2);
				json.put("msg", "删除失败，设备不存在");
				return json.toJSONString();
			}
			deviceService.deleteDeviceById(Integer.parseInt(id));
			json.put("code", 0);
			json.put("msg", "删除设备成功");
		} catch(Exception e) {
			json.put("code", 2);
			json.put("msg", "删除失败");
			json.put("error", e.toString());
		}
		
		return json.toJSONString();
	}

	@ApiOperation(value = "更新设备信息", httpMethod = "POST",
			produces="application/json", consumes = "application/json")
	@RequestMapping(value="/updateDevice")
	@ResponseBody
	public String updateDevice(HttpServletRequest request, String id, String name, String type, String sortWeight) {
		JSONObject json = new JSONObject();
		JSONObject checkResult = checkAuthority(userService, request.getHeader("Authorization"));
		if(checkResult.get("code") != null && checkResult.get("code").equals(1)) {
			return checkResult.toJSONString();
		}
		
		DeviceEntity device = new DeviceEntity();
		device.setDeviceId(Integer.parseInt(id));
		device.setName(name);
		device.setType(Integer.parseInt(type));
		device.setSortWeight(Integer.parseInt(sortWeight));
		
		try {
			DeviceEntity checkDevice = deviceService.getDeviceById(Integer.parseInt(id));
			if(checkDevice == null) {
				json.put("code", 2);
				json.put("msg", "修改失败，设备不存在");
				return json.toJSONString();
			}
			deviceService.updateDeviceById(device);
			json.put("code", 0);
			json.put("msg", "修改设备信息成功");
		}catch(Exception e) {
			json.put("code", 1);
			json.put("msg", "修改失败");
			json.put("error", e.toString());
		}
		
		return json.toJSONString();
	}
	
	
	static JSONObject checkAuthority(UserService userService, String token) {
		JSONObject json = new JSONObject();
		String checkToken = TokenUtils.checkToken(token);
		if(checkToken=="G" || checkToken=="S") { 
			json.put("code", 1);
			json.put("msg", "登录失效，请重新登录");
			return json;
		}else if(checkToken == "F") {
			json.put("code", 1);
			json.put("msg", "用户身份认证失败，请重新登录");
			return json;
		}
		
		UserEntity user = userService.findUserById(Integer.parseInt(checkToken));
		if(user.getRoleId() != 1) {
			json.put("code", 1);
			json.put("msg", "无权限");
			return json;
		}
		return json;
	}
	
}
