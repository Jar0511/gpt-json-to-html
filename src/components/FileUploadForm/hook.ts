import { useForm } from 'react-hook-form';
import { useState, DragEvent } from 'react';
import { useTranslation } from 'react-i18next';
import JSZip from 'jszip';

interface FormData {
	file: FileList;
}

export function useFileUploadForm() {
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
	const [isLoading, setIsLoading] = useState(false);

	const file = watch('file');
	const selectedFileName = file?.[0]?.name;

	const onSubmit = async (data: FormData) => {
		if (data.file && data.file[0]) {
			const file = data.file[0];
			setIsLoading(true);

			try {
				const zip = new JSZip();
				const zipContent = await zip.loadAsync(file);

				// conversations.json 파일이 존재하는지 확인
				const conversationsFile = zipContent.file('conversations.json');

				if (!conversationsFile) {
					alert(t('errors.noConversationsJson'));
					setIsLoading(false);
					return;
				}

				// TODO: conversations.json 파일 처리 로직
				console.log('Valid zip file with conversations.json');
			} catch (error) {
				console.error('Error processing zip file:', error);
				alert(t('errors.invalidZipFile'));
			} finally {
				setIsLoading(false);
			}
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

	return {
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
	};
}
