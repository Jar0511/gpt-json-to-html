export const SIDEBAR_KEY = 'gpt_project_names';

export const constant_steps = {
	html: ['file_upload', 'set_project_name', 'set_highlight'],
	pdf: ['file_upload', 'set_project_name', 'select_target', 'set_highlight'],
} as const;
