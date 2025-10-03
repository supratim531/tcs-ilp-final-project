package com.tcs.hms.complaintservice.generator;

import org.hibernate.engine.spi.SharedSessionContractImplementor;
import org.hibernate.id.IdentifierGenerator;

@SuppressWarnings("serial")
public class ComplaintIdGenerator implements IdentifierGenerator {
//	@Override
//	public Object generate(SharedSessionContractImplementor session, Object object) {
//		String uuid = UUID.randomUUID().toString().substring(0, 8).toUpperCase();
//		return "complaint-" + uuid;
//	}

	@SuppressWarnings("deprecation")
	private synchronized String generateComplaintIdFromDB(SharedSessionContractImplementor session) {
		// Fetch max number used so far
		String prefix = "complaint-";
		Integer max = (Integer) session
				.createNativeQuery(
						"SELECT COALESCE(MAX(CAST(SUBSTRING(complaint_id, 11) AS INTEGER)), 0) FROM complaints")
				.getSingleResult();

		int nextId = max + 1;
		return String.format(prefix + "%03d", nextId);
	}

	public Object generate(SharedSessionContractImplementor session, Object object) {
		return generateComplaintIdFromDB(session);
	}
}
