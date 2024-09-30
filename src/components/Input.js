const Input = ({ label, type, placeholder, value, change, accept }) => {
  return (
    <div className="input-box">
      <label className="input-lable">{label}</label>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={change}
        className="input-text"
        accept={accept}
      />
    </div>
  );
};
export default Input;
