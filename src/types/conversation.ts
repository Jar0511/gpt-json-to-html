// Common conversation types used across the application

// Base Conversation type (ChatGPT export format)

type SystemMessage = {
	author: {
		role: 'system';
		name: null;
		metadata: {};
	};
	metadata: {
		attachments: {
			id: string;
			name: string;
			mimeType: string;
			fileSizeTokens: null;
		}[];
		is_visually_hidden_from_conversation?: boolean;
	};
};

type AssistantMessage = {
	author: {
		role: 'assistant';
		name: null;
		metadata: {};
	};
	metadata: {
		request_id?: string;
		message_type?: 'next' | null;
		model_slug?: string;
		default_model_slug?: string;
		parent_id?: string;
		timestamp_?: 'absolute';
		finish_details?: {
			type: 'stop';
			stop_tokens: number[];
		};
		is_complete?: boolean;
		citations?: [];
		content_references?: ({
			matched_text: string;
			start_idx: number;
			end_idx: number;
			safe_urls: string[];
			refs: string[];
			alt: string | null;
			prompt_text: string | null;
		} & (TextAttrRef | TextLinkRef | TextHideRef))[];
	};
};

type UserMessage = {
	author: {
		role: 'user';
		name: null;
		metadata: {};
	};
	metadata: {
		selected_sources?: [];
		selected_github_repos?: [];
		serialization_metadata?: {
			custom_symbol_offsets?: [];
		};
		request_id?: string;
		message_source?: null;
		timestamp_?: 'absolute';
		message_type?: null;
	};
};

type ToolMessage = {
	author: {
		role: 'tool';
		name: string;
		metadata: {
			request_id?: string;
			timestamp_?: 'absolute';
			message_type?: null;
			model_slug?: string;
			default_model_slug?: string;
			parent_id?: string;
		};
	};
};

type TextAttrRef = {
	type: 'attribution';
	attributable_index: string;
};
type TextLinkRef = {
	type: 'grouped_webpages' | 'grouped_webpages_model_predicted_fallback';
	items: {
		title: string;
		url: string;
		snippet: string;
		pub_date: number;
		attribution_segments: string[];
		supporting_websites: {
			title: string;
			url: string;
			snippet: string;
			pub_date: number;
			attribution: string;
		}[];
		refs: {
			turn_index: number;
			ref_type: string;
			ref_index: number;
		}[];
		hue: null;
		attributions: null;
		attribution: string;
	}[];
	fallback_items: {
		title: string;
		url: string;
		pub_date: number;
		snippet: string;
		refs: {
			turn_index: number;
			ref_type: string;
			ref_index: number;
		}[];
	}[];
};

type TextHideRef = {
	type: 'hidden';
};

type TextContent = {
	content_type: 'text';
	parts: string[];
};

type ReasoningContent = {
	content_type: 'reasoning_recap';
	content: string;
};

type OutputContent = {
	content_type: 'execution_output';
	text: string;
};

type CodeContent = {
	content_type: 'code';
	language: 'json' | 'unknown';
	response_format_name: null;
	text: string;
};

type ImageContent = {
	content_type: 'multimodal_text';
	parts: (
		| {
				content_type: string;
				asset_pointer: string;
				size_bytes: number;
				width: number;
				height: number;
				fovea: number;
				metadata: {
					dalle?: {
						gen_id: string;
						prompt: string;
						seed: number;
						parent_gen_id: null;
						edit_op: null;
						serialization_title: string;
					};
				};
		  }
		| string
	)[];
};

type ContentType =
	| TextContent
	| CodeContent
	| ImageContent
	| ReasoningContent
	| OutputContent;
type RoleMessage = SystemMessage | AssistantMessage | UserMessage | ToolMessage;

export type MapItem = {
	id: string;
	message:
		| null
		| ({
				id: string;
				create_time: null | number;
				update_time: null | number;
				content: ContentType;
				status: 'finished_successfully';
				end_turn: boolean;
				recipient: 'all';
				channel: null;
		  } & RoleMessage);
	parent: null | string;
	children: string[];
};
export interface Conversation {
	id: string;
	title: string | null;
	update_time: number;
	conversation_template_id?: string | null;
	mapping?: { [key: string]: MapItem };
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
