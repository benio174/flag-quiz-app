package com.example.app.model;
import jakarta.persistence.*;

@Entity
@Table(name = "countries")

public class Country {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;
    private String flagUrl;
    private String continent;
    private String name_en;
    
    
    public void setId(Long id) {
        this.id = id;
    }
    public void setName(String name) {
        this.name = name;
    }
    public void setFlagUrl(String flagUrl) {
        this.flagUrl = flagUrl;
    }

    public void setContinent(String continent){
        this.continent = continent;
    }

    public void setName_en(String name_en) {
        this.name_en = name_en;
    }

    
    public Long getId() {
        return id;
    }
    public String getName() {
        return name;
    }
    public String getFlagUrl() {
        return flagUrl;
    }

    public String getContinent(){
        return continent;
    }

    public String getName_en(){
        return name_en;
    }

    
}
