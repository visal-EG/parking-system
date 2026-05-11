CREATE TABLE reservation (
    id         BIGSERIAL PRIMARY KEY,
    user_id    BIGINT       NOT NULL REFERENCES app_user(id),
    spot_id    BIGINT       NOT NULL REFERENCES parking_spot(id),
    status     VARCHAR(16)  NOT NULL,
    created_at TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP    NOT NULL,
    cancelled_at TIMESTAMP
);

CREATE INDEX idx_reservation_status ON reservation(status);
CREATE INDEX idx_reservation_user_status ON reservation(user_id, status);
CREATE INDEX idx_reservation_spot_status ON reservation(spot_id, status);
CREATE INDEX idx_reservation_status_expires ON reservation(status, expires_at);
