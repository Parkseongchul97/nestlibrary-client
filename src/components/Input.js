const Input = ({
  label,
  type,
  placeholder,
  value,
  change,
  accept,
  className,
}) => {
  return (
    <div className="input-box">
      <label className="input-label">{label}</label>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={change}
        accept={accept}
        className={className}
      />
    </div>
  );
};
export default Input;
