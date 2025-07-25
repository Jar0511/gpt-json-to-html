import { useTranslation } from 'react-i18next';
import LanguageSwitcher from './components/LanguageSwitcher';
import ThemeSwitcher from './components/ThemeSwitcher';
import { FileUploadForm } from './components/FileUploadForm';

function App() {
	const { t } = useTranslation();

	return (
		<div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 p-4 transition-colors">
			<div className="absolute top-4 right-4 flex gap-2">
				<ThemeSwitcher />
				<LanguageSwitcher />
			</div>
			<div className="flex items-center justify-center min-h-screen">
				<div className="w-full max-w-2xl">
					<div className="text-center mb-12">
						<h1 className="text-5xl font-bold text-gray-800 dark:text-gray-100 mb-4 tracking-tight">
							{t('title')}
						</h1>
						<p className="text-xl text-gray-600 dark:text-gray-300">
							{t('subtitle')}
						</p>
					</div>

					<FileUploadForm />

					<p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-8">
						{t('footer')}
					</p>
				</div>
			</div>
		</div>
	);
}

export default App;
