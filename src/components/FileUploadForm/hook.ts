import { useForm } from 'react-hook-form';
import { useState, DragEvent } from 'react';
import { useTranslation } from 'react-i18next';

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

	return {
		register,
		handleSubmit,
		errors,
		isValid,
		selectedFileName,
		isDragging,
		onSubmit,
		handleDragOver,
		handleDragLeave,
		handleDrop,
	};
}
