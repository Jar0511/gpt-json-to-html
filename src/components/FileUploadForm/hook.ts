import { useForm } from 'react-hook-form';
import { useState, DragEvent, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import JSZip from 'jszip';
import { processConversations } from '@/utils/conversationProcessor';
import { generateHtmlExport } from '@/utils/htmlGenerator';

interface FormData {
	file: FileList;
}

export function useFileUploadForm() {
	const { t } = useTranslation();
	const {
		register,
		handleSubmit,
		watch,
		formState: { errors, isDirty },
	} = useForm<FormData>({
		mode: 'onChange',
	});

	const [isDragging, setIsDragging] = useState(false);
	const [loadingStep, setLoadingStep] = useState<string | null>(null);
	const fileInputRef = useRef<HTMLInputElement | null>(null);

	const file = watch('file');
	const selectedFileName = file?.[0]?.name;

	const onSubmit = async (data: FormData) => {
		if (data.file && data.file[0]) {
			const file = data.file[0];
			try {
				// ZIP 파일 로드
				setLoadingStep(t('loading.openingZip'));
				const zip = new JSZip();
				const zipContent = await zip.loadAsync(file);

				// conversations.json 파일이 존재하는지 확인
				setLoadingStep(t('loading.searchingFile'));
				const conversationsFile = zipContent.file('conversations.json');

				if (!conversationsFile) {
					alert(t('errors.noConversationsJson'));
					setLoadingStep(null);
					return;
				}

				// conversations.json 파일을 텍스트로 읽기
				setLoadingStep(t('loading.readingFile'));
				const jsonContent = await conversationsFile.async('text');

				// JSON 파싱
				setLoadingStep(t('loading.parsingJson'));
				let conversations;
				try {
					conversations = JSON.parse(jsonContent);
				} catch (parseError) {
					console.error('Error parsing JSON:', parseError);
					alert(t('errors.invalidJsonFormat'));
					return;
				}

				// 파싱 결과가 배열인지 확인
				if (!Array.isArray(conversations)) {
					console.error('Conversations data is not an array');
					alert(t('errors.conversationsNotArray'));
					return;
				}

				// conversations 처리
				setLoadingStep(t('loading.processingConversations'));
				const {
					conversations: sortedConversations,
					regularConversations,
					groupedConversations,
					sidebarItems,
				} = processConversations(conversations);

				console.log('Regular conversations:', regularConversations.length);
				console.log(
					'Grouped conversations:',
					groupedConversations.length,
					'groups'
				);
				console.log('Sidebar items created:', sidebarItems.length);

				// HTML 생성 및 ZIP 패키징
				setLoadingStep(t('loading.generatingHtml'));
				const htmlZipBlob = await generateHtmlExport(
					sortedConversations,
					sidebarItems
				);

				// 다운로드 트리거
				const downloadLink = document.createElement('a');
				downloadLink.href = URL.createObjectURL(htmlZipBlob);
				downloadLink.download = 'chatgpt-conversations.zip';
				document.body.appendChild(downloadLink);
				downloadLink.click();
				document.body.removeChild(downloadLink);
				URL.revokeObjectURL(downloadLink.href);

				console.log('HTML export completed and download triggered');
			} catch (error) {
				console.error('Error processing zip file:', error);
				alert(t('errors.invalidZipFile'));
			} finally {
				setLoadingStep(null);
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

	const handleDrop = async (e: DragEvent<HTMLLabelElement>) => {
		e.preventDefault();
		setIsDragging(false);

		const files = e.dataTransfer.files;
		if (files && files.length > 0 && files[0].name.endsWith('.zip')) {
			// Create a new DataTransfer to set files on the input
			if (fileInputRef.current) {
				const dataTransfer = new DataTransfer();
				for (let i = 0; i < files.length; i++) {
					dataTransfer.items.add(files[i]);
				}
				fileInputRef.current.files = dataTransfer.files;

				// Trigger change event to update form state
				const event = new Event('change', { bubbles: true });
				fileInputRef.current.dispatchEvent(event);
			}
		}
	};

	return {
		register,
		handleSubmit,
		errors,
		isDirty,
		selectedFileName,
		isDragging,
		isLoading: !!loadingStep,
		loadingStep,
		onSubmit,
		handleDragOver,
		handleDragLeave,
		handleDrop,
		fileInputRef,
	};
}
