package com.tcs.hms.userservice.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.tcs.hms.userservice.entity.User;

@Repository
public interface UserRepository extends JpaRepository<User, String> {
	List<User> findByRole(String role);

	Optional<User> findByUsername(String username);

	Optional<User> findByUsernameAndPassword(String username, String password);
}
