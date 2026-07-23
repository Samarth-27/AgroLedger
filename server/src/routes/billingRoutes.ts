import { Router } from 'express';
import { jFormController } from '@controllers/JFormController';
import { buyerInvoiceController } from '@controllers/BuyerInvoiceController';
import { paymentReceiptController } from '@controllers/PaymentReceiptController';

const router = Router();

// JForms (Farmer Settlements)
router.post('/jforms/generate', jFormController.generate.bind(jFormController));
router.get('/jforms', jFormController.getAll.bind(jFormController));
router.get('/jforms/:id', jFormController.getById.bind(jFormController));

// Buyer Invoices
router.post('/invoices/generate', buyerInvoiceController.generate.bind(buyerInvoiceController));
router.get('/invoices', buyerInvoiceController.getAll.bind(buyerInvoiceController));
router.get('/invoices/:id', buyerInvoiceController.getById.bind(buyerInvoiceController));

// Payments & Receipts
router.post('/payments', paymentReceiptController.create.bind(paymentReceiptController));
router.get('/payments', paymentReceiptController.getAll.bind(paymentReceiptController));
router.get('/payments/:id', paymentReceiptController.getById.bind(paymentReceiptController));
router.get('/payments/party/:partyId', paymentReceiptController.getByParty.bind(paymentReceiptController));

export { router as billingRoutes };
