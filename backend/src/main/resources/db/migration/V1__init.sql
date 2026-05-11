CREATE TABLE app_user (
    id BIGSERIAL PRIMARY KEY,
    username VARCHAR(64) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(128),
    role VARCHAR(32) NOT NULL,
    enabled BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE parking_lot (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(128) NOT NULL,
    address VARCHAR(255)
);

CREATE TABLE floor (
    id BIGSERIAL PRIMARY KEY,
    lot_id BIGINT NOT NULL REFERENCES parking_lot(id),
    code VARCHAR(16) NOT NULL,
    level INT NOT NULL
);

CREATE TABLE parking_spot (
    id BIGSERIAL PRIMARY KEY,
    floor_id BIGINT NOT NULL REFERENCES floor(id),
    code VARCHAR(32) NOT NULL UNIQUE,
    type VARCHAR(16) NOT NULL,
    occupied BOOLEAN NOT NULL DEFAULT FALSE,
    version BIGINT NOT NULL DEFAULT 0
);
CREATE INDEX idx_spot_lookup ON parking_spot(floor_id, type, occupied);

CREATE TABLE vehicle (
    id BIGSERIAL PRIMARY KEY,
    license_plate VARCHAR(32) NOT NULL UNIQUE,
    type VARCHAR(16) NOT NULL
);

CREATE TABLE rate_card (
    id BIGSERIAL PRIMARY KEY,
    vehicle_type VARCHAR(16) NOT NULL UNIQUE,
    first_hour_rate NUMERIC(10,2) NOT NULL,
    hourly_rate NUMERIC(10,2) NOT NULL,
    daily_cap NUMERIC(10,2) NOT NULL
);

CREATE TABLE ticket (
    id BIGSERIAL PRIMARY KEY,
    ticket_no VARCHAR(64) NOT NULL UNIQUE,
    vehicle_id BIGINT NOT NULL REFERENCES vehicle(id),
    spot_id BIGINT NOT NULL REFERENCES parking_spot(id),
    entry_time TIMESTAMP NOT NULL,
    exit_time TIMESTAMP,
    amount NUMERIC(10,2),
    status VARCHAR(16) NOT NULL,
    issued_by BIGINT REFERENCES app_user(id)
);
CREATE INDEX idx_ticket_status ON ticket(status);

CREATE TABLE payment (
    id BIGSERIAL PRIMARY KEY,
    ticket_id BIGINT NOT NULL REFERENCES ticket(id),
    amount NUMERIC(10,2) NOT NULL,
    method VARCHAR(16) NOT NULL,
    status VARCHAR(16) NOT NULL,
    gateway_ref VARCHAR(128),
    paid_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);
