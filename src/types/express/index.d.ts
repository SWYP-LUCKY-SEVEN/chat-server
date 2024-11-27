import express from "express";

declare global {
  namespace Express {
    interface Request {
      member?: Record<string, any>;
    }
  }
}
