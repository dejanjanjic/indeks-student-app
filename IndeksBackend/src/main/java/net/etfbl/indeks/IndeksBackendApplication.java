package net.etfbl.indeks;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

@SpringBootApplication
@EnableScheduling
public class IndeksBackendApplication {
	public static void main(String[] args) {
		SpringApplication.run(IndeksBackendApplication.class, args);


	}
}
