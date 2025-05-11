import { useState } from 'react'
import { FaSort, FaSortUp, FaSortDown, FaChevronLeft, FaChevronRight } from 'react-icons/fa'

function DataTable({
  columns,
  data = [],
  defaultSortField = '',
  defaultSortDirection = 'asc',
  pageSize = 10,
  className = ''
}) {
  const [sortField, setSortField] = useState(defaultSortField)
  const [sortDirection, setSortDirection] = useState(defaultSortDirection)
  const [currentPage, setCurrentPage] = useState(1)
  
  const handleSort = (field) => {
    if (field === sortField) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDirection('asc')
    }
  }
  
  const sortedData = [...data].sort((a, b) => {
    if (!sortField) return 0
    
    const aValue = a[sortField]
    const bValue = b[sortField]
    
    if (aValue === bValue) return 0
    
    const comparison = aValue > bValue ? 1 : -1
    return sortDirection === 'asc' ? comparison : -comparison
  })
  
  const totalPages = Math.ceil(sortedData.length / pageSize)
  const startIndex = (currentPage - 1) * pageSize
  const paginatedData = sortedData.slice(startIndex, startIndex + pageSize)
  
  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page)
    }
  }
  
  return (
    <div className={`table-container ${className}`}>
      <table className="table">
        <thead>
          <tr>
            {columns.map((column) => (
              <th 
                key={column.field} 
                className={`table-header px-6 py-3 ${column.sortable !== false ? 'cursor-pointer hover:bg-gray-100' : ''}`}
                onClick={() => column.sortable !== false && handleSort(column.field)}
              >
                <div className="flex items-center space-x-1">
                  <span>{column.title}</span>
                  {column.sortable !== false && (
                    <span className="inline-flex">
                      {sortField === column.field ? (
                        sortDirection === 'asc' ? <FaSortUp /> : <FaSortDown />
                      ) : (
                        <FaSort className="text-gray-300" />
                      )}
                    </span>
                  )}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="table-body">
          {paginatedData.length > 0 ? (
            paginatedData.map((row, rowIndex) => (
              <tr key={rowIndex} className="hover:bg-gray-50">
                {columns.map((column, colIndex) => (
                  <td key={colIndex} className="table-cell">
                    {column.render 
                      ? column.render(row[column.field], row)
                      : row[column.field]
                    }
                  </td>
                ))}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={columns.length} className="table-cell text-center py-8 text-gray-500">
                No data available
              </td>
            </tr>
          )}
        </tbody>
      </table>
      
      {data.length > pageSize && (
        <div className="px-6 py-4 bg-white border-t border-gray-200 flex items-center justify-between">
          <div className="flex items-center text-sm text-gray-500">
            Showing {startIndex + 1} to {Math.min(startIndex + pageSize, data.length)} of {data.length} entries
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              className="p-2 rounded-md hover:bg-gray-100 text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage === 1}
            >
              <FaChevronLeft size={14} />
            </button>
            
            <div className="flex items-center space-x-1">
              {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                let pageNum = i + 1
                
                // Adjust for large page counts
                if (totalPages > 5) {
                  if (currentPage > 3 && currentPage < totalPages - 1) {
                    pageNum = i + currentPage - 2
                  } else if (currentPage >= totalPages - 1) {
                    pageNum = totalPages - 4 + i
                  }
                }
                
                return (
                  <button
                    key={i}
                    className={`w-8 h-8 rounded-md flex items-center justify-center text-sm ${
                      pageNum === currentPage
                        ? 'bg-primary-100 text-primary-600 font-medium'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                    onClick={() => goToPage(pageNum)}
                  >
                    {pageNum}
                  </button>
                )
              })}
            </div>
            
            <button
              className="p-2 rounded-md hover:bg-gray-100 text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              <FaChevronRight size={14} />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default DataTable