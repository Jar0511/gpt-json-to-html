/**
 * Browser-compatible markdown to HTML parser
 * Converts markdown text to HTML without external dependencies
 */

import katex from 'katex';

/**
 * Escape HTML special characters
 */
function escapeHtml(text: string): string {
	return text
		.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
		.replace(/"/g, '&quot;')
		.replace(/'/g, '&#039;');
}

/**
 * Convert markdown to HTML
 * @param markdown The markdown text to convert
 * @returns HTML string
 */
export function parseMarkdown(markdown: string): string {
	if (!markdown) return '';

	let html = markdown;

	// First, handle code blocks (to prevent other parsing inside them)
	const codeBlocks: { placeholder: string; content: string }[] = [];
	let codeBlockIndex = 0;

	// LaTeX blocks first (to prevent other parsing inside them)
	const latexBlocks: { placeholder: string; content: string }[] = [];
	let latexBlockIndex = 0;

	// Display math blocks \[...\]
	html = html.replace(/\\\[([\s\S]*?)\\\]/g, (_, math) => {
		const placeholder = `%%LATEX%BLOCK%${latexBlockIndex++}%%`;
		try {
			const rendered = katex.renderToString(math.trim(), {
				displayMode: true,
				throwOnError: false,
			});
			latexBlocks.push({
				placeholder,
				content: `<div class="katex-display">${rendered}</div>`,
			});
		} catch (e) {
			latexBlocks.push({
				placeholder,
				content: `<div class="katex-error">LaTeX Error: ${escapeHtml(math)}</div>`,
			});
		}
		return placeholder;
	});

	// Inline math $...$
	html = html.replace(/\$([^\$\n]+)\$/g, (_, math) => {
		const placeholder = `%%LATEX%INLINE%${latexBlockIndex++}%%`;
		try {
			const rendered = katex.renderToString(math, {
				displayMode: false,
				throwOnError: false,
			});
			latexBlocks.push({
				placeholder,
				content: rendered,
			});
		} catch (e) {
			latexBlocks.push({
				placeholder,
				content: `<span class="katex-error">$${escapeHtml(math)}$</span>`,
			});
		}
		return placeholder;
	});

	// Inline math \(...\)
	html = html.replace(/\\\(([^\n]*?)\\\)/g, (_, math) => {
		const placeholder = `%%LATEX%INLINE%${latexBlockIndex++}%%`;
		try {
			const rendered = katex.renderToString(math, {
				displayMode: false,
				throwOnError: false,
			});
			latexBlocks.push({
				placeholder,
				content: rendered,
			});
		} catch (e) {
			latexBlocks.push({
				placeholder,
				content: `<span class="katex-error">\\(${escapeHtml(math)}\\)</span>`,
			});
		}
		return placeholder;
	});

	// Fenced code blocks (```)
	html = html.replace(/```(\w*)\n([\s\S]*?)```/g, (_, lang, code) => {
		const placeholder = `%%CODE%BLOCK%${codeBlockIndex++}%%`;
		codeBlocks.push({
			placeholder,
			content: `<pre><code class="language-${lang || 'plain'}">${escapeHtml(code.trim())}</code></pre>`,
		});
		return placeholder;
	});

	// Inline code - use placeholders to protect from escaping
	const inlineCodes: { placeholder: string; content: string }[] = [];
	let inlineCodeIndex = 0;

	html = html.replace(/`([^`]+)`/g, (_, code) => {
		const placeholder = `%%INLINE%CODE%${inlineCodeIndex++}%%`;
		inlineCodes.push({
			placeholder,
			content: `<code>${escapeHtml(code)}</code>`,
		});
		return placeholder;
	});

	// Escape HTML in the remaining text
	html = escapeHtml(html);

	// Headers
	html = html.replace(/^#{6}\s+(.+)$/gm, '<h6>$1</h6>');
	html = html.replace(/^#{5}\s+(.+)$/gm, '<h5>$1</h5>');
	html = html.replace(/^#{4}\s+(.+)$/gm, '<h4>$1</h4>');
	html = html.replace(/^#{3}\s+(.+)$/gm, '<h3>$1</h3>');
	html = html.replace(/^#{2}\s+(.+)$/gm, '<h2>$1</h2>');
	html = html.replace(/^#{1}\s+(.+)$/gm, '<h1>$1</h1>');

	// Bold and Italic
	html = html.replace(/\*\*\*([^*]+)\*\*\*/g, '<strong><em>$1</em></strong>');
	html = html.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
	html = html.replace(/__([^_]+)__/g, '<strong>$1</strong>');
	html = html.replace(/\*([^*]+)\*/g, '<em>$1</em>');
	html = html.replace(/_([^_]+)_/g, '<em>$1</em>');

	// Images - process before links to avoid conflicts
	html = html.replace(
		/!\[([^\]]*)\]\(([^)]+)\)/g,
		'<img src="$2" alt="$1" loading="lazy" />'
	);

	// Links
	html = html.replace(
		/\[([^\]]+)\]\(([^)]+)\)/g,
		'<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>'
	);

	// Unordered lists
	html = html.replace(/^\* (.+)$/gm, '<li>$1</li>');
	html = html.replace(/^\- (.+)$/gm, '<li>$1</li>');
	html = html.replace(/^\+ (.+)$/gm, '<li>$1</li>');

	// Ordered lists
	html = html.replace(/^\d+\. (.+)$/gm, '<li>$1</li>');

	// Wrap consecutive list items in ul/ol tags
	html = html.replace(/(<li>.*<\/li>\n?)+/g, (match) => {
		// Check if it's an ordered list
		if (/^\d+\./.test(match)) {
			return `<ol>${match}</ol>`;
		}
		return `<ul>${match}</ul>`;
	});

	// Blockquotes
	html = html.replace(/^&gt; (.+)$/gm, '<blockquote>$1</blockquote>');

	// Horizontal rules
	html = html.replace(/^---$/gm, '<hr>');
	html = html.replace(/^\*\*\*$/gm, '<hr>');

	// Tables
	const tableRegex = /^(\|.*\|)(\n\|[-:\s|]+\|)?(\n\|.*\|)*$/gm;
	html = html.replace(tableRegex, (match) => {
		const lines = match.trim().split('\n');
		if (lines.length < 2) return match;

		let tableHtml = '<table>';
		let isHeader = true;

		for (let i = 0; i < lines.length; i++) {
			const line = lines[i];

			// Skip separator line (contains only -, :, |, and spaces)
			if (/^\|[-:\s|]+\|$/.test(line)) {
				continue;
			}

			// Parse cells
			const cells = line
				.split('|')
				.filter((_, index) => index > 0 && index < line.split('|').length - 1)
				.map((cell) => cell.trim());

			if (cells.length === 0) continue;

			if (isHeader) {
				tableHtml += '<thead><tr>';
				cells.forEach((cell) => {
					tableHtml += `<th>${cell}</th>`;
				});
				tableHtml += '</tr></thead>';
				isHeader = false;

				// Start tbody after header
				if (i < lines.length - 1) {
					tableHtml += '<tbody>';
				}
			} else {
				tableHtml += '<tr>';
				cells.forEach((cell) => {
					tableHtml += `<td>${cell}</td>`;
				});
				tableHtml += '</tr>';
			}
		}

		// Close tbody if it was opened
		if (!isHeader && lines.length > 2) {
			tableHtml += '</tbody>';
		}

		tableHtml += '</table>';
		return tableHtml;
	});

	// Line breaks and paragraphs
	const lines = html.split('\n');
	const processedLines: string[] = [];
	let inParagraph = false;

	for (let i = 0; i < lines.length; i++) {
		const line = lines[i].trim();
		const isBlockElement =
			line.startsWith('<h') ||
			line.startsWith('<ul') ||
			line.startsWith('<ol') ||
			line.startsWith('<li') ||
			line.startsWith('<blockquote') ||
			line.startsWith('<pre') ||
			line.startsWith('<hr') ||
			line.includes('__CODE_BLOCK_');

		if (line === '') {
			if (inParagraph) {
				processedLines.push('</p>');
				inParagraph = false;
			}
			continue;
		}

		if (isBlockElement) {
			if (inParagraph) {
				processedLines.push('</p>');
				inParagraph = false;
			}
			processedLines.push(line);
		} else {
			if (!inParagraph) {
				processedLines.push('<p>');
				inParagraph = true;
			}
			processedLines.push(line);
		}
	}

	if (inParagraph) {
		processedLines.push('</p>');
	}

	html = processedLines.join('\n');

	// Restore LaTeX blocks first
	latexBlocks.forEach(({ placeholder, content }) => {
		html = html.replace(placeholder, content);
	});

	// Restore code blocks
	codeBlocks.forEach(({ placeholder, content }) => {
		html = html.replace(placeholder, content);
	});

	// Restore inline codes
	inlineCodes.forEach(({ placeholder, content }) => {
		html = html.replace(placeholder, content);
	});

	// Clean up
	html = html.replace(/<p>\s*<\/p>/g, '');
	html = html.replace(/\n{3,}/g, '\n\n');

	return html;
}

/**
 * Parse markdown with additional options
 * @param markdown The markdown text
 * @param options Parsing options
 * @returns HTML string
 */
export function parseMarkdownWithOptions(
	markdown: string,
	options: {
		sanitize?: boolean;
		linkTarget?: '_blank' | '_self';
		codeHighlight?: boolean;
	} = {}
): string {
	const { linkTarget = '_blank', codeHighlight = false } = options;

	let html = parseMarkdown(markdown);

	// Apply link target
	if (linkTarget === '_self') {
		html = html.replace(/target="_blank"/g, 'target="_self"');
	}

	// Add code highlighting classes if needed
	if (codeHighlight) {
		html = html.replace(
			/<code class="language-(\w+)">/g,
			'<code class="language-$1 hljs">'
		);
	}

	return html;
}
