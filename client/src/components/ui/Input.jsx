import { forwardRef } from 'react'
import { cn } from '../../lib/utils'

const Input = forwardRef(({ className, type = 'text', leftIcon: Left, rightIcon: Right, error, ...props }, ref) => {
  return (
    <div className="relative w-full">
      {Left && (
        <Left className="absolute left-3 top-[11px] h-4 w-4 text-muted-foreground" />
      )}
      <input
        type={type}
        ref={ref}
        className={cn(
          'flex h-10 w-full rounded-xl border border-border bg-[#171717] px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50',
          Left && 'pl-10',
          Right && 'pr-10',
          error && 'border-destructive focus-visible:ring-destructive',
          className
        )}
        {...props}
      />
      {Right && (
        <Right className="absolute right-3 top-[11px] h-4 w-4 text-muted-foreground" />
      )}
    </div>
  )
})
Input.displayName = 'Input'

export default Input
export { Input }
