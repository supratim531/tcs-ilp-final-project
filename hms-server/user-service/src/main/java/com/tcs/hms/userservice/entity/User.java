package com.tcs.hms.userservice.entity;

import java.time.LocalDateTime;

import org.hibernate.annotations.GenericGenerator;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EntityListeners;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor

@Entity
@Table(name = "users")
@EntityListeners(AuditingEntityListener.class)
public class User {
	@Id
	@SuppressWarnings("deprecation")
	@GeneratedValue(generator = "custom-user-id-generator")
	@GenericGenerator(name = "custom-user-id-generator", strategy = "com.tcs.hms.userservice.generator.UserIdGenerator")
	@Column(name = "user_id")
	private String userId;

	@Column(name = "full_name")
	private String fullName;

	@Column(name = "email", unique = true)
	private String email;

	@Column(name = "phone", unique = true)
	private String phone;

	@Column(name = "address")
	private String address;

	@Column(name = "username", unique = true)
	private String username;

	@Column(name = "password")
	private String password;

	@Builder.Default
	@Column(name = "role")
	private String role = "CUSTOMER";

	@Builder.Default
	@Column(name = "is_account_locked")
	private boolean isAccountLocked = false;

	@Builder.Default
	@Column(name = "number_of_attempts")
	private Integer numberOfAttempts = 0;

	@CreatedDate
	@Column(name = "created_at", updatable = false)
	private LocalDateTime createdAt;

	@LastModifiedDate
	@Column(name = "updated_at")
	private LocalDateTime updatedAt;
}
