package com.wjup.shorturl.service.serviceimpl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.wjup.shorturl.entity.UserEntity;
import com.wjup.shorturl.mapper.UserMapper;
import com.wjup.shorturl.service.UserService;

@Service
public class UserServiceImpl implements UserService {

	@Autowired
	private UserMapper userMapper;
	
	@Override
	public int createUser(UserEntity user) {
		return userMapper.createUser(user);
	}

	@Override
	public UserEntity findByUserName(String userName) {
		return userMapper.findByUserName(userName);
	}

	@Override
	public void updatePwdById(int userId, String password) {
		userMapper.updatePwdById(userId, password);
	}

	@Override
	public UserEntity findUserById(int userId) {
		return userMapper.findUserById(userId);
	}

}
