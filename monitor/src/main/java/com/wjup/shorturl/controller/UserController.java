/**
 * 
 */
package com.wjup.shorturl.controller;

import javax.servlet.http.HttpServletRequest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DuplicateKeyException;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import com.alibaba.fastjson.JSONObject;
import com.wjup.shorturl.entity.UserEntity;
import com.wjup.shorturl.service.UserService;
import com.wjup.shorturl.token.TokenUtils;

/**
 * @author 67438
 *
 */
@Controller
public class UserController {
	
	@Autowired
	private UserService userService;
	
	@RequestMapping("/register")
	@ResponseBody
	public String register(String userName, String password, int roleId, HttpServletRequest request) {
		JSONObject json = new JSONObject();
		
		UserEntity userEntity = new UserEntity();
		userEntity.setUserName(userName);
		userEntity.setPassWord(password);
		userEntity.setRoleId(roleId);
		
		try {
			userService.createUser(userEntity);
			json.put("code", 0);
			json.put("msg", "注册成功");
		}catch(Exception e) {
			if(e instanceof DuplicateKeyException) {
				json.put("code", 1);
				json.put("msg", "注册失败，用户名已存在");
			}
			else {
				json.put("code", 2);
				json.put("msg", e.toString());
			}
			
		}
		
		return json.toJSONString();
	}
	
	@RequestMapping("/login")
	@ResponseBody
	public String login(String userName, String password) {
		JSONObject json = new JSONObject();
		
		UserEntity user = userService.findByUserName(userName);
		
		if(user.getPassWord().equals(password)) {
			json.put("code", 0);
			json.put("msg", "登录成功");
			json.put("token", TokenUtils.getToken(String.valueOf(user.getUserId())));
			json.put("user", user);
		}else {
			json.put("code", 1);
			json.put("msg", "用户名或密码错误，请重试");
		}
		
		return json.toJSONString();
		
	}
	

}
