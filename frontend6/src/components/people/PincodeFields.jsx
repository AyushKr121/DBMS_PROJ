import { useMemo } from 'react';
import Field from '@/components/ui/Field';
import { isPincode } from '@/utils/validators';

/**
 * Pincode input with live lookup against the Pincode table. When the code is new, city and state
 * are asked for and the pincode row is created together with the person.
 * `values` = { Pincode, City, State }, `onChange(patch)`.
 */
export default function PincodeFields({ values, onChange, pincodes }) {
  const code = (values.Pincode || '').trim();
  const known = useMemo(() => pincodes.find((p) => p.Pincode === code), [pincodes, code]);
  const isNew = code !== '' && isPincode(code) && !known;
  const invalid = code !== '' && !isPincode(code);

  return (
    <>
      <Field
        label="Pincode"
        hint={known ? `${known.City}, ${known.State}` : isNew ? 'New pincode. Add its city and state below.' : 'Six digits'}
        error={invalid ? 'Pincode must be six digits.' : undefined}
      >
        <input inputMode="numeric" maxLength={6} value={values.Pincode || ''} onChange={(e) => onChange({ Pincode: e.target.value.replace(/\D/g, '') })} />
      </Field>
      {isNew && (
        <>
          <Field label="City" required><input required value={values.City || ''} onChange={(e) => onChange({ City: e.target.value })} /></Field>
          <Field label="State" required><input required value={values.State || ''} onChange={(e) => onChange({ State: e.target.value })} /></Field>
        </>
      )}
    </>
  );
}
