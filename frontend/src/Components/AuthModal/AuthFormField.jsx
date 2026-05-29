export function RequiredMark() {
  return (
    <span className="text-red-500" aria-hidden="true">
      *
    </span>
  )
}

function AuthFormField({ label, required = false, htmlFor, children }) {
  if (!label) return children

  return (
    <div>
      <label
        htmlFor={htmlFor}
        className="mb-1 block text-xs font-medium text-slate-600 dark:text-slate-400"
      >
        {label}
        {required && (
          <>
            {' '}
            <RequiredMark />
          </>
        )}
      </label>
      {children}
    </div>
  )
}

export default AuthFormField
