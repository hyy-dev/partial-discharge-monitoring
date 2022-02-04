package com.wjup.shorturl.mapper;

import org.apache.ibatis.annotations.Param;
import org.springframework.stereotype.Repository;

import com.wjup.shorturl.entity.UserEntity;

@Repository
public interface UserMapper {
	int createUser(UserEntity user);
	
	UserEntity findByUserName(String userName);
	
	UserEntity findUserById(int userId);
	
	void updatePwdById(@Param("userId") int userId, @Param("password") String password);
	
}
