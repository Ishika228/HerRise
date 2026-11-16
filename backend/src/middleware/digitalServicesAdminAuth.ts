import { Request, Response, NextFunction } from 'express';
import { timingSafeEqual } from 'crypto';
import { config } from '../config/env.js';

export function requireDigitalServicesAdmin(req: Request, res: Response, next: NextFunction): void {
  const expected = config.digitalServicesAdminToken;
  const supplied = req.headers.authorization?.startsWith('Bearer ')
    ? req.headers.authorization.slice(7)
    : '';

  if (!expected) {
    res.status(503).json({
      success: false,
      error: 'Admin access is not configured. Set DIGITAL_SERVICES_ADMIN_TOKEN on the backend.'
    });
    return;
  }

  const expectedBuffer = Buffer.from(expected);
  const suppliedBuffer = Buffer.from(supplied);
  if (
    !supplied ||
    expectedBuffer.length !== suppliedBuffer.length ||
    !timingSafeEqual(expectedBuffer, suppliedBuffer)
  ) {
    res.status(401).json({ success: false, error: 'Invalid or missing admin token.' });
    return;
  }

  next();
}
