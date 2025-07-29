import {
	Conversation,
	SidebarItem,
	isSidebarProject,
	MapItem,
} from '@/types/conversation';
import JSZip from 'jszip';
import {
	convertMappingToOrderedArray,
	filterMessagesFromOrderedArray,
} from '@/utils/conversationMapper';
import { parseMarkdown } from '@/utils/markdownParser';

// Import template files as strings
import indexHtmlTemplate from '@/templates/index.html?raw';
import pageHtmlTemplate from '@/templates/page.html?raw';
import mainCssTemplate from '@/templates/main.css?raw';
import scriptJsTemplate from '@/templates/script.js?raw';

// Import highlight.js files
import highlightJsTemplate from '@/templates/highlight.min.js?raw';
import githubDarkCssTemplate from '@/templates/github-dark.min.css?raw';

// Import KaTeX CSS
import katexCssTemplate from '@/templates/katex.min.css?raw';

// Import all language files
const languagesModules = import.meta.glob('@/templates/languages/**/*', {
	query: '?raw',
	import: 'default',
	eager: true,
});

// Import all font files as URLs
import KaTeX_AMS_Regular from '@/templates/fonts/KaTeX_AMS-Regular.woff2?url';
import KaTeX_Caligraphic_Bold from '@/templates/fonts/KaTeX_Caligraphic-Bold.woff2?url';
import KaTeX_Caligraphic_Regular from '@/templates/fonts/KaTeX_Caligraphic-Regular.woff2?url';
import KaTeX_Fraktur_Bold from '@/templates/fonts/KaTeX_Fraktur-Bold.woff2?url';
import KaTeX_Fraktur_Regular from '@/templates/fonts/KaTeX_Fraktur-Regular.woff2?url';
import KaTeX_Main_Bold from '@/templates/fonts/KaTeX_Main-Bold.woff2?url';
import KaTeX_Main_BoldItalic from '@/templates/fonts/KaTeX_Main-BoldItalic.woff2?url';
import KaTeX_Main_Italic from '@/templates/fonts/KaTeX_Main-Italic.woff2?url';
import KaTeX_Main_Regular from '@/templates/fonts/KaTeX_Main-Regular.woff2?url';
import KaTeX_Math_BoldItalic from '@/templates/fonts/KaTeX_Math-BoldItalic.woff2?url';
import KaTeX_Math_Italic from '@/templates/fonts/KaTeX_Math-Italic.woff2?url';
import KaTeX_SansSerif_Bold from '@/templates/fonts/KaTeX_SansSerif-Bold.woff2?url';
import KaTeX_SansSerif_Italic from '@/templates/fonts/KaTeX_SansSerif-Italic.woff2?url';
import KaTeX_SansSerif_Regular from '@/templates/fonts/KaTeX_SansSerif-Regular.woff2?url';
import KaTeX_Script_Regular from '@/templates/fonts/KaTeX_Script-Regular.woff2?url';
import KaTeX_Size1_Regular from '@/templates/fonts/KaTeX_Size1-Regular.woff2?url';
import KaTeX_Size2_Regular from '@/templates/fonts/KaTeX_Size2-Regular.woff2?url';
import KaTeX_Size3_Regular from '@/templates/fonts/KaTeX_Size3-Regular.woff2?url';
import KaTeX_Size4_Regular from '@/templates/fonts/KaTeX_Size4-Regular.woff2?url';
import KaTeX_Typewriter_Regular from '@/templates/fonts/KaTeX_Typewriter-Regular.woff2?url';
import Pretendard_Thin from '@/templates/fonts/Pretendard-Thin.woff2?url';
import Pretendard_ExtraLight from '@/templates/fonts/Pretendard-ExtraLight.woff2?url';
import Pretendard_Light from '@/templates/fonts/Pretendard-Light.woff2?url';
import Pretendard_Regular from '@/templates/fonts/Pretendard-Regular.woff2?url';
import Pretendard_SemiBold from '@/templates/fonts/Pretendard-SemiBold.woff2?url';
import Pretendard_Medium from '@/templates/fonts/Pretendard-Medium.woff2?url';
import Pretendard_Bold from '@/templates/fonts/Pretendard-Bold.woff2?url';
import Pretendard_ExtraBold from '@/templates/fonts/Pretendard-ExtraBold.woff2?url';
import Pretendard_Black from '@/templates/fonts/Pretendard-Black.woff2?url';

const fontUrls: { [key: string]: string } = {
	'KaTeX_AMS-Regular.woff2': KaTeX_AMS_Regular,
	'KaTeX_Caligraphic-Bold.woff2': KaTeX_Caligraphic_Bold,
	'KaTeX_Caligraphic-Regular.woff2': KaTeX_Caligraphic_Regular,
	'KaTeX_Fraktur-Bold.woff2': KaTeX_Fraktur_Bold,
	'KaTeX_Fraktur-Regular.woff2': KaTeX_Fraktur_Regular,
	'KaTeX_Main-Bold.woff2': KaTeX_Main_Bold,
	'KaTeX_Main-BoldItalic.woff2': KaTeX_Main_BoldItalic,
	'KaTeX_Main-Italic.woff2': KaTeX_Main_Italic,
	'KaTeX_Main-Regular.woff2': KaTeX_Main_Regular,
	'KaTeX_Math-BoldItalic.woff2': KaTeX_Math_BoldItalic,
	'KaTeX_Math-Italic.woff2': KaTeX_Math_Italic,
	'KaTeX_SansSerif-Bold.woff2': KaTeX_SansSerif_Bold,
	'KaTeX_SansSerif-Italic.woff2': KaTeX_SansSerif_Italic,
	'KaTeX_SansSerif-Regular.woff2': KaTeX_SansSerif_Regular,
	'KaTeX_Script-Regular.woff2': KaTeX_Script_Regular,
	'KaTeX_Size1-Regular.woff2': KaTeX_Size1_Regular,
	'KaTeX_Size2-Regular.woff2': KaTeX_Size2_Regular,
	'KaTeX_Size3-Regular.woff2': KaTeX_Size3_Regular,
	'KaTeX_Size4-Regular.woff2': KaTeX_Size4_Regular,
	'KaTeX_Typewriter-Regular.woff2': KaTeX_Typewriter_Regular,
	'Pretendard-Thin.woff2': Pretendard_Thin,
	'Pretendard-ExtraLight.woff2': Pretendard_ExtraLight,
	'Pretendard-Light.woff2': Pretendard_Light,
	'Pretendard-Regular.woff2': Pretendard_Regular,
	'Pretendard-Medium.woff2': Pretendard_Medium,
	'Pretendard-SemiBold.woff2': Pretendard_SemiBold,
	'Pretendard-Bold.woff2': Pretendard_Bold,
	'Pretendard-ExtraBold.woff2': Pretendard_ExtraBold,
	'Pretendard-Black.woff2': Pretendard_Black,
};

/**
 * 사이드바 HTML 생성
 * @param sidebarItems 사이드바 아이템 배열
 * @param isIndexPage index.html 페이지인지 여부 (경로 결정용)
 * @param currentPageId 현재 페이지의 conversation ID (선택적)
 * @returns 생성된 HTML 문자열
 */
export function generateSidebarHTML(
	sidebarItems: SidebarItem[],
	isIndexPage: boolean = true,
	currentPageId?: string
): string {
	const pathPrefix = isIndexPage ? 'pages/' : '';

	// 프로젝트와 일반 대화 분리
	const projects = sidebarItems.filter((item) => isSidebarProject(item));
	const regularItems = sidebarItems.filter((item) => !isSidebarProject(item));

	let html = '<ul class="conversation-list">\n';

	// 프로젝트 섹션
	if (projects.length > 0) {
		html += '\t<li class="section-header">프로젝트</li>\n';

		projects.forEach((project) => {
			if (isSidebarProject(project)) {
				html += '\t<li class="conversation-item project-item">\n';
				html += '\t\t<details>\n';
				html += `\t\t\t<summary class="project-title">${escapeHtml(project.title)}</summary>\n`;
				html += '\t\t\t<ul class="project-children">\n';

				project.children.forEach((child) => {
					const isCurrentPage = child.id === currentPageId;
					html += `\t\t\t\t<li class="child-item"${isCurrentPage ? ' id="current-page-item"' : ''}>\n`;
					html += `\t\t\t\t\t<a href="${pathPrefix}${child.id}.html">${escapeHtml(child.title)}</a>\n`;
					html += '\t\t\t\t</li>\n';
				});

				html += '\t\t\t</ul>\n';
				html += '\t\t</details>\n';
				html += '\t</li>\n';
			}
		});
	}

	// 일반 대화 섹션
	if (regularItems.length > 0) {
		html += '\t<li class="section-header">채팅</li>\n';

		regularItems.forEach((item) => {
			if (!isSidebarProject(item)) {
				const isCurrentPage = item.id === currentPageId;
				html += `\t<li class="conversation-item"${isCurrentPage ? ' id="current-page-item"' : ''}>\n`;
				html += `\t\t<a href="${pathPrefix}${item.id}.html">${escapeHtml(item.title)}</a>\n`;
				html += '\t</li>\n';
			}
		});
	}

	html += '</ul>';

	return html;
}

/**
 * HTML 이스케이프 함수
 */
function escapeHtml(unsafe: string): string {
	return unsafe
		.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
		.replace(/"/g, '&quot;')
		.replace(/'/g, '&#039;');
}

/**
 * Generate HTML for a single message
 */
function generateMessageHtml(
	item: MapItem,
	imageFilenames: string[] = []
): string {
	if (!item.message) return '';

	const message = item.message;
	const role = message.author.role;
	const roleClass = `message-${role}`;
	let contentHtml = '';

	// Handle different content types
	const content = message.content;

	switch (content.content_type) {
		case 'text':
			let texts = content.parts.join('\n');
			if (texts.length === 0) {
				return '';
			}

			// First convert markdown to HTML
			contentHtml = parseMarkdown(texts);

			// Then process content_references if they exist (for assistant messages)
			if (
				message.author.role === 'assistant' &&
				'metadata' in message &&
				message.metadata &&
				'content_references' in message.metadata &&
				message.metadata.content_references
			) {
				const references = Array.isArray(message.metadata.content_references)
					? message.metadata.content_references
					: [message.metadata.content_references];

				// Sort references by start_idx in descending order to process from end to start
				references
					.filter((ref) => !!ref)
					.sort((a, b) => b.start_idx - a.start_idx)
					.forEach((ref) => {
						if ('type' in ref && ref.type === 'hidden') {
							const escapedMatchedText = escapeHtml(ref.matched_text);
							contentHtml = contentHtml.replace(escapedMatchedText, '');
						}
						if ('type' in ref && ref.type.startsWith('grouped_webpages')) {
							// Use items if available, otherwise use fallback_items
							const itemsToUse =
								'items' in ref &&
								Array.isArray(ref.items) &&
								ref.items.length > 0
									? ref.items
									: 'fallback_items' in ref && Array.isArray(ref.fallback_items)
										? ref.fallback_items
										: [];

							if (itemsToUse.length > 0) {
								// Create links for all items
								const links = itemsToUse
									.filter(
										(
											item
										): item is typeof item & { url: string; title: string } =>
											item &&
											'url' in item &&
											'title' in item &&
											typeof item.url === 'string' &&
											typeof item.title === 'string'
									)
									.map((item, index) => {
										// For items with attribution, use it; for fallback_items, use index
										const linkText =
											'attribution' in item &&
											typeof item.attribution === 'string'
												? escapeHtml(item.attribution)
												: `[${index + 1}]`;
										return `<a href="${item.url}" title="${escapeHtml(item.title)}" target="_blank" rel="noopener noreferrer">${linkText}</a>`;
									})
									.join(' ');

								if (links) {
									// Replace the escaped matched text in HTML with links
									const escapedMatchedText = escapeHtml(ref.matched_text);
									// Simple string replacement - should work fine since matched_text is unique
									contentHtml = contentHtml.replace(escapedMatchedText, links);
								}
							}
						}
					});
			}
			break;

		case 'code':
			// Skip code content type - return empty string
			return '';

		case 'multimodal_text':
			// multimodal_text can contain both text strings and image objects
			let textParts: string[] = [];
			let imageParts: string[] = [];

			content.parts.forEach((part) => {
				if (typeof part === 'string') {
					// It's a text part
					textParts.push(part);
				} else if (part.asset_pointer) {
					// It's an image part
					// Extract filename prefix from asset_pointer
					const filenamePrefix = part.asset_pointer.split('/').pop() || 'image';

					// Find the full filename that starts with this prefix
					const fullFilename = imageFilenames.find((name) =>
						name.startsWith(filenamePrefix)
					);

					if (fullFilename) {
						imageParts.push(
							`<img src="../images/${fullFilename}" alt="Generated image" loading="lazy" />`
						);
					}
				}
			});

			// Combine text and images
			contentHtml = '';

			// Add text content if exists
			if (textParts.length > 0) {
				const combinedText = textParts.join('\n');
				contentHtml += parseMarkdown(combinedText);
			}

			// Add images if exist
			if (imageParts.length > 0) {
				contentHtml += '<div class="message-images">';
				contentHtml += imageParts.join('\n');
				contentHtml += '</div>';
			}
			break;

		case 'execution_output':
			// Skip execution_output content type - return empty string
			return '';

		case 'reasoning_recap':
			contentHtml = `<div class="reasoning-content">${parseMarkdown(content.content)}</div>`;
			break;

		default:
			// Skip unknown content types - return empty string
			return '';
	}

	return `
		<div class="message ${roleClass}">
			<div class="message-content">
				${contentHtml}
			</div>
		</div>
	`;
}

/**
 * Generate conversation content HTML
 */
function generateConversationContent(
	conversation: Conversation,
	imageFilenames: string[] = []
): string {
	if (!conversation.mapping) {
		return '<p class="no-content">대화 내용이 없습니다.</p>';
	}

	// Convert mapping to ordered array
	const orderedItems = convertMappingToOrderedArray(conversation.mapping);
	const messagesWithContent = filterMessagesFromOrderedArray(orderedItems);

	if (messagesWithContent.length === 0) {
		return '<p class="no-content">대화 내용이 없습니다.</p>';
	}

	// Generate HTML for each message
	const messagesHtml = messagesWithContent
		.map((item) => generateMessageHtml(item, imageFilenames))
		.join('\n');

	return `<div class="conversation-messages">${messagesHtml}</div>`;
}

/**
 * Generate index.html with sidebar
 */
function generateIndexHtml(
	template: string,
	sidebarItems: SidebarItem[]
): string {
	const sidebarHtml = generateSidebarHTML(sidebarItems, true);
	return template.replace('{{SIDEBAR_HTML}}', sidebarHtml);
}

/**
 * Generate individual conversation page HTML
 */
function generateConversationPageHtml(
	template: string,
	conversation: Conversation,
	sidebarItems: SidebarItem[],
	imageFilenames: string[] = []
): string {
	const sidebarHtml = generateSidebarHTML(sidebarItems, false, conversation.id);
	const title = conversation.title || 'Untitled Conversation';
	const date = new Date(conversation.update_time * 1000).toLocaleDateString(
		'ko-KR'
	);

	// Count messages if mapping exists
	let messageCount = 0;
	if (conversation.mapping) {
		messageCount = Object.values(conversation.mapping).filter(
			(node: any) => node.message?.content?.content_type === 'text'
		).length;
	}

	// Generate conversation content
	const conversationContent = generateConversationContent(
		conversation,
		imageFilenames
	);

	let html = template
		.replace(/{{SIDEBAR_HTML}}/g, sidebarHtml)
		.replace(/{{CONVERSATION_TITLE}}/g, escapeHtml(title))
		.replace(/{{CONVERSATION_DATE}}/g, date)
		.replace(/{{MESSAGE_COUNT}}/g, messageCount.toString())
		.replace(/{{CONVERSATION_CONTENT}}/g, conversationContent);

	return html;
}

/**
 * Generate complete HTML export as a zip file
 */
export async function generateHtmlExport(
	conversations: Conversation[],
	sidebarItems: SidebarItem[],
	imageFiles?: { [filename: string]: ArrayBuffer }
): Promise<Blob> {
	const zip = new JSZip();

	// Generate index.html
	const indexHtml = generateIndexHtml(indexHtmlTemplate, sidebarItems);
	zip.file('index.html', indexHtml);

	// Generate style/main.css, github-dark.min.css, and katex.min.css
	const styleFolder = zip.folder('style');
	styleFolder?.file('main.css', mainCssTemplate);
	styleFolder?.file('github-dark.min.css', githubDarkCssTemplate);
	styleFolder?.file('katex.min.css', katexCssTemplate);

	// Create fonts subdirectory and add all font files
	const fontsSubfolder = styleFolder?.folder('fonts');
	for (const [filename, url] of Object.entries(fontUrls)) {
		try {
			const response = await fetch(url);
			const arrayBuffer = await response.arrayBuffer();
			fontsSubfolder?.file(filename, arrayBuffer);
		} catch (error) {
			console.error(`Failed to load font ${filename}:`, error);
		}
	}

	// Generate js files
	const jsFolder = zip.folder('js');
	jsFolder?.file('script.js', scriptJsTemplate);
	jsFolder?.file('highlight.min.js', highlightJsTemplate);

	// Create languages subdirectory and add all language files
	const languagesSubfolder = jsFolder?.folder('languages');
	for (const [path, content] of Object.entries(languagesModules)) {
		const filename = path.split('/').pop() || '';
		if (filename && typeof content === 'string') {
			languagesSubfolder?.file(filename, content);
		}
	}

	// Generate pages/*.html for each conversation
	const pagesFolder = zip.folder('pages');
	const imageFilenames = imageFiles ? Object.keys(imageFiles) : [];

	conversations.forEach((conversation) => {
		const pageHtml = generateConversationPageHtml(
			pageHtmlTemplate,
			conversation,
			sidebarItems,
			imageFilenames
		);
		pagesFolder?.file(`${conversation.id}.html`, pageHtml);
	});

	// Add images if provided
	if (imageFiles && Object.keys(imageFiles).length > 0) {
		const imagesFolder = zip.folder('images');

		// Add each image file to the images folder
		for (const [filename, content] of Object.entries(imageFiles)) {
			imagesFolder?.file(filename, content);
			console.log(`Added image to zip: images/${filename}`);
		}

		console.log(`Total images added to zip: ${Object.keys(imageFiles).length}`);
	}

	// Generate zip file
	return await zip.generateAsync({ type: 'blob' });
}
