import {
	Conversation,
	SidebarItem,
	isSidebarProject,
} from '@/types/conversation';
import JSZip from 'jszip';

// Import template files as strings
import indexHtmlTemplate from '@/templates/index.html?raw';
import pageHtmlTemplate from '@/templates/page.html?raw';
import mainCssTemplate from '@/templates/main.css?raw';
import scriptJsTemplate from '@/templates/script.js?raw';

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
	sidebarItems: SidebarItem[]
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

	let html = template
		.replace(/{{SIDEBAR_HTML}}/g, sidebarHtml)
		.replace(/{{CONVERSATION_TITLE}}/g, escapeHtml(title))
		.replace(/{{CONVERSATION_DATE}}/g, date)
		.replace(/{{MESSAGE_COUNT}}/g, messageCount.toString())
		.replace(
			/{{CONVERSATION_CONTENT}}/g,
			'<p>대화 내용은 나중에 구현될 예정입니다.</p>'
		);

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

	// Generate style/main.css
	zip.folder('style')?.file('main.css', mainCssTemplate);

	// Generate js/script.js
	zip.folder('js')?.file('script.js', scriptJsTemplate);

	// Generate pages/*.html for each conversation
	const pagesFolder = zip.folder('pages');
	conversations.forEach((conversation) => {
		const pageHtml = generateConversationPageHtml(
			pageHtmlTemplate,
			conversation,
			sidebarItems
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
