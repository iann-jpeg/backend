// Utility: Pagination
export function paginate(page: number = 1, limit: number = 20) {
  const take = limit;
  const skip = (page - 1) * limit;
  return { take, skip };
}

// Utility: Error handler
export function handlePrismaError(error: any) {
  if (error.code === 'P2025') {
    return { success: false, message: 'Not found' };
  }
  return { success: false, message: error.message || 'Unknown error' };
}

// Utility: Logger
export function log(...args: any[]) {
  if (process.env.NODE_ENV !== 'production') {
    console.log('[LOG]', ...args);
  }
}
