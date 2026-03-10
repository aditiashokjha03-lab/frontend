import * as React from "react"

const Button = React.forwardRef(({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? props.children.type : "button"
    const childProps = asChild ? props.children.props : {}
    return (
        <Comp
            className={`inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50
      ${variant === 'outline' ? 'border border-input bg-background hover:bg-accent hover:text-accent-foreground' :
                    variant === 'ghost' ? 'hover:bg-accent hover:text-accent-foreground' :
                        'bg-primary text-primary-foreground hover:bg-primary-hover'}
      ${size === 'sm' ? 'h-9 rounded-md px-3' :
                    size === 'lg' ? 'h-11 rounded-md px-8' :
                        size === 'icon' ? 'h-10 w-10' :
                            'h-10 px-4 py-2'}
      ${className || ''}`}
            ref={ref}
            {...childProps}
            {...props}
        >
            {asChild ? props.children.props.children : props.children}
        </Comp>
    )
})
Button.displayName = "Button"

export { Button }
