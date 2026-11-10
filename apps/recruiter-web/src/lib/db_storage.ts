import { Pool } from 'pg';
import fs from 'fs';
import path from 'path';

const defaultConnectionString =
  process.env.DATABASE_URL ||
  'postgresql://fresher2work_user:F2W_Local_Pg_2026!@127.0.0.1:5432/fresher2work';

const connectionString = defaultConnectionString;
const isLocal = connectionString.includes('127.0.0.1') || connectionString.includes('localhost');

let pool: Pool | null = null;
let dbDisabled = false;
let lastDbAttempt = 0;
const DB_RETRY_COOLDOWN_MS = 15000;

// Disk backup cache path (persistent across restarts)
const DISK_BACKUP_PATH = path.join(process.cwd(), 'data', 'ftw_db_cache.json');

function ensureDataDir(): void {
  try {
    const dir = path.dirname(DISK_BACKUP_PATH);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  } catch (_) {}
}

function readDiskCache(): Record<string, any> {
  try {
    if (fs.existsSync(DISK_BACKUP_PATH)) {
      const raw = fs.readFileSync(DISK_BACKUP_PATH, 'utf-8');
      return JSON.parse(raw);
    }
  } catch (err) {
    console.warn('[DB Storage] Failed to read disk backup cache:', err);
  }
  return {};
}

function writeDiskCache(key: string, value: any): void {
  try {
    ensureDataDir();
    const cache = readDiskCache();
    cache[key] = value;
    fs.writeFileSync(DISK_BACKUP_PATH, JSON.stringify(cache, null, 2), 'utf-8');
  } catch (err) {
    console.warn('[DB Storage] Failed to write disk backup cache:', err);
  }
}

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
        ssl: isLocal ? false : { rejectUnauthorized: false },
        max: 5,
        idleTimeoutMillis: 30000,
        connectionTimeoutMillis: 2000,
      });
      pool.on('error', (err) => {
        console.warn('[DB Pool Warning - using local disk fallback]', err.message);
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
    console.warn('[DB not reachable, switching to disk fallback]', err.message || err);
    dbDisabled = true;
    lastDbAttempt = Date.now();
    return false;
  }
}

export async function getDbState<T = any>(key: string, defaultValue: T): Promise<T> {
  if (isDbAvailable()) {
    try {
      const ok = await ensureTable();
      if (ok) {
        const p = getPool();
        if (p) {
          const res = await p.query('SELECT value FROM ftw_app_state WHERE key = $1', [key]);
          if (res.rows.length > 0 && res.rows[0].value !== undefined && res.rows[0].value !== null) {
            return res.rows[0].value as T;
          }
        }
      }
    } catch (err: any) {
      console.warn(`[DB getDbState fallback for key "${key}"]`, err.message || err);
      dbDisabled = true;
      lastDbAttempt = Date.now();
    }
  }

  // Fallback to disk cache
  const disk = readDiskCache();
  if (disk[key] !== undefined && disk[key] !== null) {
    return disk[key] as T;
  }

  return defaultValue;
}

export async function setDbState(key: string, value: any): Promise<void> {
  // Always write to local disk cache first so data is never lost
  writeDiskCache(key, value);

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
