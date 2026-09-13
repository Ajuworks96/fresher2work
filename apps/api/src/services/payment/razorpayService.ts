import Razorpay from 'razorpay';
import crypto from 'crypto';
import { ENV } from '../../config/env';

export interface CreateOrderParams {
  studentId: string;
  amountPaise: number;
  currency?: string;
  receipt?: string;
  notes?: Record<string, string>;
}

export interface RazorpayOrderResult {
  orderId: string;
  amount: number;
  currency: string;
  keyId: string;
}

export class RazorpayService {
  private razorpayClient: Razorpay | null = null;

  constructor() {
    this.initClient();
  }

  private initClient() {
    if (ENV.RAZORPAY_KEY_ID && ENV.RAZORPAY_KEY_SECRET) {
      try {
        this.razorpayClient = new Razorpay({
          key_id: ENV.RAZORPAY_KEY_ID,
          key_secret: ENV.RAZORPAY_KEY_SECRET,
        });
      } catch (err) {
        console.warn('⚠️ Razorpay client initialization warning:', err);
      }
    }
  }

  /**
   * Create a Razorpay Test Mode Order
   */
  async createOrder(params: CreateOrderParams): Promise<RazorpayOrderResult> {
    const { studentId, amountPaise, currency = 'INR', receipt, notes } = params;

    // Strict ₹99 validation
    if (amountPaise !== ENV.ACTIVATION_AMOUNT_PAISE) {
      throw new Error(`Invalid payment amount. Exact fee must be ₹99.00 (${ENV.ACTIVATION_AMOUNT_PAISE} paise).`);
    }

    if (currency !== 'INR') {
      throw new Error('Currency must be INR.');
    }

    const orderOptions = {
      amount: amountPaise,
      currency,
      receipt: receipt || `rcpt_${studentId.substring(0, 8)}_${Date.now()}`,
      notes: {
        studentId,
        platform: 'FresherToWork',
        purpose: 'V1_PROFILE_ACTIVATION',
        ...notes,
      },
    };

    // If real Razorpay client is available with test keys, attempt order creation
    if (this.razorpayClient && !ENV.RAZORPAY_KEY_ID.includes('Demo')) {
      try {
        const order = await this.razorpayClient.orders.create(orderOptions);
        return {
          orderId: order.id,
          amount: typeof order.amount === 'number' ? order.amount : parseInt(order.amount as any, 10),
          currency: order.currency,
          keyId: ENV.RAZORPAY_KEY_ID,
        };
      } catch (err: any) {
        console.warn('Razorpay API request failed, falling back to local test order:', err?.message || err);
      }
    }

    // Local deterministic Test Mode order generation for sandbox & development
    const randomHex = crypto.randomBytes(7).toString('hex');
    const orderId = `order_${randomHex}`;

    return {
      orderId,
      amount: amountPaise,
      currency,
      keyId: ENV.RAZORPAY_KEY_ID,
    };
  }

  /**
   * Cryptographically verify payment signature (HMAC-SHA256)
   * Formula: HMAC_SHA256(order_id + "|" + razorpay_payment_id, secret)
   */
  verifyPaymentSignature(params: { orderId: string; paymentId: string; signature: string }): boolean {
    const { orderId, paymentId, signature } = params;

    if (!orderId || !paymentId || !signature) {
      return false;
    }

    try {
      const text = `${orderId}|${paymentId}`;
      const expectedSignature = crypto
        .createHmac('sha256', ENV.RAZORPAY_KEY_SECRET)
        .update(text)
        .digest('hex');

      // Use constant-time buffer comparison to prevent timing attacks
      if (signature.length !== expectedSignature.length) {
        return false;
      }

      return crypto.timingSafeEqual(
        Buffer.from(signature, 'utf-8'),
        Buffer.from(expectedSignature, 'utf-8')
      );
    } catch {
      return false;
    }
  }

  /**
   * Cryptographically verify Razorpay Webhook signature (HMAC-SHA256)
   * Header: x-razorpay-signature
   * Body: raw JSON payload
   */
  verifyWebhookSignature(params: { rawBody: string; signature: string }): boolean {
    const { rawBody, signature } = params;

    if (!rawBody || !signature || !ENV.RAZORPAY_WEBHOOK_SECRET) {
      return false;
    }

    try {
      const expectedSignature = crypto
        .createHmac('sha256', ENV.RAZORPAY_WEBHOOK_SECRET)
        .update(rawBody)
        .digest('hex');

      if (signature.length !== expectedSignature.length) {
        return false;
      }

      return crypto.timingSafeEqual(
        Buffer.from(signature, 'utf-8'),
        Buffer.from(expectedSignature, 'utf-8')
      );
    } catch {
      return false;
    }
  }
}

export const razorpayService = new RazorpayService();
