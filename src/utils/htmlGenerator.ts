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

// Import all language files
const languagesModules = import.meta.glob('@/templates/languages/**/*', {
	as: 'raw',
	eager: true,
});

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

		projects.forEach((project, index) => {
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

			// Join parts and convert markdown to HTML
			contentHtml = parseMarkdown(texts);
			break;

		case 'code':
			// Skip code content type - return empty string
			return '';

		case 'multimodal_text':
			contentHtml = '<div class="message-images">';
			content.parts.forEach((part) => {
				if (part.asset_pointer) {
					// Extract filename prefix from asset_pointer
					const filenamePrefix = part.asset_pointer.split('/').pop() || 'image';

					// Find the full filename that starts with this prefix
					const fullFilename = imageFilenames.find((name) =>
						name.startsWith(filenamePrefix)
					);

					if (fullFilename) {
						contentHtml += `<img src="../images/${fullFilename}" alt="Generated image" loading="lazy" />`;
					}
				}
			});
			contentHtml += '</div>';
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

	// Get author name (for tools)
	const authorName = role === 'tool' ? (message.author as any).name : role;
	const displayName = getDisplayName(authorName);

	return `
		<div class="message ${roleClass}">
			<div class="message-header">
				<span class="message-role">${escapeHtml(displayName)}</span>
			</div>
			<div class="message-content">
				${contentHtml}
			</div>
		</div>
	`;
}

/**
 * Get display name for message author
 */
function getDisplayName(role: string): string {
	const displayNames: { [key: string]: string } = {
		user: 'You',
		assistant: 'ChatGPT',
		system: 'System',
		tool: 'Tool',
	};
	return displayNames[role] || role;
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

	// Generate style/main.css and github-dark.min.css
	const styleFolder = zip.folder('style');
	styleFolder?.file('main.css', mainCssTemplate);
	styleFolder?.file('github-dark.min.css', githubDarkCssTemplate);

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
