import * as React from "react"

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'outline' | 'ghost' | 'danger'
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', ...props }, ref) => {
    const baseStyles = "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600 disabled:opacity-50 disabled:pointer-events-none ring-offset-background"
    
    const variants = {
      default: "bg-indigo-600 text-white hover:bg-indigo-500 shadow-sm",
      outline: "border border-gray-300 hover:bg-gray-100 dark:border-gray-700 dark:hover:bg-gray-800 dark:text-gray-100",
      ghost: "hover:bg-gray-100 hover:text-gray-900 dark:hover:bg-gray-800 dark:hover:text-gray-50 text-gray-700 dark:text-gray-300",
      danger: "bg-red-600 text-white hover:bg-red-500 shadow-sm"
    }

    return (
      <button
        className={`${baseStyles} ${variants[variant]} h-10 py-2 px-4 ${className || ''}`}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button }
