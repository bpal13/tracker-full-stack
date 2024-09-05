const InputGroup = ({
  label,
  type,
  placeholder,
  name,
  fieldRef,
  required,
  error,
  value,
  onChange,
}) => {
  return (
    <div className='flex flex-col'>
      <label htmlFor={name} className='text-sm'>
        {label}
      </label>
      <input
        type={type ? type : 'text'}
        id={name}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        ref={fieldRef}
        required={required ? true : false}
        className={
          !error
            ? 'input focus:input-primary'
            : 'input input-error focus:input-primary'
        }
      />
      {error && (
        <p className='text-red-600 font-semibold text-sm mt-1'>{error}</p>
      )}
    </div>
  );
};
export default InputGroup;
