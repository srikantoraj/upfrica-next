// components/LoaderButton.jsx
import React from 'react'

export default function LoaderButton({
    loading,
    className,
    children,
    ...props
}) {
    return (
        <button
            className={className}
            disabled={loading || props.disabled}
            {...props}
        >
            {loading ? (
                <div className="flex space-x-2 justify-center items-center h-6">
                    <div className="h-2 w-2 bg-white rounded-full animate-bounce [animation-delay:-0.3s]" />
                    <div className="h-2 w-2 bg-white rounded-full animate-bounce [animation-delay:-0.15s]" />
                    <div className="h-2 w-2 bg-white rounded-full animate-bounce" />
                </div>
            ) : (
                children
            )}
        </button>
    )
}
