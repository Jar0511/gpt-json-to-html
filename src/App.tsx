import { useTranslation } from 'react-i18next';
import LanguageSwitcher from './components/LanguageSwitcher';
import ThemeSwitcher from './components/ThemeSwitcher';
import GitHubLink from './components/GitHubLink';
import { FileForm } from './components/FileUploadForm';
import { useDocumentTitle } from './hooks/useDocumentTitle';
import { Analytics } from '@vercel/analytics/react';

function App() {
	const { t } = useTranslation();
	useDocumentTitle();

	return (
		<div className="flex flex-col w-screen h-screen bg-gradient-to-br from-purple-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 transition-colors overflow-hidden font-display">
			<div className="p-4 justify-end flex gap-2 z-10 flex-none">
				<GitHubLink />
				<ThemeSwitcher />
				<LanguageSwitcher />
			</div>
			<div className="flex-1 flex items-center justify-center p-4 overflow-hidden">
				<div className="size-full max-w-2xl flex flex-col">
					<div className="text-center mb-12 flex-none">
						<h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-800 dark:text-gray-100 mb-4 tracking-tight">
							{t('title')}
						</h1>
						<p className="text-base sm:text-lg md:text-xl text-gray-600 dark:text-gray-300">
							{t('subtitle')}
						</p>
					</div>
					<FileForm />
					<Analytics />
					<p className="flex-none text-center text-sm text-gray-500 dark:text-gray-400 mt-8 whitespace-pre-wrap">
						{t('footer')}
					</p>
				</div>
			</div>
		</div>
	);
}

export default App;
