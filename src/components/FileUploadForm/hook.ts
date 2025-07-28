import { useForm } from 'react-hook-form';
import { useState, DragEvent } from 'react';
import { useTranslation } from 'react-i18next';
import JSZip from 'jszip';
import { processConversations } from '@/utils/conversationProcessor';
import { generateSidebarHTML } from '@/utils/htmlGenerator';

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
	const [loadingStep, setLoadingStep] = useState<string | null>(null);

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

				// 사이드바 HTML 생성
				const sidebarHTMLForIndex = generateSidebarHTML(sidebarItems, true); // index.html용
				const sidebarHTMLForPages = generateSidebarHTML(sidebarItems, false); // pages/*.html용

				console.log('Sidebar HTML generated for index and pages');

				// TODO: 생성된 HTML을 zip 파일로 패키징
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
		isLoading: !!loadingStep,
		loadingStep,
		onSubmit,
		handleDragOver,
		handleDragLeave,
		handleDrop,
	};
}
