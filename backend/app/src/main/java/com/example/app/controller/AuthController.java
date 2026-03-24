package com.example.app.controller;

import java.time.LocalDateTime;
import java.util.*;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestParam;

import com.example.app.repository.ScoreRepository;
import com.example.app.repository.UserRepository;
import com.example.app.model.Score;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import com.example.app.model.User;


@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:5173")
public class AuthController {
    
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private ScoreRepository scoreRepository;

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody User user, @RequestParam(defaultValue = "pl") String lang){
        if(userRepository.findByUsername(user.getUsername()) != null){
            String message = "pl".equals(lang) ? "Użytkownik już istnieje" : "Username already exists";
            return ResponseEntity.badRequest().body(message);
        }

        userRepository.save(user);

        String successMessage = "pl".equals(lang) ? "Zarejestrowano pomyślnie" : "Registration successful";
        return ResponseEntity.ok(successMessage);
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody User loginData, @RequestParam(defaultValue = "pl") String lang){
        User user = userRepository.findByUsername(loginData.getUsername());

        if (user != null && user.getPassword().equals(loginData.getPassword())){
            return ResponseEntity.ok(user);
        }

        String errorMessage = "pl".equals(lang) ? "Błędne dane logowania" : "Invalid login data";
        return ResponseEntity.status(401).body(errorMessage);
    }

    @PostMapping("/scores")
    public ResponseEntity<?> addScore(@RequestBody Score score, @RequestParam(defaultValue = "pl") String lang){
        score.setDate(LocalDateTime.now());
        scoreRepository.save(score);
        String message = "pl".equals(lang) ? "Wynik zapisany" : "Score saved";
        return ResponseEntity.ok(message);
    }

    @GetMapping("/scores/{userId}")
    public List<Score> getUserScores(@PathVariable Long userId) { 
        User user = userRepository.findById(userId).orElse(null);
        if (user == null) return null;
        return scoreRepository.findByUserOrderByPoints(user);
    }
    
    
    
}
