package com.tcs.hms.roomservice.generator;

import org.hibernate.engine.spi.SharedSessionContractImplementor;
import org.hibernate.id.IdentifierGenerator;

@SuppressWarnings("serial")
public class RoomIdGenerator implements IdentifierGenerator {
//	@Override
//	public Object generate(SharedSessionContractImplementor session, Object object) {
//		String uuid = UUID.randomUUID().toString().substring(0, 8).toUpperCase();
//		return "room-" + uuid;
//	}

	@SuppressWarnings("deprecation")
	private synchronized String generateRoomIdFromDB(SharedSessionContractImplementor session) {
		// Fetch max number used so far
		String prefix = "room-";
		Integer max = (Integer) session
				.createNativeQuery("SELECT COALESCE(MAX(CAST(SUBSTRING(room_id, 6) AS INTEGER)), 0) FROM rooms")
				.getSingleResult();

		int nextId = max + 1;
		return String.format(prefix + "%03d", nextId);
	}

	public Object generate(SharedSessionContractImplementor session, Object object) {
		return generateRoomIdFromDB(session);
	}
}
