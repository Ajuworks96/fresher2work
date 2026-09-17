import { Pool } from 'pg';

const connectionString =
  process.env.DATABASE_URL ||
  'postgresql://postgres.sxsiarjhqgvzsqmwscap:FresherToWork%402026@aws-0-ap-southeast-2.pooler.supabase.com:6543/postgres';

let pool: Pool | null = null;

function getPool(): Pool {
  if (!pool) {
    pool = new Pool({
      connectionString,
      ssl: { rejectUnauthorized: false },
      max: 2,
      idleTimeoutMillis: 15000,
      connectionTimeoutMillis: 8000,
    });
    pool.on('error', (err) => {
      console.error('[DB Pool Error]', err);
    });
  }
  return pool;
}

let tableEnsured = false;
async function ensureTable(): Promise<void> {
  if (tableEnsured) return;
  try {
    const p = getPool();
    await p.query(`
      CREATE TABLE IF NOT EXISTS ftw_app_state (
        key TEXT PRIMARY KEY,
        value JSONB NOT NULL,
        updated_at TIMESTAMP DEFAULT NOW()
      );
    `);
    tableEnsured = true;
  } catch (err) {
    console.error('[DB ensureTable Error]', err);
  }
}

export async function getDbState<T = any>(key: string, defaultValue: T): Promise<T> {
  try {
    await ensureTable();
    const p = getPool();
    const res = await p.query('SELECT value FROM ftw_app_state WHERE key = $1', [key]);
    if (res.rows.length > 0 && res.rows[0].value !== undefined) {
      return res.rows[0].value as T;
    }
  } catch (err) {
    console.error(`[DB getDbState Error for key "${key}"]`, err);
  }
  return defaultValue;
}

export async function setDbState(key: string, value: any): Promise<void> {
  try {
    await ensureTable();
    const p = getPool();
    await p.query(
      `
      INSERT INTO ftw_app_state (key, value, updated_at)
      VALUES ($1, $2, NOW())
      ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value, updated_at = NOW();
    `,
      [key, JSON.stringify(value)]
    );
  } catch (err) {
    console.error(`[DB setDbState Error for key "${key}"]`, err);
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
