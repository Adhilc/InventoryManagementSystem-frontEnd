package com.cts.exception;

import java.time.LocalDateTime;

public class ErrorResponse {

	private int status;
	private String message;
	private LocalDateTime time;
	public int getStatus() {
		return status;
	}
	public void setStatus(int status) {
		this.status = status;
	}
	public String getMessage() {
		return message;
	}
	public void setMessage(String message) {
		this.message = message;
	}
	public LocalDateTime getTime() {
		return time;
	}
	public ErrorResponse() {
		super();
	}
	public ErrorResponse(int status, String message, LocalDateTime time) {
		super();
		this.status = status;
		this.message = message;
		this.time = time;
	}
	public void setTime(LocalDateTime time) {
		this.time = time;
	}
}
