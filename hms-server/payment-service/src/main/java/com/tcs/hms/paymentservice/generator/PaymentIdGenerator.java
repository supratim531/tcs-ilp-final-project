package com.tcs.hms.paymentservice.generator;

import org.hibernate.engine.spi.SharedSessionContractImplementor;
import org.hibernate.id.IdentifierGenerator;

@SuppressWarnings("serial")
public class PaymentIdGenerator implements IdentifierGenerator {
//	@Override
//	public Object generate(SharedSessionContractImplementor session, Object object) {
//		String uuid = UUID.randomUUID().toString().substring(0, 8).toUpperCase();
//		return "payment-" + uuid;
//	}

	@SuppressWarnings("deprecation")
	private synchronized String generatePaymentIdFromDB(SharedSessionContractImplementor session) {
		// Fetch max number used so far
		String prefix = "payment-";
		Integer max = (Integer) session
				.createNativeQuery("SELECT COALESCE(MAX(CAST(SUBSTRING(payment_id, 9) AS INTEGER)), 0) FROM payments")
				.getSingleResult();

		int nextId = max + 1;
		return String.format(prefix + "%03d", nextId);
	}

	public Object generate(SharedSessionContractImplementor session, Object object) {
		return generatePaymentIdFromDB(session);
	}
}
