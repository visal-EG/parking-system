-- Mall + 3 basements
INSERT INTO parking_lot (id, name, address) VALUES (1, 'City Mall', '123 MG Road');

INSERT INTO floor (id, lot_id, code, level) VALUES
 (1, 1, 'B1', -1),
 (2, 1, 'B2', -2),
 (3, 1, 'B3', -3);

-- Spots: each floor gets 20 BIKE + 10 CAR (kept small for demo)
-- B1
INSERT INTO parking_spot (floor_id, code, type, occupied) VALUES
 (1,'B1-B-001','BIKE',FALSE),(1,'B1-B-002','BIKE',FALSE),(1,'B1-B-003','BIKE',FALSE),(1,'B1-B-004','BIKE',FALSE),(1,'B1-B-005','BIKE',FALSE),
 (1,'B1-B-006','BIKE',FALSE),(1,'B1-B-007','BIKE',FALSE),(1,'B1-B-008','BIKE',FALSE),(1,'B1-B-009','BIKE',FALSE),(1,'B1-B-010','BIKE',FALSE),
 (1,'B1-C-001','CAR',FALSE),(1,'B1-C-002','CAR',FALSE),(1,'B1-C-003','CAR',FALSE),(1,'B1-C-004','CAR',FALSE),(1,'B1-C-005','CAR',FALSE);
-- B2
INSERT INTO parking_spot (floor_id, code, type, occupied) VALUES
 (2,'B2-B-001','BIKE',FALSE),(2,'B2-B-002','BIKE',FALSE),(2,'B2-B-003','BIKE',FALSE),(2,'B2-B-004','BIKE',FALSE),(2,'B2-B-005','BIKE',FALSE),
 (2,'B2-B-006','BIKE',FALSE),(2,'B2-B-007','BIKE',FALSE),(2,'B2-B-008','BIKE',FALSE),(2,'B2-B-009','BIKE',FALSE),(2,'B2-B-010','BIKE',FALSE),
 (2,'B2-C-001','CAR',FALSE),(2,'B2-C-002','CAR',FALSE),(2,'B2-C-003','CAR',FALSE),(2,'B2-C-004','CAR',FALSE),(2,'B2-C-005','CAR',FALSE);
-- B3
INSERT INTO parking_spot (floor_id, code, type, occupied) VALUES
 (3,'B3-B-001','BIKE',FALSE),(3,'B3-B-002','BIKE',FALSE),(3,'B3-B-003','BIKE',FALSE),(3,'B3-B-004','BIKE',FALSE),(3,'B3-B-005','BIKE',FALSE),
 (3,'B3-B-006','BIKE',FALSE),(3,'B3-B-007','BIKE',FALSE),(3,'B3-B-008','BIKE',FALSE),(3,'B3-B-009','BIKE',FALSE),(3,'B3-B-010','BIKE',FALSE),
 (3,'B3-C-001','CAR',FALSE),(3,'B3-C-002','CAR',FALSE),(3,'B3-C-003','CAR',FALSE),(3,'B3-C-004','CAR',FALSE),(3,'B3-C-005','CAR',FALSE);

-- Rate cards
INSERT INTO rate_card (vehicle_type, first_hour_rate, hourly_rate, daily_cap) VALUES
 ('BIKE', 10.00, 5.00, 50.00),
 ('CAR',  30.00, 20.00, 200.00);

-- Users are seeded by DataInitializer (so BCrypt hashes match the running PasswordEncoder).
