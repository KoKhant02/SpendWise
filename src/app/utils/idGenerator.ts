/**
 * Utility for generating unique IDs
 * Eliminates DRY violation - this pattern was repeated 10+ times
 */

interface HasId {
  id: number;
}

/**
 * Generates the next unique ID for a collection
 * @param items - Array of items with id property
 * @returns Next available ID (max + 1)
 */
export const generateId = <T extends HasId>(items: T[]): number => {
  return Math.max(0, ...items.map(item => item.id)) + 1;
};
