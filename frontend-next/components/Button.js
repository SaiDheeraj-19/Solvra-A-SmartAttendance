export default function Button({ children, variant = 'primary', className = '', ...props }) {
  const base = 'inline-flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition focus:outline-none'
  const variants = {
    primary: 'bg-mhgold text-white shadow-sm hover:brightness-95',
    outline: 'border border-mhmuted text-mhcharcoal bg-white hover:bg-mhbg'
  }
  return (
    <button className={`${base} ${variants[variant] || variants.primary} ${className}`} {...props}>
      {children}
    </button>
  )
}
