package com.tcs.hms.userservice.generator;

import org.hibernate.engine.spi.SharedSessionContractImplementor;
import org.hibernate.id.IdentifierGenerator;

@SuppressWarnings("serial")
public class UserIdGenerator implements IdentifierGenerator {
//	@Override
//	public Object generate(SharedSessionContractImplementor session, Object object) {
//		String uuid = UUID.randomUUID().toString().substring(0, 8).toUpperCase();
//		return "user-" + uuid;
//	}

	@SuppressWarnings("deprecation")
	private synchronized String generateUserIdFromDB(SharedSessionContractImplementor session) {
		// Fetch max number used so far
		String prefix = "user-";
		Integer max = (Integer) session
				.createNativeQuery("SELECT COALESCE(MAX(CAST(SUBSTRING(user_id, 6) AS INTEGER)), 0) FROM users")
				.getSingleResult();

		int nextId = max + 1;
		return String.format(prefix + "%03d", nextId);
	}

	public Object generate(SharedSessionContractImplementor session, Object object) {
		return generateUserIdFromDB(session);
	}
}
