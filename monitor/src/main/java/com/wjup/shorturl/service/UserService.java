/**
 * 
 */
package com.wjup.shorturl.service;

import com.wjup.shorturl.entity.UserEntity;

/**
 * @author 67438
 *
 */
public interface UserService {
	int createUser(UserEntity user);
	
	UserEntity findByUserName(String userName);
	
	UserEntity findUserById(int userId);
	
	void updatePwdById(int userId, String password);
	
}
