import { formatPriceInput, parsePriceDigits } from '../../utils/formatProductPrice'

function PriceInput({
  value,
  onChange,
  placeholder,
  disabled = false,
  className = '',
  id,
  required = false,
  'aria-label': ariaLabel,
}) {
  const handleChange = (event) => {
    const digits = parsePriceDigits(event.target.value)
    onChange(digits === '' ? '' : formatPriceInput(digits))
  }

  return (
    <input
      id={id}
      type="text"
      inputMode="numeric"
      autoComplete="off"
      value={value}
      onChange={handleChange}
      placeholder={placeholder}
      disabled={disabled}
      required={required}
      aria-label={ariaLabel}
      className={className}
    />
  )
}

export default PriceInput
