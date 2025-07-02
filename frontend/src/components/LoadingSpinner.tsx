interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg"
  text?: string
}

export default function LoadingSpinner({ size = "md", text }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-8 w-8",
    lg: "h-12 w-12",
  }

  return (
    <div className="flex items-center justify-center p-4">
      <div className="flex items-center space-x-2">
        <div className={`animate-spin rounded-full border-2 border-gray-600 border-t-blue-400 ${sizeClasses[size]}`} />
        {text && <span className="text-gray-300">{text}</span>}
      </div>
    </div>
  )
}
