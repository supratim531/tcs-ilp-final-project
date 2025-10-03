package com.tcs.hms.paymentservice.generator;

import org.hibernate.engine.spi.SharedSessionContractImplementor;
import org.hibernate.id.IdentifierGenerator;

@SuppressWarnings("serial")
public class InvoiceIdGenerator implements IdentifierGenerator {
//	@Override
//	public Object generate(SharedSessionContractImplementor session, Object object) {
//		String uuid = UUID.randomUUID().toString().substring(0, 8).toUpperCase();
//		return "invoice-" + uuid;
//	}

	@SuppressWarnings("deprecation")
	private synchronized String generateInvoiceIdFromDB(SharedSessionContractImplementor session) {
		// Fetch max number used so far
		String prefix = "invoice-";
		Integer max = (Integer) session
				.createNativeQuery("SELECT COALESCE(MAX(CAST(SUBSTRING(invoice_id, 9) AS INTEGER)), 0) FROM invoices")
				.getSingleResult();

		int nextId = max + 1;
		return String.format(prefix + "%03d", nextId);
	}

	public Object generate(SharedSessionContractImplementor session, Object object) {
		return generateInvoiceIdFromDB(session);
	}
}
