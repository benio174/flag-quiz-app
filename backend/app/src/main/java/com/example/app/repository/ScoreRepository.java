package com.example.app.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.example.app.model.Score;
import com.example.app.model.User;
import java.util.*;

public interface ScoreRepository extends JpaRepository<Score, Long> {
    List<Score> findByUserOrderByPoints(User user);
}
