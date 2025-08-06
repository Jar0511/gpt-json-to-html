import { ComponentProps } from 'react';

export const SubmitButton = ({
	disabled,
	children,
	type,
	className,
	...rest
}: ComponentProps<'button'>) => {
	return (
		<button
			type="submit"
			disabled={disabled}
			className={`w-full py-4 px-6 text-lg font-semibold text-white bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl hover:not-disabled:from-purple-700 hover:not-disabled:to-blue-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:not-disabled:shadow-xl transform hover:not-disabled:-translate-y-0.5 focus:outline-2 focus:outline-offset-2 focus:outline-black cursor-pointer relative ${className ?? ''}`}
			{...rest}
		>
			{children}
		</button>
	);
};
