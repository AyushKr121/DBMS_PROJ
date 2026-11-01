import { useId, cloneElement, isValidElement } from 'react';

/** Label + control + hint. The control gets the id automatically when it is a single element. */
export default function Field({ label, required, hint, error, children, className = '' }) {
  const id = useId();
  const control = isValidElement(children) && !children.props.id ? cloneElement(children, { id }) : children;
  return (
    <div className={`field ${className}`}>
      {label && (
        <label className="field__label" htmlFor={isValidElement(children) ? children.props.id || id : undefined}>
          {label}{required && <span className="field__req" aria-hidden="true">*</span>}
        </label>
      )}
      {control}
      {hint && !error && <span className="field__hint">{hint}</span>}
      {error && <span className="field__error" role="alert">{error}</span>}
    </div>
  );
}
