package com.cts.model;



public class AuthRequest {
	private String username;
	private String password;

	// Constructors
	public AuthRequest() {
	}

	public String getUsername() {
		return username;
	}

	public void setUsername(String username) {
		this.username = username;
	}

	public String getPassword() {
		return password;
	}

	public void setPassword(String password) {
		this.password = password;
	}

	public AuthRequest(String username, String password, String role) {
		super();
		this.username = username;

	}

}
