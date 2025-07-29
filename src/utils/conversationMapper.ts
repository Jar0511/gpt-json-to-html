import { MapItem } from '@/types/conversation';

/**
 * Convert conversation mapping object to ordered array
 * @param mapping The conversation mapping object
 * @returns Ordered array of MapItems following parent-child relationships
 */
export function convertMappingToOrderedArray(mapping: {
	[key: string]: MapItem;
}): MapItem[] {
	const orderedItems: MapItem[] = [];
	const visited = new Set<string>();

	// Find the root item (parent is null)
	const rootItem = Object.values(mapping).find((item) => item.parent === null);

	if (!rootItem) {
		console.warn('No root item found in conversation mapping');
		return orderedItems;
	}

	// Recursive function to traverse all branches
	function traverseItem(item: MapItem) {
		// Avoid infinite loops
		if (visited.has(item.id)) {
			return;
		}

		visited.add(item.id);
		orderedItems.push(item);

		// Process all children
		for (const childId of item.children) {
			if (childId in mapping) {
				traverseItem(mapping[childId]);
			}
		}
	}

	// Start traversal from root
	traverseItem(rootItem);

	return orderedItems;
}

/**
 * Filter only items with messages from ordered array
 * @param orderedItems Ordered array of MapItems
 * @returns Array of MapItems that have messages
 */
export function filterMessagesFromOrderedArray(
	orderedItems: MapItem[]
): MapItem[] {
	return orderedItems.filter((item) => item.message !== null);
}
