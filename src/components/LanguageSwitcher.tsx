import { useTranslation } from 'react-i18next';

const LanguageSwitcher = () => {
	const { i18n } = useTranslation();

	const languages = [
		{ code: 'ko', name: '한국어' },
		{ code: 'en', name: 'English' },
	];

	const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
		i18n.changeLanguage(e.target.value);
	};

	return (
		<select
			value={i18n.language}
			onChange={handleLanguageChange}
			className="px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-200 hover:border-gray-400 dark:hover:border-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent cursor-pointer"
		>
			{languages.map((lang) => (
				<option key={lang.code} value={lang.code}>
					{lang.name}
				</option>
			))}
		</select>
	);
};

export default LanguageSwitcher;
