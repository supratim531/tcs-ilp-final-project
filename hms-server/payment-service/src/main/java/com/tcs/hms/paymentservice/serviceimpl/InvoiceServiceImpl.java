package com.tcs.hms.paymentservice.serviceimpl;

import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.tcs.hms.paymentservice.entity.Invoice;
import com.tcs.hms.paymentservice.repository.InvoiceRepository;
import com.tcs.hms.paymentservice.service.InvoiceService;

@Service
public class InvoiceServiceImpl implements InvoiceService {
	@Autowired
	private InvoiceRepository invoiceRepository;

	@Override
	public Invoice findInvoiceByBookingId(String bookingId) {
		List<Invoice> invoices = invoiceRepository.findByBookingId(bookingId);
		if (invoices.isEmpty()) {
			throw new RuntimeException("Invoice not found for bookingId: " + bookingId);
		}
		return invoices.stream().sorted(Comparator.comparing(Invoice::getIssuedAt).reversed())
				.collect(Collectors.toList()).get(0);
	}

	@Override
	public Boolean deleteInvoicesByBookingId(String bookingId) {
		invoiceRepository.findByBookingId(bookingId).forEach(e -> {
			invoiceRepository.deleteById(e.getInvoiceId());
		});
		return true;
	}
}
