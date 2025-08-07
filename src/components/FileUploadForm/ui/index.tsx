import { FormDataProvider, useFormData } from '@/contexts/FormContext';
import { FileUploadForm } from './FileUploadForm';
import { ProjectNameForm } from './ProjectNameForm';

const FormSwitch = () => {
	const { step } = useFormData();

	if (step === 'file_upload') {
		return <FileUploadForm />;
	} else if (step === 'set_project_name') {
		return <ProjectNameForm />;
	} else return null;
};

export const FileForm = () => {
	return (
		<FormDataProvider>
			<div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-4 sm:p-8 flex-1 overflow-auto">
				<FormSwitch />
			</div>
		</FormDataProvider>
	);
};
