import { useCallback, useState } from 'react';

/**
 * Tiny form-state helper.
 *   const f = useForm({ title: '' });
 *   <input {...f.bind('title')} />      f.values.title      f.set('title', 'x')      f.reset()
 */
export function useForm(initial) {
  const [values, setValues] = useState(initial);
  const set = useCallback((name, value) => setValues((v) => ({ ...v, [name]: value })), []);
  const bind = (name) => ({ value: values[name] ?? '', onChange: (e) => set(name, e.target.value) });
  const reset = useCallback((next) => setValues(next ?? initial), [initial]); // eslint-disable-line react-hooks/exhaustive-deps
  return { values, set, bind, reset, setValues };
}
