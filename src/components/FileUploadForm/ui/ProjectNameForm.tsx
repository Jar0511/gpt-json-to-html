import { SubmitButton } from '@/components/Buttons';
import { TextInput } from '@/components/Form';
import { SidebarProject } from '@/types/conversation';
import { PropsWithChildren, useEffect, useState } from 'react';
import { LuFolder, LuFolderOpen } from 'react-icons/lu';
import { BiChevronsDown } from 'react-icons/bi';
import { useProjectNameForm } from '../hook/useProjectNameForm';

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

export const ProjectNameForm = () => {
	const { submit, fields, register } = useProjectNameForm();

	return (
		<form
			className="flex flex-col overflow-hidden size-full gap-4"
			onSubmit={submit}
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
