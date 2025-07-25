import { useTranslation } from 'react-i18next';
import { useFileUploadForm } from './hook';

export function FileUploadForm() {
	const { t } = useTranslation();
	const {
		register,
		handleSubmit,
		errors,
		isValid,
		selectedFileName,
		isDragging,
		isLoading,
		onSubmit,
		handleDragOver,
		handleDragLeave,
		handleDrop,
	} = useFileUploadForm();

	return (
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
					<p className="text-red-500 text-sm mt-2">{errors.file.message}</p>
				)}

				<button
					type="submit"
					disabled={!isValid || isLoading}
					className="w-full py-4 px-6 text-lg font-semibold text-white bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl hover:not-disabled:from-purple-700 hover:not-disabled:to-blue-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:not-disabled:shadow-xl transform hover:not-disabled:-translate-y-0.5 focus:outline-2 focus:outline-offset-2 focus:outline-black cursor-pointer relative"
				>
					{isLoading ? (
						<>
							<span className="opacity-0">{t('buttons.convert')}</span>
							<div className="absolute inset-0 flex items-center justify-center">
								<div className="w-6 h-6 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
							</div>
						</>
					) : (
						t('buttons.convert')
					)}
				</button>
			</form>
		</div>
	);
}
