import * as React from "react"

const Avatar = React.forwardRef(({ className, ...props }, ref) => (
    <div
        ref={ref}
        className={`relative flex shrink-0 overflow-hidden rounded-full ${className || ''}`}
        {...props}
    />
))
Avatar.displayName = "Avatar"

const AvatarImage = ({ className, src, alt, ...props }) => {
    if (!src) return null;
    return (
        <img
            src={src}
            alt={alt}
            className={`aspect-square h-full w-full object-cover ${className || ''}`}
            {...props}
        />
    )
}
AvatarImage.displayName = "AvatarImage"

const AvatarFallback = React.forwardRef(({ className, ...props }, ref) => (
    <div
        ref={ref}
        className={`flex h-full w-full items-center justify-center rounded-full bg-muted ${className || ''}`}
        {...props}
    />
))
AvatarFallback.displayName = "AvatarFallback"

export { Avatar, AvatarImage, AvatarFallback }
