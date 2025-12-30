import { useState } from 'react';
import { DEFAULT_PAGE_SIZE } from '../utils/constants';

/**
 * Pagination hook - manages pagination state
 * 
 * @param {number} initialPage - Initial page number (default: 1)
 * @param {number} initialPageSize - Initial page size (default: 10)
 * @returns {object} Pagination state and handlers
 */
export const usePagination = (initialPage = 1, initialPageSize = DEFAULT_PAGE_SIZE) => {
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [pageSize, setPageSize] = useState(initialPageSize);
  const [totalItems, setTotalItems] = useState(0);

  const totalPages = Math.ceil(totalItems / pageSize);

  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const previousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const changePageSize = (newSize) => {
    setPageSize(newSize);
    setCurrentPage(1); // Reset to first page when page size changes
  };

  const reset = () => {
    setCurrentPage(1);
    setPageSize(initialPageSize);
  };

  return {
    currentPage,
    pageSize,
    totalItems,
    totalPages,
    setTotalItems,
    goToPage,
    nextPage,
    previousPage,
    changePageSize,
    reset
  };
};

export default usePagination;