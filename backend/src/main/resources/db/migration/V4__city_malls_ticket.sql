-- Add city column to parking_lot
ALTER TABLE parking_lot ADD COLUMN city VARCHAR(64);
UPDATE parking_lot SET city = 'Bangalore' WHERE id = 1;
ALTER TABLE parking_lot ALTER COLUMN city SET NOT NULL;

-- Add ticket_no column to reservation
ALTER TABLE reservation ADD COLUMN ticket_no VARCHAR(64);
ALTER TABLE reservation ADD CONSTRAINT uq_reservation_ticket_no UNIQUE (ticket_no);

-- ===== Seed new malls, floors, and spots =====

-- Bangalore: Orion Mall (lot_id=2)
INSERT INTO parking_lot (id, name, address, city) VALUES (2, 'Orion Mall', 'Rajajinagar, Bangalore', 'Bangalore');
INSERT INTO floor (id, lot_id, code, level) VALUES (4, 2, 'B1', -1), (5, 2, 'B2', -2);

-- Orion Mall B1 spots (floor_id=4)
INSERT INTO parking_spot (floor_id, code, type, occupied) VALUES
 (4,'OR-B1-B-001','BIKE',FALSE),(4,'OR-B1-B-002','BIKE',FALSE),(4,'OR-B1-B-003','BIKE',FALSE),(4,'OR-B1-B-004','BIKE',FALSE),(4,'OR-B1-B-005','BIKE',FALSE),
 (4,'OR-B1-B-006','BIKE',FALSE),(4,'OR-B1-B-007','BIKE',FALSE),(4,'OR-B1-B-008','BIKE',FALSE),(4,'OR-B1-B-009','BIKE',FALSE),(4,'OR-B1-B-010','BIKE',FALSE),
 (4,'OR-B1-C-001','CAR',FALSE),(4,'OR-B1-C-002','CAR',FALSE),(4,'OR-B1-C-003','CAR',FALSE),(4,'OR-B1-C-004','CAR',FALSE),(4,'OR-B1-C-005','CAR',FALSE);
-- Orion Mall B2 spots (floor_id=5)
INSERT INTO parking_spot (floor_id, code, type, occupied) VALUES
 (5,'OR-B2-B-001','BIKE',FALSE),(5,'OR-B2-B-002','BIKE',FALSE),(5,'OR-B2-B-003','BIKE',FALSE),(5,'OR-B2-B-004','BIKE',FALSE),(5,'OR-B2-B-005','BIKE',FALSE),
 (5,'OR-B2-B-006','BIKE',FALSE),(5,'OR-B2-B-007','BIKE',FALSE),(5,'OR-B2-B-008','BIKE',FALSE),(5,'OR-B2-B-009','BIKE',FALSE),(5,'OR-B2-B-010','BIKE',FALSE),
 (5,'OR-B2-C-001','CAR',FALSE),(5,'OR-B2-C-002','CAR',FALSE),(5,'OR-B2-C-003','CAR',FALSE),(5,'OR-B2-C-004','CAR',FALSE),(5,'OR-B2-C-005','CAR',FALSE);

-- Bangalore: Phoenix Marketcity (lot_id=3)
INSERT INTO parking_lot (id, name, address, city) VALUES (3, 'Phoenix Marketcity', 'Whitefield, Bangalore', 'Bangalore');
INSERT INTO floor (id, lot_id, code, level) VALUES (6, 3, 'B1', -1), (7, 3, 'B2', -2);

-- Phoenix B1 spots (floor_id=6)
INSERT INTO parking_spot (floor_id, code, type, occupied) VALUES
 (6,'PH-B1-B-001','BIKE',FALSE),(6,'PH-B1-B-002','BIKE',FALSE),(6,'PH-B1-B-003','BIKE',FALSE),(6,'PH-B1-B-004','BIKE',FALSE),(6,'PH-B1-B-005','BIKE',FALSE),
 (6,'PH-B1-B-006','BIKE',FALSE),(6,'PH-B1-B-007','BIKE',FALSE),(6,'PH-B1-B-008','BIKE',FALSE),(6,'PH-B1-B-009','BIKE',FALSE),(6,'PH-B1-B-010','BIKE',FALSE),
 (6,'PH-B1-C-001','CAR',FALSE),(6,'PH-B1-C-002','CAR',FALSE),(6,'PH-B1-C-003','CAR',FALSE),(6,'PH-B1-C-004','CAR',FALSE),(6,'PH-B1-C-005','CAR',FALSE);
-- Phoenix B2 spots (floor_id=7)
INSERT INTO parking_spot (floor_id, code, type, occupied) VALUES
 (7,'PH-B2-B-001','BIKE',FALSE),(7,'PH-B2-B-002','BIKE',FALSE),(7,'PH-B2-B-003','BIKE',FALSE),(7,'PH-B2-B-004','BIKE',FALSE),(7,'PH-B2-B-005','BIKE',FALSE),
 (7,'PH-B2-B-006','BIKE',FALSE),(7,'PH-B2-B-007','BIKE',FALSE),(7,'PH-B2-B-008','BIKE',FALSE),(7,'PH-B2-B-009','BIKE',FALSE),(7,'PH-B2-B-010','BIKE',FALSE),
 (7,'PH-B2-C-001','CAR',FALSE),(7,'PH-B2-C-002','CAR',FALSE),(7,'PH-B2-C-003','CAR',FALSE),(7,'PH-B2-C-004','CAR',FALSE),(7,'PH-B2-C-005','CAR',FALSE);

-- Mumbai: Inorbit Mall (lot_id=4)
INSERT INTO parking_lot (id, name, address, city) VALUES (4, 'Inorbit Mall', 'Malad West, Mumbai', 'Mumbai');
INSERT INTO floor (id, lot_id, code, level) VALUES (8, 4, 'B1', -1), (9, 4, 'B2', -2), (10, 4, 'B3', -3);

-- Inorbit B1 (floor_id=8)
INSERT INTO parking_spot (floor_id, code, type, occupied) VALUES
 (8,'IN-B1-B-001','BIKE',FALSE),(8,'IN-B1-B-002','BIKE',FALSE),(8,'IN-B1-B-003','BIKE',FALSE),(8,'IN-B1-B-004','BIKE',FALSE),(8,'IN-B1-B-005','BIKE',FALSE),
 (8,'IN-B1-B-006','BIKE',FALSE),(8,'IN-B1-B-007','BIKE',FALSE),(8,'IN-B1-B-008','BIKE',FALSE),(8,'IN-B1-B-009','BIKE',FALSE),(8,'IN-B1-B-010','BIKE',FALSE),
 (8,'IN-B1-C-001','CAR',FALSE),(8,'IN-B1-C-002','CAR',FALSE),(8,'IN-B1-C-003','CAR',FALSE),(8,'IN-B1-C-004','CAR',FALSE),(8,'IN-B1-C-005','CAR',FALSE);
-- Inorbit B2 (floor_id=9)
INSERT INTO parking_spot (floor_id, code, type, occupied) VALUES
 (9,'IN-B2-B-001','BIKE',FALSE),(9,'IN-B2-B-002','BIKE',FALSE),(9,'IN-B2-B-003','BIKE',FALSE),(9,'IN-B2-B-004','BIKE',FALSE),(9,'IN-B2-B-005','BIKE',FALSE),
 (9,'IN-B2-B-006','BIKE',FALSE),(9,'IN-B2-B-007','BIKE',FALSE),(9,'IN-B2-B-008','BIKE',FALSE),(9,'IN-B2-B-009','BIKE',FALSE),(9,'IN-B2-B-010','BIKE',FALSE),
 (9,'IN-B2-C-001','CAR',FALSE),(9,'IN-B2-C-002','CAR',FALSE),(9,'IN-B2-C-003','CAR',FALSE),(9,'IN-B2-C-004','CAR',FALSE),(9,'IN-B2-C-005','CAR',FALSE);
-- Inorbit B3 (floor_id=10)
INSERT INTO parking_spot (floor_id, code, type, occupied) VALUES
 (10,'IN-B3-B-001','BIKE',FALSE),(10,'IN-B3-B-002','BIKE',FALSE),(10,'IN-B3-B-003','BIKE',FALSE),(10,'IN-B3-B-004','BIKE',FALSE),(10,'IN-B3-B-005','BIKE',FALSE),
 (10,'IN-B3-B-006','BIKE',FALSE),(10,'IN-B3-B-007','BIKE',FALSE),(10,'IN-B3-B-008','BIKE',FALSE),(10,'IN-B3-B-009','BIKE',FALSE),(10,'IN-B3-B-010','BIKE',FALSE),
 (10,'IN-B3-C-001','CAR',FALSE),(10,'IN-B3-C-002','CAR',FALSE),(10,'IN-B3-C-003','CAR',FALSE),(10,'IN-B3-C-004','CAR',FALSE),(10,'IN-B3-C-005','CAR',FALSE);

-- Mumbai: R City Mall (lot_id=5)
INSERT INTO parking_lot (id, name, address, city) VALUES (5, 'R City Mall', 'Ghatkopar West, Mumbai', 'Mumbai');
INSERT INTO floor (id, lot_id, code, level) VALUES (11, 5, 'B1', -1), (12, 5, 'B2', -2);

-- R City B1 (floor_id=11)
INSERT INTO parking_spot (floor_id, code, type, occupied) VALUES
 (11,'RC-B1-B-001','BIKE',FALSE),(11,'RC-B1-B-002','BIKE',FALSE),(11,'RC-B1-B-003','BIKE',FALSE),(11,'RC-B1-B-004','BIKE',FALSE),(11,'RC-B1-B-005','BIKE',FALSE),
 (11,'RC-B1-B-006','BIKE',FALSE),(11,'RC-B1-B-007','BIKE',FALSE),(11,'RC-B1-B-008','BIKE',FALSE),(11,'RC-B1-B-009','BIKE',FALSE),(11,'RC-B1-B-010','BIKE',FALSE),
 (11,'RC-B1-C-001','CAR',FALSE),(11,'RC-B1-C-002','CAR',FALSE),(11,'RC-B1-C-003','CAR',FALSE),(11,'RC-B1-C-004','CAR',FALSE),(11,'RC-B1-C-005','CAR',FALSE);
-- R City B2 (floor_id=12)
INSERT INTO parking_spot (floor_id, code, type, occupied) VALUES
 (12,'RC-B2-B-001','BIKE',FALSE),(12,'RC-B2-B-002','BIKE',FALSE),(12,'RC-B2-B-003','BIKE',FALSE),(12,'RC-B2-B-004','BIKE',FALSE),(12,'RC-B2-B-005','BIKE',FALSE),
 (12,'RC-B2-B-006','BIKE',FALSE),(12,'RC-B2-B-007','BIKE',FALSE),(12,'RC-B2-B-008','BIKE',FALSE),(12,'RC-B2-B-009','BIKE',FALSE),(12,'RC-B2-B-010','BIKE',FALSE),
 (12,'RC-B2-C-001','CAR',FALSE),(12,'RC-B2-C-002','CAR',FALSE),(12,'RC-B2-C-003','CAR',FALSE),(12,'RC-B2-C-004','CAR',FALSE),(12,'RC-B2-C-005','CAR',FALSE);

-- Delhi: Select Citywalk (lot_id=6)
INSERT INTO parking_lot (id, name, address, city) VALUES (6, 'Select Citywalk', 'Saket, Delhi', 'Delhi');
INSERT INTO floor (id, lot_id, code, level) VALUES (13, 6, 'B1', -1), (14, 6, 'B2', -2), (15, 6, 'B3', -3);

-- Select Citywalk B1 (floor_id=13)
INSERT INTO parking_spot (floor_id, code, type, occupied) VALUES
 (13,'SC-B1-B-001','BIKE',FALSE),(13,'SC-B1-B-002','BIKE',FALSE),(13,'SC-B1-B-003','BIKE',FALSE),(13,'SC-B1-B-004','BIKE',FALSE),(13,'SC-B1-B-005','BIKE',FALSE),
 (13,'SC-B1-B-006','BIKE',FALSE),(13,'SC-B1-B-007','BIKE',FALSE),(13,'SC-B1-B-008','BIKE',FALSE),(13,'SC-B1-B-009','BIKE',FALSE),(13,'SC-B1-B-010','BIKE',FALSE),
 (13,'SC-B1-C-001','CAR',FALSE),(13,'SC-B1-C-002','CAR',FALSE),(13,'SC-B1-C-003','CAR',FALSE),(13,'SC-B1-C-004','CAR',FALSE),(13,'SC-B1-C-005','CAR',FALSE);
-- Select Citywalk B2 (floor_id=14)
INSERT INTO parking_spot (floor_id, code, type, occupied) VALUES
 (14,'SC-B2-B-001','BIKE',FALSE),(14,'SC-B2-B-002','BIKE',FALSE),(14,'SC-B2-B-003','BIKE',FALSE),(14,'SC-B2-B-004','BIKE',FALSE),(14,'SC-B2-B-005','BIKE',FALSE),
 (14,'SC-B2-B-006','BIKE',FALSE),(14,'SC-B2-B-007','BIKE',FALSE),(14,'SC-B2-B-008','BIKE',FALSE),(14,'SC-B2-B-009','BIKE',FALSE),(14,'SC-B2-B-010','BIKE',FALSE),
 (14,'SC-B2-C-001','CAR',FALSE),(14,'SC-B2-C-002','CAR',FALSE),(14,'SC-B2-C-003','CAR',FALSE),(14,'SC-B2-C-004','CAR',FALSE),(14,'SC-B2-C-005','CAR',FALSE);
-- Select Citywalk B3 (floor_id=15)
INSERT INTO parking_spot (floor_id, code, type, occupied) VALUES
 (15,'SC-B3-B-001','BIKE',FALSE),(15,'SC-B3-B-002','BIKE',FALSE),(15,'SC-B3-B-003','BIKE',FALSE),(15,'SC-B3-B-004','BIKE',FALSE),(15,'SC-B3-B-005','BIKE',FALSE),
 (15,'SC-B3-B-006','BIKE',FALSE),(15,'SC-B3-B-007','BIKE',FALSE),(15,'SC-B3-B-008','BIKE',FALSE),(15,'SC-B3-B-009','BIKE',FALSE),(15,'SC-B3-B-010','BIKE',FALSE),
 (15,'SC-B3-C-001','CAR',FALSE),(15,'SC-B3-C-002','CAR',FALSE),(15,'SC-B3-C-003','CAR',FALSE),(15,'SC-B3-C-004','CAR',FALSE),(15,'SC-B3-C-005','CAR',FALSE);

-- Delhi: DLF Mall of India (lot_id=7)
INSERT INTO parking_lot (id, name, address, city) VALUES (7, 'DLF Mall of India', 'Noida, Delhi', 'Delhi');
INSERT INTO floor (id, lot_id, code, level) VALUES (16, 7, 'B1', -1), (17, 7, 'B2', -2);

-- DLF B1 (floor_id=16)
INSERT INTO parking_spot (floor_id, code, type, occupied) VALUES
 (16,'DL-B1-B-001','BIKE',FALSE),(16,'DL-B1-B-002','BIKE',FALSE),(16,'DL-B1-B-003','BIKE',FALSE),(16,'DL-B1-B-004','BIKE',FALSE),(16,'DL-B1-B-005','BIKE',FALSE),
 (16,'DL-B1-B-006','BIKE',FALSE),(16,'DL-B1-B-007','BIKE',FALSE),(16,'DL-B1-B-008','BIKE',FALSE),(16,'DL-B1-B-009','BIKE',FALSE),(16,'DL-B1-B-010','BIKE',FALSE),
 (16,'DL-B1-C-001','CAR',FALSE),(16,'DL-B1-C-002','CAR',FALSE),(16,'DL-B1-C-003','CAR',FALSE),(16,'DL-B1-C-004','CAR',FALSE),(16,'DL-B1-C-005','CAR',FALSE);
-- DLF B2 (floor_id=17)
INSERT INTO parking_spot (floor_id, code, type, occupied) VALUES
 (17,'DL-B2-B-001','BIKE',FALSE),(17,'DL-B2-B-002','BIKE',FALSE),(17,'DL-B2-B-003','BIKE',FALSE),(17,'DL-B2-B-004','BIKE',FALSE),(17,'DL-B2-B-005','BIKE',FALSE),
 (17,'DL-B2-B-006','BIKE',FALSE),(17,'DL-B2-B-007','BIKE',FALSE),(17,'DL-B2-B-008','BIKE',FALSE),(17,'DL-B2-B-009','BIKE',FALSE),(17,'DL-B2-B-010','BIKE',FALSE),
 (17,'DL-B2-C-001','CAR',FALSE),(17,'DL-B2-C-002','CAR',FALSE),(17,'DL-B2-C-003','CAR',FALSE),(17,'DL-B2-C-004','CAR',FALSE),(17,'DL-B2-C-005','CAR',FALSE);
