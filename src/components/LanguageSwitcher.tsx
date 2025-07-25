import { useTranslation } from 'react-i18next';

const LanguageSwitcher = () => {
	const { i18n } = useTranslation();

	const changeLanguage = (lng: string) => {
		i18n.changeLanguage(lng);
	};

	return (
		<div className="flex gap-2">
			<button
				onClick={() => changeLanguage('ko')}
				className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
					i18n.language === 'ko'
						? 'bg-blue-600 text-white'
						: 'bg-gray-200 text-gray-700 hover:bg-gray-300'
				}`}
			>
				한국어
			</button>
			<button
				onClick={() => changeLanguage('en')}
				className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
					i18n.language === 'en'
						? 'bg-blue-600 text-white'
						: 'bg-gray-200 text-gray-700 hover:bg-gray-300'
				}`}
			>
				English
			</button>
		</div>
	);
};

export default LanguageSwitcher;
