import { useFormData } from '@/contexts/FormContext';
import { SidebarProject } from '@/types/conversation';
import { useFieldArray, useForm } from 'react-hook-form';
import { SIDEBAR_KEY } from '../constant';
import { useEffect } from 'react';

interface resultItem extends SidebarProject {
	// react-hook-form에서 id를 자체 생성하기 때문에 원본 키값 보존용
	_id: string;
}

type ProjectNames = {
	result: resultItem[];
};

export const useProjectNameForm = () => {
	const { sidebarItems, setSidebarItems, setStep } = useFormData();
	const { control, register, setValue, handleSubmit } = useForm<ProjectNames>();
	const { fields } = useFieldArray({
		control,
		name: 'result',
	});

	const submit = ({ result }: ProjectNames) => {
		const _result = result.filter((item) => !!item.title.trim());
		if (_result.length > 0) {
			const stored = localStorage.getItem(SIDEBAR_KEY);
			const prev = stored ? JSON.parse(stored) : {};
			let update = { ...prev };
			_result.forEach((item) => {
				update[item._id] = item.title.trim();
			});

			localStorage.setItem(SIDEBAR_KEY, JSON.stringify(update));
			setSidebarItems((prev) =>
				prev.map((si) => {
					if ('children' in si) {
						const title = update[si.id] || '';
						if (!!title) {
							return { ...si, title };
						} else return si;
					} else return si;
				})
			);
		}
		setStep('select_target');
	};

	useEffect(() => {
		if (sidebarItems.length > 0) {
			setValue(
				'result',
				sidebarItems
					.filter((item) => 'children' in item)
					.map((d) => ({ ...d, _id: d.id }))
			);
		}
	}, [sidebarItems]);

	return {
		submit: handleSubmit(submit),
		fields,
		register,
	};
};
