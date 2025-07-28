// Common conversation types used across the application

// Base Conversation type (ChatGPT export format)
export interface Conversation {
	id: string;
	title: string | null;
	update_time: number;
	conversation_template_id?: string | null;
	mapping?: any;
	[key: string]: any;
}

// Sidebar item types
export interface SidebarItemBase {
	title: string;
	id: string;
}

export interface SidebarProject {
	title: string;
	children: SidebarItemBase[];
}

export type SidebarItem = SidebarItemBase | SidebarProject;

// Type guard function
export function isSidebarProject(item: SidebarItem): item is SidebarProject {
	return 'children' in item;
}
