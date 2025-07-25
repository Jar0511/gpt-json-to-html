import { useForm } from 'react-hook-form';
import { useState, DragEvent } from 'react';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from './components/LanguageSwitcher';
import ThemeSwitcher from './components/ThemeSwitcher';

interface FormData {
	file: FileList;
}

function App() {
	const { t } = useTranslation();
	const {
		register,
		handleSubmit,
		watch,
		setValue,
		formState: { isValid, errors },
	} = useForm<FormData>({
		mode: 'onChange',
	});

	const [isDragging, setIsDragging] = useState(false);

	const file = watch('file');
	const selectedFileName = file?.[0]?.name;

	const onSubmit = (data: FormData) => {
		if (data.file && data.file[0]) {
			// TODO: 파일 처리 로직
			console.log('Selected file:', data.file[0]);
		}
	};

	const handleDragOver = (e: DragEvent<HTMLLabelElement>) => {
		e.preventDefault();
		setIsDragging(true);
	};

	const handleDragLeave = (e: DragEvent<HTMLLabelElement>) => {
		e.preventDefault();
		setIsDragging(false);
	};

	const handleDrop = (e: DragEvent<HTMLLabelElement>) => {
		e.preventDefault();
		setIsDragging(false);

		const files = e.dataTransfer.files;
		if (files && files.length > 0 && files[0].name.endsWith('.zip')) {
			setValue('file', files, { shouldValidate: true });
		}
	};

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
						<p className="text-xl text-gray-600 dark:text-gray-300">{t('subtitle')}</p>
					</div>

					<div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
						<form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
							<label
								htmlFor="file-upload"
								className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors cursor-pointer block focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-black ${
									isDragging
										? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20'
										: 'border-gray-300 dark:border-gray-600 hover:border-purple-400 dark:hover:border-purple-500'
								}`}
								onDragOver={handleDragOver}
								onDragLeave={handleDragLeave}
								onDrop={handleDrop}
							>
								<svg
									className="mx-auto h-16 w-16 text-gray-400 dark:text-gray-500 mb-4"
									stroke="currentColor"
									fill="none"
									viewBox="0 0 24 24"
									aria-hidden="true"
								>
									<path
										d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
										strokeWidth={1}
										strokeLinecap="round"
										strokeLinejoin="round"
									/>
									<path
										d="M12 11v4M10 13h4"
										strokeWidth={1}
										strokeLinecap="round"
										strokeLinejoin="round"
									/>
								</svg>
								<div>
									<span className="text-lg font-medium text-gray-700 dark:text-gray-200 block mb-2">
										{selectedFileName || t('fileUpload.chooseFile')}
									</span>
									<span className="text-sm text-gray-500 dark:text-gray-400">
										{isDragging
											? t('fileUpload.dropHere')
											: t('fileUpload.instructions')}
									</span>
									<input
										{...register('file', {
											required: true,
											validate: {
												isZip: (files) => {
													if (!files || files.length === 0) return false;
													return (
														files[0].name.toLowerCase().endsWith('.zip') ||
														t('errors.selectZipFile')
													);
												},
											},
										})}
										id="file-upload"
										type="file"
										accept=".zip"
										className="sr-only"
									/>
								</div>
							</label>

							{errors.file && (
								<p className="text-red-500 text-sm mt-2">
									{errors.file.message}
								</p>
							)}

							<button
								type="submit"
								disabled={!isValid}
								className="w-full py-4 px-6 text-lg font-semibold text-white bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl hover:from-purple-700 hover:to-blue-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 focus:outline-2 focus:outline-offset-2 focus:outline-black"
							>
								{t('buttons.convert')}
							</button>
						</form>
					</div>

					<p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-8">
						{t('footer')}
					</p>
				</div>
			</div>
		</div>
	);
}

export default App;
