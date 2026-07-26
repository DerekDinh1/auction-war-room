/**
 * Persistence for GitHub Pages (localStorage) with optional window.storage
 * (Claude artifact / other hosts). Async API so callers stay the same.
 */

const memory = new Map();

function hasLocal() {
  try {
    return typeof localStorage !== "undefined";
  } catch {
    return false;
  }
}

export async function storageGet(key) {
  try {
    if (typeof window !== "undefined" && window.storage?.get) {
      const r = await window.storage.get(key);
      if (r && r.value != null) return r.value;
    }
  } catch {
    /* fall through */
  }
  if (hasLocal()) {
    const v = localStorage.getItem(key);
    if (v != null) return v;
  }
  return memory.has(key) ? memory.get(key) : null;
}

export async function storageSet(key, value) {
  const str = typeof value === "string" ? value : JSON.stringify(value);
  try {
    if (typeof window !== "undefined" && window.storage?.set) {
      await window.storage.set(key, str);
      return;
    }
  } catch {
    /* fall through */
  }
  if (hasLocal()) {
    localStorage.setItem(key, str);
    return;
  }
  memory.set(key, str);
}

export async function storageDelete(key) {
  try {
    if (typeof window !== "undefined" && window.storage?.delete) {
      await window.storage.delete(key);
    }
  } catch {
    /* ignore */
  }
  if (hasLocal()) localStorage.removeItem(key);
  memory.delete(key);
}
