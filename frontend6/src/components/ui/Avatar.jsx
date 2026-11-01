import { useState } from 'react';
import { initialsOf } from '@/utils/format';

/**
 * Profile pictures are never stored. The picture is generated on the fly from the person's name with the
 * third-party ui-avatars.com service ("Ayush Kumar" -> "AK"); if it cannot load, the initials are drawn locally.
 */
export default function Avatar({ person, size = 36, className = '' }) {
  const [failed, setFailed] = useState(false);
  const name = [person?.First_name, person?.Last_name].filter(Boolean).join(' ') || person?.Email || '?';
  const initials = initialsOf(person);
  const px = Math.round(size * 2);
  const src = `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&size=${px}&background=2447a8&color=ffffff&bold=true&length=2&format=png`;

  const style = { width: size, height: size, fontSize: Math.max(11, size * 0.4) };
  if (failed) return <span className={`avatar avatar--fallback ${className}`} style={style} role="img" aria-label={name}>{initials}</span>;
  return (
    <img
      className={`avatar ${className}`}
      style={style}
      src={src}
      alt={name}
      width={size}
      height={size}
      loading="lazy"
      referrerPolicy="no-referrer"
      onError={() => setFailed(true)}
    />
  );
}
