// src/components/common/DataTable.js
import React from 'react';

/**
 * Reusable data table component with pagination
 * 
 * @param {Object} props - Component props
 * @param {Array} props.columns - Array of column objects with keys: key, title, render (optional)
 * @param {Array} props.data - Array of data objects
 * @param {number} props.currentPage - Current page number
 * @param {number} props.totalPages - Total number of pages
 * @param {number} props.totalItems - Total number of items
 * @param {number} props.indexOfFirstRow - Index of the first row on the current page
 * @param {number} props.indexOfLastRow - Index of the last row on the current page
 * @param {Function} props.onPageChange - Function to handle page change
 * @param {string} props.accentColor - Accent color for pagination buttons
 */
const DataTable = ({
  columns,
  data,
  currentPage,
  totalPages,
  totalItems,
  indexOfFirstRow,
  indexOfLastRow,
  onPageChange,
  accentColor = 'cyan'
}) => {
  return (
    <div className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-gray-700 text-gray-300 uppercase text-xs">
            <tr>
              {columns.map((column) => (
                <th key={column.key} className="px-6 py-3">
                  {column.title}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700">
            {data.map((item, index) => (
              <tr key={item.id || index} className="bg-gray-800 hover:bg-gray-750">
                {columns.map((column) => (
                  <td key={`${item.id || index}-${column.key}`} className="px-6 py-4">
                    {column.render ? column.render(item) : item[column.key]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {/* Pagination */}
      <div className="px-6 py-3 bg-gray-700 flex items-center justify-between">
        <div className="text-sm text-gray-400">
          Showing {indexOfFirstRow} to {indexOfLastRow} of {totalItems} items
        </div>
        <div className="flex space-x-1">
          <button 
            onClick={() => currentPage > 1 && onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className={`px-3 py-1 rounded-md text-sm ${
              currentPage === 1 
                ? 'bg-gray-600 text-gray-400 cursor-not-allowed' 
                : 'bg-gray-600 hover:bg-gray-500 text-white'
            }`}
          >
            Previous
          </button>
          
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => onPageChange(page)}
              className={`px-3 py-1 rounded-md text-sm ${
                currentPage === page 
                  ? `bg-${accentColor}-700 text-white` 
                  : 'bg-gray-600 hover:bg-gray-500 text-white'
              }`}
            >
              {page}
            </button>
          ))}
          
          <button 
            onClick={() => currentPage < totalPages && onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={`px-3 py-1 rounded-md text-sm ${
              currentPage === totalPages 
                ? 'bg-gray-600 text-gray-400 cursor-not-allowed' 
                : 'bg-gray-600 hover:bg-gray-500 text-white'
            }`}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default DataTable;