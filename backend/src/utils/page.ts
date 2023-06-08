export const getPageSkip = (page: number, row: number): number => {
  return row * (page - 1);
};

export const getTotalPages = (total: number, rowsPerPage: number): number => {
  return Math.ceil(total / rowsPerPage);
};
