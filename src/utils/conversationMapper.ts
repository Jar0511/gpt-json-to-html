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

	// Find the root item (parent is null)
	let currentItem: MapItem | undefined = Object.values(mapping).find(
		(item) => item.parent === null
	);

	if (!currentItem) {
		console.warn('No root item found in conversation mapping');
		return orderedItems;
	}

	// Follow the chain of children
	while (currentItem) {
		orderedItems.push(currentItem);

		// Find next item
		if (currentItem.children.length > 0) {
			const nextId: string = currentItem.children[0];
			currentItem = mapping[nextId];
		} else {
			currentItem = undefined;
		}
	}

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
