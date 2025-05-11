function Card({ title, children, className = '' }) {
  return (
    <div className={`card ${className}`}>
      {title && (
        <div className="border-b px-5 py-4">
          <h3 className="text-lg font-medium text-gray-700">{title}</h3>
        </div>
      )}
      <div className="p-5">
        {children}
      </div>
    </div>
  )
}

export default Card