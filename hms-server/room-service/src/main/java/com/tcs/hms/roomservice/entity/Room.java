package com.tcs.hms.roomservice.entity;

import org.hibernate.annotations.GenericGenerator;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
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
@Table(name = "rooms")
public class Room {
	@Id
	@SuppressWarnings("deprecation")
	@GeneratedValue(generator = "custom-room-id-generator")
	@GenericGenerator(name = "custom-room-id-generator", strategy = "com.tcs.hms.roomservice.generator.RoomIdGenerator")
	@Column(name = "room_id")
	private String roomId;

	@Column(name = "room_number", unique = true)
	private Integer roomNumber;

	@Column(name = "room_type")
	private String roomType;

	@Column(name = "price_per_night")
	private Double pricePerNight;

	@Builder.Default
	@Column(name = "room_status")
	private String roomStatus = "Available";

	@Builder.Default
	@Column(name = "availability")
	private Boolean availability = true;

	@Column(name = "num_of_adults")
	private Integer numberOfAdults;

	@Column(name = "num_of_children")
	private Integer numberOfChildren;

	@Column(name = "max_occupancy")
	private Integer maxOccupancy;

	@Column(name = "description", nullable = true)
	private String description;
}
