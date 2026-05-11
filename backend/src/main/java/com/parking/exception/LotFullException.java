package com.parking.exception;

public class LotFullException extends RuntimeException {
    public LotFullException(String message) { super(message); }
}
