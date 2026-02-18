-- ADU Cash Flow tables
-- Tracks rental income, expenses, deposits, and owner payouts for Mike's ADU

CREATE TABLE IF NOT EXISTS adu_transactions (
  id SERIAL PRIMARY KEY,
  date DATE NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('Income', 'Deposit', 'Deposit Refund', 'Deposit Usage', 'Expense', 'Management Fee', 'Cleaning', 'Capital Improvement', 'Owner Payout')),
  description TEXT NOT NULL,
  amount_in NUMERIC(10,2) NOT NULL DEFAULT 0,
  amount_out NUMERIC(10,2) NOT NULL DEFAULT 0,
  tenant TEXT DEFAULT '',
  notes TEXT DEFAULT '',
  category TEXT DEFAULT '',
  month_year TEXT NOT NULL,
  deposit_usage_amount NUMERIC(10,2),
  management_fee_percentage NUMERIC(5,2),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS adu_settings (
  id SERIAL PRIMARY KEY,
  buffer_amount NUMERIC(10,2) NOT NULL DEFAULT 1000,
  management_fee_percentage NUMERIC(5,2) NOT NULL DEFAULT 30,
  owner_name TEXT NOT NULL DEFAULT 'Mike',
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert default settings
INSERT INTO adu_settings (buffer_amount, management_fee_percentage, owner_name)
VALUES (1000, 30, 'Mike');

-- Seed with existing transaction data
INSERT INTO adu_transactions (id, date, type, description, amount_in, amount_out, tenant, notes, category, month_year) VALUES
(1000, '2025-05-14', 'Deposit', 'Security Deposit Venmo', 500, 0, 'Patrick Gallagher', 'Deposit Received', 'Deposit', '2025-05');

INSERT INTO adu_transactions (id, date, type, description, amount_in, amount_out, tenant, notes, category, month_year, management_fee_percentage) VALUES
(1001, '2025-06-08', 'Income', 'Rent income venmo', 4515, 0, 'Patrick Gallagher', 'Rent Received', 'Rent', '2025-06', 30);

INSERT INTO adu_transactions (id, date, type, description, amount_in, amount_out, tenant, notes, category, month_year, deposit_usage_amount) VALUES
(1002, '2025-07-29', 'Deposit Usage', 'Cleaning from deposit', 0, 0, 'Patrick Gallagher', 'Used from security deposit', 'Deposit Usage', '2025-07', 200);

INSERT INTO adu_transactions (id, date, type, description, amount_in, amount_out, tenant, notes, category, month_year) VALUES
(1003, '2025-07-29', 'Cleaning', 'Cleaning Fee Paid', 0, 200, 'Patrick Gallagher', 'Paid to cleaner', 'Cleaning', '2025-07'),
(1004, '2025-06-08', 'Management Fee', 'Management Fee - June', 0, 1354.50, 'Patrick Gallagher', '30% of $4,515', 'Management', '2025-06'),
(1005, '2025-07-01', 'Owner Payout', 'Owner Payout - Patrick Gallagher Period', 0, 3160.50, 'Patrick Gallagher', '70% of $4,515 rent', 'Owner Payout', '2025-07'),
(1006, '2025-07-31', 'Deposit Refund', 'Deposit Returned', 0, 300, 'Patrick Gallagher', 'Remaining deposit after cleaning', 'Deposit Refund', '2025-07');

INSERT INTO adu_transactions (id, date, type, description, amount_in, amount_out, tenant, notes, category, month_year, management_fee_percentage) VALUES
(1007, '2025-09-12', 'Income', 'Rent income Zelle', 3150, 0, 'Jaber', 'September rent', 'Rent', '2025-09', 30);

INSERT INTO adu_transactions (id, date, type, description, amount_in, amount_out, tenant, notes, category, month_year) VALUES
(1008, '2025-09-13', 'Deposit', 'Security Deposit Zelle', 500, 0, 'Jaber', 'Deposit Received', 'Deposit', '2025-09'),
(1009, '2025-09-12', 'Management Fee', 'Management Fee - September', 0, 945, 'Jaber', '30% of $3,150', 'Management', '2025-09'),
(1010, '2025-08-11', 'Expense', 'Lockbox', 0, 107.74, '', 'Amazon lock box', 'Maintenance', '2025-08');

INSERT INTO adu_transactions (id, date, type, description, amount_in, amount_out, tenant, notes, category, month_year, management_fee_percentage) VALUES
(1011, '2025-10-14', 'Income', 'Rent income cash', 2000, 0, 'Jaber', 'October rent - Paid direct', 'Rent', '2025-10', 30),
(1012, '2025-10-16', 'Income', 'Rent income cash', 950, 0, 'Jaber', 'October rent - Zelle to Kyle', 'Rent', '2025-10', 30);

INSERT INTO adu_transactions (id, date, type, description, amount_in, amount_out, tenant, notes, category, month_year) VALUES
(1013, '2025-10-16', 'Management Fee', 'Management Fee - October', 0, 885, 'Jaber', '30% of $2,950', 'Management', '2025-10'),
(1014, '2025-11-03', 'Expense', 'Ikea Reimbursement', 0, 612, '', 'Paige Records', 'Maintenance', '2025-11'),
(1015, '2025-11-03', 'Expense', 'Foundation Vents', 0, 130, '', 'Paige Records', 'Maintenance', '2025-11'),
(1016, '2025-11-03', 'Expense', 'Handyman', 0, 300, '', 'Paige Records', 'Maintenance', '2025-11'),
(1017, '2025-11-03', 'Expense', 'Design hrs/install', 0, 918, '', 'Paige Records', 'Maintenance', '2025-11'),
(1018, '2025-11-04', 'Deposit', 'Tia Deposit Pmt', 500, 0, 'Tia', 'Received via Zelle', 'Deposit', '2025-11');

INSERT INTO adu_transactions (id, date, type, description, amount_in, amount_out, tenant, notes, category, month_year, management_fee_percentage) VALUES
(1019, '2025-11-04', 'Income', 'Tia Partial Rent Pmt Jan', 500, 0, 'Tia', 'Received via Zelle', 'Rent', '2025-11', 30);

INSERT INTO adu_transactions (id, date, type, description, amount_in, amount_out, tenant, notes, category, month_year) VALUES
(1020, '2025-11-04', 'Management Fee', 'Management Fee - Nov partial', 0, 150, 'Tia', '30% of $500 partial', 'Management', '2025-11'),
(1021, '2025-11-05', 'Owner Payout', 'Owner Payout', 0, 2180, '', 'Sent to Mike', 'Owner Payout', '2025-11');

INSERT INTO adu_transactions (id, date, type, description, amount_in, amount_out, tenant, notes, category, month_year, management_fee_percentage) VALUES
(1022, '2026-01-01', 'Income', 'Tia Jan Rent Balance', 2650, 0, 'Tia', 'Received via Venmo', 'Rent', '2026-01', 30);

INSERT INTO adu_transactions (id, date, type, description, amount_in, amount_out, tenant, notes, category, month_year) VALUES
(1023, '2026-01-01', 'Management Fee', 'Management Fee - January', 0, 795, 'Tia', '30% of $2,650 balance', 'Management', '2026-01');

INSERT INTO adu_transactions (id, date, type, description, amount_in, amount_out, tenant, notes, category, month_year, management_fee_percentage) VALUES
(1024, '2026-01-31', 'Income', 'Tia Feb Rent', 3150, 0, 'Tia', 'Received via Venmo', 'Rent', '2026-02', 30);

INSERT INTO adu_transactions (id, date, type, description, amount_in, amount_out, tenant, notes, category, month_year) VALUES
(1025, '2026-01-31', 'Management Fee', 'Management Fee - February', 0, 945, 'Tia', '30% of $3,150', 'Management', '2026-02');

-- Reset sequence to continue after seeded data
SELECT setval('adu_transactions_id_seq', 1100);

-- Enable RLS
ALTER TABLE adu_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE adu_settings ENABLE ROW LEVEL SECURITY;

-- Allow authenticated users full access (Kanons is single-user behind Clerk)
CREATE POLICY "Allow all for authenticated" ON adu_transactions FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all for authenticated" ON adu_settings FOR ALL USING (true) WITH CHECK (true);

-- Also allow anon for now (Kanons handles auth via Clerk, not Supabase auth)
CREATE POLICY "Allow anon read/write" ON adu_transactions FOR ALL TO anon USING (true) WITH CHECK (true);
CREATE POLICY "Allow anon read/write" ON adu_settings FOR ALL TO anon USING (true) WITH CHECK (true);
