/**
 * Key-case normalisation for API responses.
 *
 * The frontend reads properties exactly as Jackson names them: the leading capital(s) lowercased and the
 * rest left alone (Student_id -> student_id, Sequence_No -> sequence_No, LastSeen_Global_Notification_id ->
 * lastSeen_Global_Notification_id, DOB -> dob). If the backend ever sends PascalCase instead, this converts
 * it to that shape. Keys that already start in lower case are left untouched, so it is idempotent and safe
 * to run on every response.
 */
const isPlainObject = (v) => v !== null && typeof v === 'object' && Object.getPrototypeOf(v) === Object.prototype;

export function toCamelKey(key) {
  if (typeof key !== 'string' || !key) return key;
  if (!/^[A-Z]/.test(key)) return key; // already camelCase / snake_case / numeric
  if (key === key.toUpperCase()) return key.toLowerCase(); // "DOB" -> "dob", "ID" -> "id"
  // "URLPath" -> "urlPath": lower the capital run but keep the last capital when a lower-case letter follows
  const m = key.match(/^([A-Z]+)(?=[A-Z][a-z])/);
  if (m) return m[1].toLowerCase() + key.slice(m[1].length);
  return key.charAt(0).toLowerCase() + key.slice(1); // "Student_id" -> "student_id"
}

export function camelizeKeys(data) {
  if (Array.isArray(data)) return data.map(camelizeKeys);
  if (isPlainObject(data)) {
    const out = {};
    for (const k of Object.keys(data)) out[toCamelKey(k)] = camelizeKeys(data[k]);
    return out;
  }
  return data; // strings, numbers, null, booleans pass through
}
