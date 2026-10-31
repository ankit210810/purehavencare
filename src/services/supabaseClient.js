import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// True if user configured real Supabase keys
export const isSupabaseConfigured = Boolean(
  supabaseUrl && 
  supabaseAnonKey && 
  supabaseUrl !== 'https://your-project.supabase.co' &&
  !supabaseUrl.includes('your-project')
);

// Create official Supabase client when keys are available
export const supabase = isSupabaseConfigured 
  ? createClient(supabaseUrl, supabaseAnonKey) 
  : null;

// Persistent local storage helper for standalone testing & demo mode
const STORAGE_PREFIX = 'purehaven_db_';

export const localDb = {
  get: (table, defaultValue = []) => {
    try {
      const data = localStorage.getItem(STORAGE_PREFIX + table);
      return data ? JSON.parse(data) : defaultValue;
    } catch {
      return defaultValue;
    }
  },
  set: (table, data) => {
    try {
      localStorage.setItem(STORAGE_PREFIX + table, JSON.stringify(data));
      return true;
    } catch {
      return false;
    }
  },
  insert: (table, record) => {
    const list = localDb.get(table, []);
    const newRecord = {
      id: record.id || `id_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      createdAt: new Date().toISOString(),
      ...record
    };
    list.unshift(newRecord);
    localDb.set(table, list);
    return newRecord;
  },
  update: (table, id, updates) => {
    const list = localDb.get(table, []);
    const index = list.findIndex(item => item.id === id);
    if (index !== -1) {
      list[index] = { ...list[index], ...updates, updatedAt: new Date().toISOString() };
      localDb.set(table, list);
      return list[index];
    }
    return null;
  },
  delete: (table, id) => {
    const list = localDb.get(table, []);
    const filtered = list.filter(item => item.id !== id);
    localDb.set(table, filtered);
    return true;
  }
};
