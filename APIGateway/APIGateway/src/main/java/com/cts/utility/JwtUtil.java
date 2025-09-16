package com.cts.utility;

import java.security.Key;
import java.util.Date;

import org.springframework.stereotype.Component;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;

@Component
public class JwtUtil {

	private final String SECRET_KEY = "755e4400ca9b850a43dd026081259da308374e93f7e85a5b3d205036c0d9fd4c"; // Must be at
	// least 32
	// bytes
	private final Key key = Keys.hmacShaKeyFor(SECRET_KEY.getBytes());

	public String extractUsername(String token) {
		return extractClaims(token).getSubject();
	}

	public String generateToken(String username, String role) {
		return Jwts.builder().setSubject(username).claim("role", role).setIssuedAt(new Date())
				.setExpiration(new Date(System.currentTimeMillis() + 1000 * 60 * 60 * 10)) // 10 hours
				.signWith(key, SignatureAlgorithm.HS256).compact();
	}

	public Claims extractClaims(String token) {
		
		 return Jwts.parserBuilder()
				    .setSigningKey(key)
	                .build()
	                .parseClaimsJws(token)
	                .getBody();
	}

	public String extractRole(String token) {
		return extractClaims(token).get("role", String.class);
	}

	public boolean isTokenValid(String token) {
		return !extractClaims(token).getExpiration().before(new Date());
	}

}
