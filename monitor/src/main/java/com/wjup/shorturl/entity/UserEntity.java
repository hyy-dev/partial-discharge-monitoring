/**
 * 
 */
package com.wjup.shorturl.entity;

import java.io.Serializable;

/**
 * @author huangyuanyuan
 *
 */
public class UserEntity implements Serializable {
	
	/**
	 * 用户类
	 */
	private static final long serialVersionUID = 1L;
	private int userId;
    private String userName;
    private String passWord;
    private int roleId; // 用户角色 0：普通用户 1：管理员
    
	public String getUserName() {
		return userName;
	}
	public void setUserName(String userName) {
		this.userName = userName;
	}
	public String getPassWord() {
		return passWord;
	}
	public void setPassWord(String passWord) {
		this.passWord = passWord;
	}
	public int getRoleId() {
		return roleId;
	}
	public void setRoleId(int roleId) {
		this.roleId = roleId;
	}
	public int getUserId() {
		return userId;
	}
	public void setUserId(int userId) {
		this.userId = userId;
	}
    
    
    
}
