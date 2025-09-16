package com.cts.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import com.cts.exception.BadRequestException;
import com.cts.exception.UserAlreadyExistsException;
import com.cts.model.User;
import com.cts.repository.UserRepository;
import com.cts.utility.JwtUtil;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private BCryptPasswordEncoder passwordEncoder;

    public String authenticate(String username, String rawPassword) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        if (!passwordEncoder.matches(rawPassword, user.getPassword())) {
            throw new BadCredentialsException("Invalid password");
        }

        return jwtUtil.generateToken(user.getUsername(), user.getRole());
    }

    public void registerUser(User user) {
    	
    	if (user == null || user.getUsername() == null || user.getUsername().trim().isEmpty()) {
    	    throw new BadRequestException("Username must not be empty");
    	}
    	if (user.getPassword() == null || user.getPassword().trim().isEmpty()) {
    	    throw new BadRequestException("Password must not be empty");
    	}

        if (userRepository.existsByUsername(user.getUsername())) {
            throw new UserAlreadyExistsException("Username '" + user.getUsername() + "' already exists");
        }

        user.setPassword(passwordEncoder.encode(user.getPassword()));
        
        if (user.getRole() == null || user.getRole().trim().isEmpty()) {
            user.setRole("USER");
        }

        userRepository.save(user);
    }
}
