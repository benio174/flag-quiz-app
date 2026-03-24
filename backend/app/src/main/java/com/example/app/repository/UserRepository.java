package com.example.app.repository;

import org.hibernate.boot.models.JpaAnnotations;
import com.example.app.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User, Long> {
    User findByUsername(String username);
} 