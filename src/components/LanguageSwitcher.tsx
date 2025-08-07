import { useTranslation } from 'react-i18next';

const LanguageSwitcher = () => {
	const { i18n, t } = useTranslation('translation', { keyPrefix: 'menu' });

	const languages = [
		{ code: 'ko', name: '한국어' },
		{ code: 'en', name: 'English' },
	];

	const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
		i18n.changeLanguage(e.target.value);
	};

	return (
		<select
			aria-label={t('lang')}
			value={i18n.language}
			onChange={handleLanguageChange}
			className="px-3 py-2 upper-buttons text-sm font-medium focusable cursor-pointer"
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
