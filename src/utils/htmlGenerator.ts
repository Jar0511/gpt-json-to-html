import { SidebarItem, isSidebarProject } from './conversationProcessor';

/**
 * 사이드바 HTML 생성
 * @param sidebarItems 사이드바 아이템 배열
 * @param isIndexPage index.html 페이지인지 여부 (경로 결정용)
 * @returns 생성된 HTML 문자열
 */
export function generateSidebarHTML(sidebarItems: SidebarItem[], isIndexPage: boolean = true): string {
	const pathPrefix = isIndexPage ? 'pages/' : '';
	
	// 프로젝트와 일반 대화 분리
	const projects = sidebarItems.filter(item => isSidebarProject(item));
	const regularItems = sidebarItems.filter(item => !isSidebarProject(item));
	
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
				
				project.children.forEach(child => {
					html += '\t\t\t\t<li class="child-item">\n';
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
		
		regularItems.forEach(item => {
			if (!isSidebarProject(item)) {
				html += '\t<li class="conversation-item">\n';
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
		.replace(/&/g, "&amp;")
		.replace(/</g, "&lt;")
		.replace(/>/g, "&gt;")
		.replace(/"/g, "&quot;")
		.replace(/'/g, "&#039;");
}

/**
 * CSS-only 드롭다운을 위한 추가 스타일
 * main.css에 추가해야 할 스타일
 */
export const dropdownStyles = `
/* 섹션 헤더 스타일 */
.section-header {
	padding: 10px 20px;
	font-weight: 600;
	color: #666;
	font-size: 0.875rem;
	text-transform: uppercase;
	letter-spacing: 0.05em;
	border-bottom: 1px solid #f0f0f0;
}

/* 프로젝트 아이템 스타일 */
.project-item details {
	width: 100%;
}

.project-item summary {
	display: block;
	padding: 15px 20px;
	cursor: pointer;
	user-select: none;
	font-weight: 500;
	color: #1a1a1a;
	transition: background-color 0.2s;
	list-style: none;
}

.project-item summary::-webkit-details-marker {
	display: none;
}

.project-item summary::before {
	content: '▶';
	display: inline-block;
	margin-right: 8px;
	font-size: 0.75em;
	transition: transform 0.2s;
}

.project-item details[open] summary::before {
	transform: rotate(90deg);
}

.project-item summary:hover {
	background-color: #f0f7ff;
}

/* 프로젝트 하위 아이템 스타일 */
.project-children {
	list-style: none;
	padding: 0;
	margin: 0;
	background-color: #f8f9fa;
}

.child-item {
	border-left: 20px solid transparent;
}

.child-item a {
	display: block;
	padding: 12px 20px;
	color: #333;
	text-decoration: none;
	font-size: 0.925rem;
	transition: background-color 0.2s;
}

.child-item a:hover {
	background-color: #e8f4ff;
}

/* 일반 대화 아이템 스타일 유지 */
.conversation-item:not(.project-item) a {
	display: block;
	padding: 15px 20px;
	text-decoration: none;
	color: #333;
	transition: background-color 0.2s;
}

.conversation-item:not(.project-item):hover a {
	background-color: #f0f7ff;
}
`;