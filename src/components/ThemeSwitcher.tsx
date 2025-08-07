import { FaMoon } from 'react-icons/fa';
import { useTheme } from '../contexts/ThemeContext';
import { IoSunny } from 'react-icons/io5';
import { useTranslation } from 'react-i18next';

const ThemeSwitcher = () => {
	const { t } = useTranslation('translation', { keyPrefix: 'menu' })
	const { theme, toggleTheme } = useTheme();

	return (
		<button
			onClick={toggleTheme}
			className="size-[2.25rem] flex items-center justify-center upper-buttons cursor-pointer focusable"
			aria-label={t('theme')}
		>
			{theme === 'light' ? (
				<FaMoon />
			) : (
				<IoSunny className='text-yellow-500 text-lg' />
			)}
		</button>
	);
};

export default ThemeSwitcher;
