import { SubmitButton } from '@/components/Buttons';
import { TextInput } from '@/components/Form';
import { useFormData } from '@/contexts/FormContext';
import { SidebarProject } from '@/types/conversation';
import { PropsWithChildren, useEffect, useState } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import { LuFolder, LuFolderOpen } from 'react-icons/lu';
import { SIDEBAR_KEY } from '../constant';
import { BiChevronsDown } from 'react-icons/bi';

type ChildrenListProps = PropsWithChildren<{
	list: Pick<SidebarProject, 'children'>['children'];
}>;

const ChildrenList = ({ children, list }: ChildrenListProps) => {
	const [show, setShow] = useState(true);
	const [showAll, setShowAll] = useState(false);

	useEffect(() => {
		if (!show) {
			setShowAll(false);
		}
	}, [show]);

	return (
		<div>
			<div className="flex items-start">
				<button
					type="button"
					className="focusable rounded flex-none p-2 cursor-pointer flex items-center justify-center hoverable text-gray-700 dark:text-gray-200"
					onClick={() => setShow((prev) => !prev)}
				>
					{show ? <LuFolderOpen /> : <LuFolder />}
				</button>
				<div className="flex-1 flex flex-col">
					{children}
					{show && (
						<ul className="pl-2 text-sm flex flex-col gap-1 list-disc list-inside text-gray-600 dark:text-gray-300">
							{list.map((child, index) => {
								if (showAll || index < 3)
									return <li key={child.id}>{child.title}</li>;
							})}
							{!showAll && list.length > 3 && (
								<li className="list-none">
									<button
										type="button"
										onClick={() => setShowAll(true)}
										className="focusable rounded flex items-center justify-center gap-1 p-1 w-full hoverable cursor-pointer text-gray-700 dark:text-gray-200"
									>
										<BiChevronsDown />
										{list.length - 3}개의 대화 제목 더보기
									</button>
								</li>
							)}
						</ul>
					)}
				</div>
			</div>
		</div>
	);
};

interface resultItem extends SidebarProject {
	// react-hook-form에서 id를 자체 생성하기 때문에 원본 키값 보존용
	_id: string;
}

type ProjectNames = {
	result: resultItem[];
};

export const ProjectNameForm = () => {
	const { sidebarItems, setSidebarItems } = useFormData();
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

	return (
		<form
			className="flex flex-col overflow-hidden size-full gap-4"
			onSubmit={handleSubmit(submit)}
		>
			<h2 className="text-gray-800 dark:text-gray-100">프로젝트 이름 편집</h2>
			<ul className="flex-1 overflow-auto">
				{fields.map((item, index) => (
					<li key={item.id}>
						<ChildrenList list={item.children}>
							<TextInput
								{...register(`result.${index}.title`)}
								className="font-semibold px-2"
							/>
						</ChildrenList>
					</li>
				))}
			</ul>
			<SubmitButton className="flex-none">저장</SubmitButton>
		</form>
	);
};
