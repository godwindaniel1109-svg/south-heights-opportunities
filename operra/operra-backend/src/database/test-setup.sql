-- Test data for Operra foundation testing
-- Run this after creating the schema to verify everything works

-- Test company insertion
INSERT INTO companies (name, email, phone, currency) 
VALUES ('Test Business Ltd', 'test@operra.com', '+2348012345678', 'NGN')
RETURNING id;

-- Test user insertion (will use the company_id from above)
-- Replace 'COMPANY_ID_HERE' with the actual ID returned from the previous query

INSERT INTO users (company_id, email, password_hash, first_name, last_name, phone, role)
VALUES ('COMPANY_ID_HERE', 'admin@test.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj6ukx.LFvO6', 'John', 'Doe', '+2348012345679', 'admin')
RETURNING id;

-- Test customer insertion
INSERT INTO customers (company_id, name, email, phone, address, outstanding_balance, total_purchases)
VALUES ('COMPANY_ID_HERE', 'Customer A', 'customer@example.com', '+2348012345680', '123 Test Street, Lagos', 5000.00, 25000.00)
RETURNING id;

-- Test product insertion
INSERT INTO products (company_id, name, description, price, category)
VALUES ('COMPANY_ID_HERE', 'Professional Service', 'Consulting service package', 15000.00, 'Services')
RETURNING id;

-- Test invoice insertion
INSERT INTO invoices (company_id, customer_id, invoice_number, issue_date, due_date, status, subtotal, tax_amount, tax_percentage, total_amount, paid_amount, notes, created_by)
VALUES ('COMPANY_ID_HERE', 'CUSTOMER_ID_HERE', 'INV-001', CURRENT_DATE, CURRENT_DATE + INTERVAL '30 days', 'sent', 15000.00, 0.00, 0.00, 15000.00, 0.00, 'Payment due in 30 days', 'USER_ID_HERE')
RETURNING id;

-- Test expense insertion
INSERT INTO expenses (company_id, description, amount, category, expense_date, notes, created_by)
VALUES ('COMPANY_ID_HERE', 'Office Rent', 50000.00, 'rent', CURRENT_DATE, 'Monthly office rent payment', 'USER_ID_HERE')
RETURNING id;

-- Test task insertion
INSERT INTO tasks (company_id, title, description, assigned_to, created_by, status, priority, due_date)
VALUES ('COMPANY_ID_HERE', 'Setup Customer Database', 'Import existing customer records into the system', 'USER_ID_HERE', 'USER_ID_HERE', 'todo', 'high', CURRENT_DATE + INTERVAL '7 days')
RETURNING id;

-- Test activity log insertion
INSERT INTO activity_logs (company_id, user_id, action, entity_type, entity_id, new_values)
VALUES ('COMPANY_ID_HERE', 'USER_ID_HERE', 'created', 'customer', 'CUSTOMER_ID_HERE', '{"name": "Customer A", "email": "customer@example.com"}')
RETURNING id;

-- Test queries to verify data isolation
SELECT 'Companies count:' as info, COUNT(*) as count FROM companies;

SELECT 'Users count:' as info, COUNT(*) as count FROM users;

SELECT 'Customers count:' as info, COUNT(*) as count FROM customers;

-- Test company isolation (should return 0 if no company_id is provided)
SELECT 'Isolated customers (no company):' as info, COUNT(*) as count FROM customers WHERE company_id IS NULL;

-- Test specific company data (replace with actual company_id)
SELECT 'Test company customers:' as info, COUNT(*) as count FROM customers WHERE company_id = 'COMPANY_ID_HERE';
