package com.inventario.exception;
import java.util.Map;

 import org.springframework.http.HttpStatus;
 import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
@RestControllerAdvice
public class GlobalExceptionHandler { @ExceptionHandler(ApiException.class) public ResponseEntity<Map<String,String>> handle(ApiException ex){return ResponseEntity.badRequest().body(Map.of("error",ex.getMessage()));} @ExceptionHandler(Exception.class) public ResponseEntity<Map<String,String>> other(Exception ex){return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of("error",ex.getMessage()));} }
