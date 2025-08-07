import { ComponentProps } from 'react';

export const TextInput = ({
	type,
	className,
	...rest
}: ComponentProps<'input'>) => {
	return (
		<input
			type="text"
			className={`box-border text-gray-900 focusable dark:text-gray-100 rounded-sm p-1 bg-indigo-100/50 hover:bg-indigo-100/75 transition-colors dark:bg-gray-500/50 dark:hover:bg-gray-500/75 ${className ?? ''}`}
			{...rest}
		/>
	);
};
