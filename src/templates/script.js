// Auto-scroll to current page item in sidebar
document.addEventListener('DOMContentLoaded', function () {
	// Find the current page item
	const currentItem = document.getElementById('current-page-item');

	if (currentItem) {
		// Find the sidebar content container
		const sidebarContent = document.querySelector('.sidebar-content');

		if (sidebarContent) {
			// Check if the item is inside a collapsed details element
			const parentDetails = currentItem.closest('details');
			if (parentDetails && !parentDetails.open) {
				parentDetails.open = true;
			}

			// Wait a bit for details animation to complete
			setTimeout(() => {
				// Calculate scroll position
				const itemRect = currentItem.getBoundingClientRect();
				const sidebarRect = sidebarContent.getBoundingClientRect();
				const scrollTop =
					currentItem.offsetTop -
					sidebarContent.offsetTop -
					sidebarRect.height / 2 +
					itemRect.height / 2;

				// Smooth scroll to the item
				sidebarContent.scrollTo({
					top: Math.max(0, scrollTop),
					behavior: 'smooth',
				});

				// Add visual highlight
				currentItem.classList.add('highlight-current');
			}, 100);
		}
	}
});
