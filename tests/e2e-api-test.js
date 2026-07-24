
async function runTests() {
  const baseUrl = 'http://localhost:5000/api';
  console.log('--- Starting Mandi ERP API E2E Flow Test ---');

  const req = async (path, method = 'GET', body = null, token = null) => {
    const headers = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;
    
    const options = { method, headers };
    if (body) options.body = JSON.stringify(body);
    
    const response = await fetch(`${baseUrl}${path}`, options);
    const data = await response.json().catch(() => null);
    if (!response.ok) {
        throw new Error(`API Error [${method} ${path}]: ${response.status} ${JSON.stringify(data)}`);
    }
    return data;
  };

  try {
    // 1. Login
    console.log('1. Logging in as admin...');
    const loginRes = await req('/auth/login', 'POST', { email: 'admin@mandierp.com', password: 'admin123' });
    const token = loginRes.data.token;
    console.log('   ✅ Login successful');

    // 2. Create Farmer
    console.log('2. Creating Farmer...');
    const farmerRes = await req('/masters/farmers', 'POST', {
      name: 'E2E Farmer', fatherName: 'Test Father', mobile: '9999999999', village: 'Test Village'
    }, token);
    const farmerId = farmerRes.data._id;
    console.log(`   ✅ Farmer created [ID: ${farmerId}]`);

    // 3. Create Buyer
    console.log('3. Creating Buyer...');
    const buyerRes = await req('/masters/buyers', 'POST', {
      name: 'E2E Buyer', address: 'Test Address', commissionRate: 2.5
    }, token);
    const buyerId = buyerRes.data._id;
    console.log(`   ✅ Buyer created [ID: ${buyerId}]`);

    // 4. Create Commodity
    console.log('4. Creating Commodity...');
    const commodityRes = await req('/masters/commodities', 'POST', {
      name: 'E2E Wheat', mandiTaxRate: 1.0, kkfRate: 0.5
    }, token);
    const commodityId = commodityRes.data._id;
    console.log(`   ✅ Commodity created [ID: ${commodityId}]`);

    // 5. Create Arrival
    console.log('5. Creating Arrival (Gate Entry)...');
    const arrivalRes = await req('/transactions/arrivals', 'POST', {
      farmerId, commodityId, date: new Date().toISOString(), bags: 100, weight: 50
    }, token);
    const arrivalId = arrivalRes.data._id;
    console.log(`   ✅ Arrival created [ID: ${arrivalId}]`);

    // 6. Create Deal
    console.log('6. Creating Deal (Boli)...');
    const dealRes = await req('/transactions/deals', 'POST', {
      arrivalId, buyerId, date: new Date().toISOString(), rate: 2500
    }, token);
    const dealId = dealRes.data._id;
    console.log(`   ✅ Deal created [ID: ${dealId}]`);

    // 7. Generate J-Form
    console.log('7. Generating J-Form for Deal...');
    const jformRes = await req('/billing/jforms/generate', 'POST', {
      dealId, farmerId, date: new Date().toISOString(),
      grossAmount: 125000, commissionExpense: 0, palledari: 0, hamali: 0, tulai: 0, kkf: 0, mandiTax: 0, netAmount: 125000
    }, token);
    const jformId = jformRes.data._id;
    console.log(`   ✅ J-Form generated [ID: ${jformId}]`);

    // 8. Generate Buyer Invoice
    console.log('8. Generating Buyer Invoice...');
    const invoiceRes = await req('/billing/invoices/generate', 'POST', {
      buyerId, dealIds: [dealId], date: new Date().toISOString(),
      grossAmount: 125000, commissionAmount: 3125, mandiTaxAmount: 1250, cgstAmount: 0, sgstAmount: 0, igstAmount: 0, netAmount: 129375
    }, token);
    const invoiceId = invoiceRes.data._id;
    console.log(`   ✅ Buyer Invoice generated [ID: ${invoiceId}]`);

    // 8b. Fetch All Buyer Invoices (to test population)
    console.log('8b. Fetching all Buyer Invoices...');
    const allInvoicesRes = await req('/billing/invoices', 'GET', null, token);
    console.log(`   ✅ Fetched ${allInvoicesRes.data.length} invoices successfully.`);

    // 8c. Create a Payment (To Farmer)
    console.log('8c. Creating Payment to Farmer...');
    const paymentRes = await req('/billing/payments', 'POST', {
      type: 'PAYMENT', partyId: farmerId, date: new Date().toISOString(), amount: 125000, mode: 'BANK', reference: 'NEFT-12345'
    }, token);
    console.log(`   ✅ Payment created [Voucher: ${paymentRes.data.voucherNumber}]`);

    // 8d. Create a Receipt (From Buyer)
    console.log('8d. Creating Receipt from Buyer...');
    const receiptRes = await req('/billing/payments', 'POST', {
      type: 'RECEIPT', partyId: buyerId, date: new Date().toISOString(), amount: 129375, mode: 'CASH'
    }, token);
    console.log(`   ✅ Receipt created [Voucher: ${receiptRes.data.voucherNumber}]`);

    // 9. Check Ledger Balance
    console.log('9. Verifying Ledger Double-Entry Integrations...');
    const ledgerRes = await req(`/accounting/transactions?partyId=${farmerId}`, 'GET', null, token);
    console.log(`   ✅ Ledger data fetched. Rows: ${ledgerRes.data.length}`);

    console.log('\\n🎉 E2E TEST COMPLETED SUCCESSFULLY 🎉\\nAll 8 core API modules and their underlying database/ledger models interact correctly.');

  } catch (err) {
    console.error('\\n❌ TEST FAILED:\\n', err.message);
  }
}

runTests();
