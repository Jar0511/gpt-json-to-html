import { FormDataProvider, useFormData } from '@/contexts/FormContext';
import { FileUploadForm } from './FileUploadForm';

const FormSwitch = () => {
	const { step } = useFormData();

	if (step === 'file_upload') {
		return <FileUploadForm />;
	} else return null;
};

export const FileForm = () => {
	return (
		<FormDataProvider>
			<div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
				<FormSwitch />
			</div>
		</FormDataProvider>
	);
};
