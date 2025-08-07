import { useTranslation } from 'react-i18next';
import { useFileUploadForm } from '../hook';
import { SubmitButton } from '@/components/Buttons';
import { MdFolderZip } from 'react-icons/md';

export function FileUploadForm() {
	const { t } = useTranslation('translation', { keyPrefix: 'fileUpload' });
	const {
		register,
		handleSubmit,
		errors,
		isDirty,
		selectedFileName,
		isDragging,
		isLoading,
		loadingStep,
		onSubmit,
		handleDragOver,
		handleDragLeave,
		handleDrop,
		handleKey,
		fileInputRef,
	} = useFileUploadForm();

	return (
		<form onSubmit={handleSubmit(onSubmit)} className="space-y-6 flex flex-col h-full">
			<label
				htmlFor="file-upload"
				className={`flex-1 flex flex-col gap-2 items-center justify-center border-2 group border-dashed rounded-xl p-8 text-center transition-colors cursor-pointer focusable ${isDragging
					? 'border-purple-500 bg-purple-50 dark:bg-indigo-900/20'
					: 'border-gray-300 dark:border-gray-600 hover:border-purple-400 dark:hover:border-indigo-500'
					}`}
				onDragOver={handleDragOver}
				onDragLeave={handleDragLeave}
				onDrop={handleDrop}
				onKeyDown={handleKey}
				tabIndex={0}
			>
				<div className='flex-none flex justify-center items-center'>
					<MdFolderZip className='text-gray-300 group-hover:text-purple-300 transition-colors dark:text-gray-500 dark:group-hover:text-indigo-500 text-6xl' />
				</div>
				<span className="text-lg font-medium text-gray-700 dark:text-gray-200 block">
					{selectedFileName ?
						<>
							<span className='sr-only'>{t("selected")}</span>
							{selectedFileName}
						</> :
						t('chooseFile')
					}
				</span>
				<span className="text-sm text-gray-500 dark:text-gray-400">
					{isDragging ? t('dropHere') : t('instructions')}
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
					ref={(e) => {
						register('file').ref(e);
						fileInputRef.current = e;
					}}
					id="file-upload"
					type="file"
					accept=".zip"
					className="sr-only"
					tabIndex={-1}
				/>
			</label>

			{errors.file && (
				<p className="text-red-500 text-sm mt-2">{errors.file.message}</p>
			)}

			<SubmitButton disabled={!isDirty || isLoading}>
				{isLoading ? (
					<>
						<p className="opacity-0">{t('convert')}</p>
						<div className="absolute inset-0 flex items-center justify-center gap-2">
							{loadingStep && <span className="text-sm">{loadingStep}</span>}
							<div className="w-6 h-6 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
						</div>
					</>
				) : (
					t('convert')
				)}
			</SubmitButton>
		</form>
	);
}
