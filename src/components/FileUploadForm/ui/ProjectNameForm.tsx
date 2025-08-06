import { useFormData } from '@/contexts/FormContext';
import { SidebarProject } from '@/types/conversation';
import { useEffect } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';

interface resultItem extends SidebarProject {
  // react-hook-form에서 id를 자체 생성해서 override 되므로 원본 키값 보존용
  _id: string;
}

type ProjectNames = {
  result: resultItem[];
};

export const ProjectNameForm = () => {
  const { sidebarItems } = useFormData();
  const { control, register, setValue } = useForm<ProjectNames>();
  const { fields } = useFieldArray({
    control,
    name: 'result',
  });

  useEffect(() => {
    if (sidebarItems.length > 0) {
      console.log('sidebarItems', sidebarItems);
      setValue(
        'result',
        sidebarItems
          .filter((item) => 'children' in item)
          .map((d) => ({ ...d, _id: d.id }))
      );
    }
  }, [sidebarItems]);

  return (
    <form className='overflow-auto'>
      <ul>
        {fields.map((item, index) => (
          <li key={item.id}>
            <div></div>
            <ul>{item.children.map((child) => (<li key={child.id}>{child.title}</li>))}</ul>
          </li>
        ))}
      </ul>
    </form>
  );
};
