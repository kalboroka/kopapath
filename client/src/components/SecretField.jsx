import { LuTriangleAlert, LuEye, LuEyeOff } from './Icons';

export default function SecretField({ label, name, value, show, onToggle, onInput, placeholder, error }) {
  return (
    <div className="input-secret">
      <label htmlFor={name}>{label}</label>
      <input
        name={name}
        type={show ? 'text' : 'password'}
        value={value}
        placeholder={placeholder}
        onInput={onInput}
        required
      />
      <button
        type="button"
        onClick={onToggle}
        className="mask-btn"
        aria-label="Toggle password visibility"
      >
        {show ? <LuEyeOff size={18} /> : <LuEye size={18} />}
      </button>
      {error && <LuTriangleAlert />}
    </div>
  );
}