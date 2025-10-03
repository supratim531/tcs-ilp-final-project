package com.tcs.hms.userservice.generator;

import org.hibernate.engine.spi.SharedSessionContractImplementor;
import org.hibernate.id.IdentifierGenerator;

@SuppressWarnings("serial")
public class BookingIdGenerator implements IdentifierGenerator {
//	@Override
//	public Object generate(SharedSessionContractImplementor session, Object object) {
//		String uuid = UUID.randomUUID().toString().substring(0, 8).toUpperCase();
//		return "booking-" + uuid;
//	}

	@SuppressWarnings("deprecation")
	private synchronized String generateBookingIdFromDB(SharedSessionContractImplementor session) {
		// Fetch max number used so far
		String prefix = "booking-";
		Integer max = (Integer) session
				.createNativeQuery("SELECT COALESCE(MAX(CAST(SUBSTRING(booking_id, 9) AS INTEGER)), 0) FROM bookings")
				.getSingleResult();

		int nextId = max + 1;
		return String.format(prefix + "%03d", nextId);
	}

	public Object generate(SharedSessionContractImplementor session, Object object) {
		return generateBookingIdFromDB(session);
	}
}
