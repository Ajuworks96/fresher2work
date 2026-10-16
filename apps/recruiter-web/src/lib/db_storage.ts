import { Pool } from 'pg';

const connectionString =
  process.env.DATABASE_URL ||
  'postgresql://postgres.sxsiarjhqgvzsqmwscap:FresherToWork%402026@aws-0-ap-southeast-2.pooler.supabase.com:6543/postgres';

let pool: Pool | null = null;
let dbDisabled = false;
let lastDbAttempt = 0;
const DB_RETRY_COOLDOWN_MS = 60000; // Cooldown for 1 minute before retrying unreachable DB

function isDbAvailable(): boolean {
  if (!dbDisabled) return true;
  if (Date.now() - lastDbAttempt > DB_RETRY_COOLDOWN_MS) {
    dbDisabled = false; // allow retry
    return true;
  }
  return false;
}

function getPool(): Pool | null {
  if (!isDbAvailable()) return null;
  if (!pool) {
    try {
      pool = new Pool({
        connectionString,
        ssl: { rejectUnauthorized: false },
        max: 2,
        idleTimeoutMillis: 10000,
        connectionTimeoutMillis: 1500, // Fast 1.5s timeout instead of hanging
      });
      pool.on('error', (err) => {
        console.warn('[DB Pool Warning - using local in-memory fallback]', err.message);
        dbDisabled = true;
        lastDbAttempt = Date.now();
      });
    } catch (err: any) {
      dbDisabled = true;
      lastDbAttempt = Date.now();
      return null;
    }
  }
  return pool;
}

let tableEnsured = false;
async function ensureTable(): Promise<boolean> {
  if (tableEnsured) return true;
  if (!isDbAvailable()) return false;
  try {
    const p = getPool();
    if (!p) return false;
    await p.query(`
      CREATE TABLE IF NOT EXISTS ftw_app_state (
        key TEXT PRIMARY KEY,
        value JSONB NOT NULL,
        updated_at TIMESTAMP DEFAULT NOW()
      );
    `);
    tableEnsured = true;
    return true;
  } catch (err: any) {
    console.warn('[DB not reachable, switching to fast local storage fallback]', err.message || err);
    dbDisabled = true;
    lastDbAttempt = Date.now();
    return false;
  }
}

export async function getDbState<T = any>(key: string, defaultValue: T): Promise<T> {
  if (!isDbAvailable()) return defaultValue;
  try {
    const ok = await ensureTable();
    if (!ok) return defaultValue;
    const p = getPool();
    if (!p) return defaultValue;
    const res = await p.query('SELECT value FROM ftw_app_state WHERE key = $1', [key]);
    if (res.rows.length > 0 && res.rows[0].value !== undefined) {
      return res.rows[0].value as T;
    }
  } catch (err: any) {
    console.warn(`[DB getDbState fallback for key "${key}"]`, err.message || err);
    dbDisabled = true;
    lastDbAttempt = Date.now();
  }
  return defaultValue;
}

export async function setDbState(key: string, value: any): Promise<void> {
  if (!isDbAvailable()) return;
  try {
    const ok = await ensureTable();
    if (!ok) return;
    const p = getPool();
    if (!p) return;
    await p.query(
      `
      INSERT INTO ftw_app_state (key, value, updated_at)
      VALUES ($1, $2, NOW())
      ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value, updated_at = NOW();
    `,
      [key, JSON.stringify(value)]
    );
  } catch (err: any) {
    console.warn(`[DB setDbState fallback for key "${key}"]`, err.message || err);
    dbDisabled = true;
    lastDbAttempt = Date.now();
  }
}

// Deleted Students Tracking
export async function getDeletedStudentIds(): Promise<string[]> {
  return await getDbState<string[]>('deleted_student_ids', []);
}

export async function markStudentDeleted(studentId: string): Promise<void> {
  const current = await getDeletedStudentIds();
  if (!current.includes(studentId)) {
    current.push(studentId);
    await setDbState('deleted_student_ids', current);
  }
  // Also remove from saved students list in DB
  const students = await getDbState<any[]>('students', []);
  const filtered = students.filter(
    (s: any) => s.id !== studentId && s.userId !== studentId
  );
  await setDbState('students', filtered);
}
