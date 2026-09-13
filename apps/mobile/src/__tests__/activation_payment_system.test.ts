import request from 'supertest';
import crypto from 'crypto';
import app from '../../../api/src/server';
import { db } from '../../../api/src/database/db';
import { ENV } from '../../../api/src/config/env';
import {
  UserRole,
  SkillLevel,
  WorkMode,
  PaymentStatus,
} from '@fresher2work/types';

async function runActivationPaymentSystemTests() {
  console.log('🧪 Starting FresherToWork ₹99 Profile Activation & Security Test Suite...\n');

  let passed = 0;
  let failed = 0;

  function assert(condition: boolean, testName: string, details?: string) {
    if (condition) {
      console.log(`✅ PASS: ${testName}`);
      passed++;
    } else {
      console.error(`❌ FAIL: ${testName}`);
      if (details) console.error(`   Details: ${details}`);
      failed++;
    }
  }

  try {
    // -------------------------------------------------------------
    // Setup: Register 2 separate students and 1 recruiter
    // -------------------------------------------------------------
    const studentAName = `Devika Menon ${Date.now()}`;
    const studentAEmail = `stu_pay_a_${Date.now()}@university.edu`;
    const studentAPhone = `+91 ${Math.floor(1000000000 + Math.random() * 9000000000)}`;
    const regResA = await request(app)
      .post('/api/v1/auth/register')
      .send({
        fullName: studentAName,
        email: studentAEmail,
        phone: studentAPhone,
        password: 'Passcode2026!',
        role: UserRole.STUDENT,
      });

    assert(regResA.status === 201 && regResA.body.token, '1. Student A initialized with JWT');
    const tokenA = regResA.body.token;

    const studentBEmail = `stu_pay_b_${Date.now()}@university.edu`;
    const studentBPhone = `+91 ${Math.floor(1000000000 + Math.random() * 9000000000)}`;
    const regResB = await request(app)
      .post('/api/v1/auth/register')
      .send({
        fullName: 'Kiran Pillai',
        email: studentBEmail,
        phone: studentBPhone,
        password: 'Passcode2026!',
        role: UserRole.STUDENT,
      });
    const tokenB = regResB.body.token;

    const recruiterEmail = `rec_pay_check_${Date.now()}@agency.com`;
    const recruiterPhone = `+91 ${Math.floor(1000000000 + Math.random() * 9000000000)}`;
    const recRes = await request(app)
      .post('/api/v1/auth/register')
      .send({
        fullName: 'Vikram Sethi (Recruiter)',
        email: recruiterEmail,
        phone: recruiterPhone,
        password: 'Passcode2026!',
        role: UserRole.RECRUITER,
      });
    const recruiterToken = recRes.body.token;

    // -------------------------------------------------------------
    // 2. Eligibility Gate: Incomplete Profile (<70%) Cannot Activate
    // -------------------------------------------------------------
    const prematureOrderRes = await request(app)
      .post('/api/v1/payments/create-order')
      .set('Authorization', `Bearer ${tokenA}`);

    assert(prematureOrderRes.status === 400, '2a. Incomplete profile cannot create activation order (400 Bad Request)');
    assert(
      prematureOrderRes.body.error.includes('must be at least 70%'),
      '2b. Clear error returned requiring 70% completeness'
    );
    assert(
      Array.isArray(prematureOrderRes.body.missingSteps) && prematureOrderRes.body.missingSteps.length > 0,
      '2c. Actionable missing steps provided in error response'
    );

    // -------------------------------------------------------------
    // 3. Complete Profile to Reach ≥ 70% Completeness
    // -------------------------------------------------------------
    await request(app)
      .put('/api/v1/students/me')
      .set('Authorization', `Bearer ${tokenA}`)
      .send({
        headline: 'Frontend Engineer | React & TypeScript Specialist',
        about: 'Passionate developer building accessible web applications with clean architecture.',
        avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400',
      });

    await request(app)
      .post('/api/v1/students/me/education')
      .set('Authorization', `Bearer ${tokenA}`)
      .send({
        institutionName: 'National Institute of Technology, Calicut',
        degree: 'B.Tech',
        fieldOfStudy: 'Computer Science & Engineering',
        startYear: 2021,
        endYear: 2025,
      });

    await request(app)
      .put('/api/v1/students/me/skills')
      .set('Authorization', `Bearer ${tokenA}`)
      .send([
        { skillName: 'React', proficiencyLevel: SkillLevel.ADVANCED },
        { skillName: 'TypeScript', proficiencyLevel: SkillLevel.ADVANCED },
        { skillName: 'Next.js', proficiencyLevel: SkillLevel.INTERMEDIATE },
      ]);

    await request(app)
      .post('/api/v1/students/me/projects')
      .set('Authorization', `Bearer ${tokenA}`)
      .send({
        title: 'TalentSync Dashboard',
        description: 'Real-time candidate discovery dashboard with high-performance virtualized lists.',
        role: 'Frontend Lead',
        toolsUsed: ['React', 'TypeScript', 'TailwindCSS'],
        skillsDemonstrated: ['State Management', 'Performance Tuning'],
        techStack: ['React', 'TypeScript'],
      });

    await request(app)
      .post('/api/v1/students/me/cv/confirm')
      .set('Authorization', `Bearer ${tokenA}`)
      .send({
        cvFileUrl: 'https://storage.freshertowork.com/cv/devika-cv.pdf',
        fileName: 'Devika_Menon_CV.pdf',
        fileSize: 450000,
      });

    await request(app)
      .put('/api/v1/students/me/preferences')
      .set('Authorization', `Bearer ${tokenA}`)
      .send({
        preferredRoles: ['Frontend Engineer', 'React Developer'],
        preferredLocations: ['Kochi', 'Bengaluru', 'Remote'],
        workModes: [WorkMode.REMOTE, WorkMode.HYBRID],
      });

    const readyProfileRes = await request(app)
      .get('/api/v1/students/me')
      .set('Authorization', `Bearer ${tokenA}`);

    assert(readyProfileRes.body.completeness.score >= 70, '3a. Profile completeness reaches ≥ 70%');
    assert(readyProfileRes.body.completeness.canActivate === true, '3b. Profile marked canActivate = true');

    // -------------------------------------------------------------
    // 4. Undiscoverability Guarantee (Before Payment)
    // -------------------------------------------------------------
    const prePaySearchRes = await request(app)
      .get(`/api/v1/discovery/talents?q=${encodeURIComponent(studentAName)}`)
      .set('Authorization', `Bearer ${recruiterToken}`);

    assert(
      !prePaySearchRes.body.talents?.some((t: any) => t.fullName === studentAName),
      '4. Unactivated candidate is NOT discoverable in recruiter search pool'
    );

    // -------------------------------------------------------------
    // 5. Order Creation (`POST /api/v1/payments/create-order`)
    // -------------------------------------------------------------
    // 5a. Tampering check: client attempting to alter amount is rejected
    const tamperedAmountRes = await request(app)
      .post('/api/v1/payments/create-order')
      .set('Authorization', `Bearer ${tokenA}`)
      .send({ amount: 1000 }); // Attempting to pay ₹10 instead of ₹99
    assert(tamperedAmountRes.status === 400, '5a. Tampered amount attempt is strictly rejected (400 Bad Request)');

    const tamperedCurrencyRes = await request(app)
      .post('/api/v1/payments/create-order')
      .set('Authorization', `Bearer ${tokenA}`)
      .send({ currency: 'USD' });
    assert(tamperedCurrencyRes.status === 400, '5b. Non-INR currency attempt is strictly rejected (400 Bad Request)');

    const orderRes = await request(app)
      .post('/api/v1/payments/create-order')
      .set('Authorization', `Bearer ${tokenA}`);

    assert(orderRes.status === 200, '5c. POST /create-order returns 200 OK');
    assert(orderRes.body.amount === 9900, '5d. Amount is strictly ₹99.00 INR (9900 paise)');
    assert(orderRes.body.currency === 'INR', '5e. Currency is INR');
    assert(typeof orderRes.body.orderId === 'string' && orderRes.body.orderId.startsWith('order_'), '5f. Structured Razorpay Test order ID generated');

    const orderId = orderRes.body.orderId;
    const paymentId = `pay_rzp_test_${Date.now()}`;

    // -------------------------------------------------------------
    // 6. Security & Anti-Fraud: Fake / Tampered Signature Rejection
    // -------------------------------------------------------------
    const fakeSigRes = await request(app)
      .post('/api/v1/payments/verify-payment')
      .set('Authorization', `Bearer ${tokenA}`)
      .send({
        orderId,
        paymentId,
        signature: 'invalid_hacked_signature_attempt_xyz',
      });

    assert(fakeSigRes.status === 400, '6a. Tampered/invalid signature rejected with 400 Bad Request');
    assert(fakeSigRes.body.error.includes('signature verification failed'), '6b. Informative signature failure message');

    // Profile must still be inactive
    const stillInactiveProfile = await request(app)
      .get('/api/v1/students/me')
      .set('Authorization', `Bearer ${tokenA}`);
    assert(stillInactiveProfile.body.profile.isActivated === false, '6c. Profile remains unactivated after failed signature verification');

    // -------------------------------------------------------------
    // 7. Security: Cross-User Order Hijacking Prevention
    // -------------------------------------------------------------
    const hijackRes = await request(app)
      .post('/api/v1/payments/verify-payment')
      .set('Authorization', `Bearer ${tokenB}`) // Student B attempting to verify Student A's order
      .send({
        orderId,
        paymentId: `pay_b_${Date.now()}`,
        signature: 'sig_mock_verified_signature_123',
      });

    assert(hijackRes.status === 403, '7. Student B cannot hijack Student A\'s order (403 Forbidden)');

    // -------------------------------------------------------------
    // 8. Legitimate Cryptographic Signature Verification
    // -------------------------------------------------------------
    // Generate valid HMAC-SHA256 signature using RAZORPAY_KEY_SECRET
    const validHmac = crypto
      .createHmac('sha256', ENV.RAZORPAY_KEY_SECRET)
      .update(`${orderId}|${paymentId}`)
      .digest('hex');

    const verifyRes = await request(app)
      .post('/api/v1/payments/verify-payment')
      .set('Authorization', `Bearer ${tokenA}`)
      .send({
        orderId,
        paymentId,
        signature: validHmac,
      });

    assert(verifyRes.status === 200, '8a. Legitimate HMAC-SHA256 signature accepted (200 OK)');
    assert(verifyRes.body.success === true, '8b. Response confirms verification success');
    assert(verifyRes.body.profile.isActivated === true, '8c. Student profile is marked isActivated = true');
    assert(verifyRes.body.profile.activatedAt !== undefined, '8d. Activated timestamp recorded');

    // -------------------------------------------------------------
    // 9. Replay Attack Prevention
    // -------------------------------------------------------------
    const replayRes = await request(app)
      .post('/api/v1/payments/verify-payment')
      .set('Authorization', `Bearer ${tokenA}`)
      .send({
        orderId,
        paymentId,
        signature: validHmac,
      });

    assert(replayRes.status === 400, '9a. Replay verification of already-processed order rejected (400 Bad Request)');
    assert(
      replayRes.body.error.includes('already been verified'),
      '9b. Replay error explains payment is already processed'
    );

    // -------------------------------------------------------------
    // 10. Duplicate Activation Prevention
    // -------------------------------------------------------------
    const dupOrderRes = await request(app)
      .post('/api/v1/payments/create-order')
      .set('Authorization', `Bearer ${tokenA}`);

    assert(dupOrderRes.status === 400, '10a. Already-activated candidate cannot create another order (400 Bad Request)');
    assert(dupOrderRes.body.error.includes('already activated'), '10b. Duplicate activation prevented');

    // -------------------------------------------------------------
    // 11. Recruiter Discovery Activation Guarantee
    // -------------------------------------------------------------
    const postPaySearchRes = await request(app)
      .get(`/api/v1/discovery/talents?q=${encodeURIComponent(studentAName)}`)
      .set('Authorization', `Bearer ${recruiterToken}`);

    assert(
      postPaySearchRes.status === 200 &&
      postPaySearchRes.body.talents.some((t: any) => t.fullName === studentAName),
      '11. Activated candidate is immediately discoverable in recruiter search'
    );

    // -------------------------------------------------------------
    // 12. Payment History & Official Receipt
    // -------------------------------------------------------------
    const historyRes = await request(app)
      .get('/api/v1/payments/history')
      .set('Authorization', `Bearer ${tokenA}`);

    assert(historyRes.status === 200, '12a. GET /payments/history returns 200 OK');
    assert(
      Array.isArray(historyRes.body.history) && historyRes.body.history.length === 1,
      '12b. Exactly 1 payment history record found'
    );
    const rec = historyRes.body.history[0];
    assert(rec.gatewayOrderId === orderId, '12c. Gateway Order ID matches');
    assert(rec.gatewayPaymentId === paymentId, '12d. Gateway Payment ID matches');
    assert(rec.amountPaise === 9900, '12e. Exact 9900 paise recorded');
    assert(rec.currency === 'INR', '12f. INR currency recorded');
    assert(rec.status === PaymentStatus.SUCCESS, '12g. Status is SUCCESS');
    assert(rec.verifiedAt !== undefined, '12h. Verified timestamp is stored');

    // -------------------------------------------------------------
    // 13. Resilient Server-to-Server Webhook Confirmation
    // Test webhook flow for Student B
    // -------------------------------------------------------------
    // Complete Student B's profile
    await request(app)
      .put('/api/v1/students/me')
      .set('Authorization', `Bearer ${tokenB}`)
      .send({
        headline: 'Flutter & Mobile App Engineer',
        about: 'Crafting performant cross-platform mobile apps.',
        avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400',
      });
    await request(app)
      .post('/api/v1/students/me/education')
      .set('Authorization', `Bearer ${tokenB}`)
      .send({
        institutionName: 'CET Trivandrum',
        degree: 'B.Tech',
        fieldOfStudy: 'Computer Science',
        startYear: 2021,
        endYear: 2025,
      });
    await request(app)
      .put('/api/v1/students/me/skills')
      .set('Authorization', `Bearer ${tokenB}`)
      .send([
        { skillName: 'Flutter', proficiencyLevel: SkillLevel.ADVANCED },
        { skillName: 'Dart', proficiencyLevel: SkillLevel.ADVANCED },
        { skillName: 'Firebase', proficiencyLevel: SkillLevel.INTERMEDIATE },
      ]);
    await request(app)
      .post('/api/v1/students/me/projects')
      .set('Authorization', `Bearer ${tokenB}`)
      .send({
        title: 'HabitZen App',
        description: 'Mobile habit tracker with SQLite biometric authentication.',
        role: 'Solo Developer',
        toolsUsed: ['Flutter', 'Android Studio'],
        skillsDemonstrated: ['Mobile Architecture', 'Local DB'],
        techStack: ['Flutter', 'Dart'],
      });
    await request(app)
      .post('/api/v1/students/me/cv/confirm')
      .set('Authorization', `Bearer ${tokenB}`)
      .send({
        cvFileUrl: 'https://storage.freshertowork.com/cv/kiran-cv.pdf',
        fileName: 'Kiran_Pillai_CV.pdf',
        fileSize: 320000,
      });
    await request(app)
      .put('/api/v1/students/me/preferences')
      .set('Authorization', `Bearer ${tokenB}`)
      .send({
        preferredRoles: ['Flutter Developer', 'Mobile App Engineer'],
        preferredLocations: ['Kochi', 'Bengaluru', 'Remote'],
      });

    // Create order for Student B
    const orderResB = await request(app)
      .post('/api/v1/payments/create-order')
      .set('Authorization', `Bearer ${tokenB}`);

    assert(orderResB.status === 200, '13a. Student B order created successfully');
    const orderIdB = orderResB.body.orderId;
    const paymentIdB = `pay_webhook_${Date.now()}`;

    // Send Razorpay webhook event
    const webhookPayload = {
      event: 'payment.captured',
      payload: {
        payment: {
          entity: {
            id: paymentIdB,
            order_id: orderIdB,
            amount: 9900,
            currency: 'INR',
            status: 'captured',
          },
        },
      },
    };
    const webhookRaw = JSON.stringify(webhookPayload);
    const webhookSig = crypto
      .createHmac('sha256', ENV.RAZORPAY_WEBHOOK_SECRET)
      .update(webhookRaw)
      .digest('hex');

    const webhookRes = await request(app)
      .post('/api/v1/payments/webhook')
      .set('x-razorpay-signature', webhookSig)
      .send(webhookPayload);

    assert(webhookRes.status === 200, '13b. Razorpay webhook received & processed (200 OK)');

    const profileB = await request(app)
      .get('/api/v1/students/me')
      .set('Authorization', `Bearer ${tokenB}`);

    assert(profileB.body.profile.isActivated === true, '13c. Student B profile activated via server webhook');

    // -------------------------------------------------------------
    // Summary
    // -------------------------------------------------------------
    console.log(`\n========================================`);
    console.log(`₹99 Profile Activation Test Summary: ${passed} PASSED, ${failed} FAILED`);
    console.log(`========================================\n`);

    if (failed > 0) {
      process.exit(1);
    }
  } catch (error) {
    console.error('Test execution error:', error);
    process.exit(1);
  }
}

runActivationPaymentSystemTests();
