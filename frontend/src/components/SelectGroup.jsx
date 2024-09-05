export const SelectGroup = ({
  label,
  name,
  small,
  fieldRef,
  error,
  options,
  value,
  onChange,
}) => {
  return (
    <div className='flex flex-col'>
      <label htmlFor={name} className='text-sm'>
        {label}
      </label>
      <select
        id={name}
        className={
          !small
            ? 'select focus:select-primary'
            : 'select select-sm focus:select-primary'
        }
        ref={fieldRef}
        value={value}
        onChange={onChange}
      >
        {options.map((option) => {
          return (
            <option key={option.id} value={option.value}>
              {option.value}
            </option>
          );
        })}
      </select>
      {error && (
        <p className='text-red-600 font-semibold text-sm mt-1'>{error}</p>
      )}
    </div>
  );
};
