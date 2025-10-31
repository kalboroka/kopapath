import { LuTriangleAlert } from './Icons';

export default function FormField({ label, name, type, value, onInput, placeholder, error }) {
  return (
    <div className="input-info">
      <label htmlFor={name}>{label}</label>
      <input
        name={name}
        type={type}
        value={value}
        placeholder={placeholder}
        onInput={onInput}
        required
      />
      {error && <LuTriangleAlert />}
    </div>
  );
}