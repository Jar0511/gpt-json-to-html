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
			className="px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent cursor-pointer"
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
