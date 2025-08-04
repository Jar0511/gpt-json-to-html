import { constant_steps } from "@/components/FileUploadForm";
import { Conversation, SidebarItem } from "@/types/conversation";
import { createContext, Dispatch, PropsWithChildren, SetStateAction, useContext, useState } from "react";

type imageFileType = {
  [filename: string]: ArrayBuffer;
};

type stepType = (typeof constant_steps)[keyof typeof constant_steps][number];

interface FormDataContextType {
  /** 대화 원본 */
  conversations: Conversation[];
  setConversations: Dispatch<SetStateAction<Conversation[]>>;
  /** 사이드바 */
  sidebarItems: SidebarItem[];
  setSidebarItems: Dispatch<SetStateAction<SidebarItem[]>>;
  /** 이미지 파일 맵 */
  imageFiles: imageFileType;
  setImageFiles: Dispatch<SetStateAction<imageFileType>>;
  /** 사용할 코드 블록 테마 */
  codeTheme: string;
  setCodeTheme: Dispatch<SetStateAction<string>>;
  /** 현 단계 */
  step: stepType;
  setStep: Dispatch<SetStateAction<stepType>>;
}

const FormDataContext = createContext<FormDataContextType | undefined>(undefined)

export const FormDataProvider = ({ children }: PropsWithChildren) => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [sidebarItems, setSidebarItems] = useState<SidebarItem[]>([]);
  const [imageFiles, setImageFiles] = useState<imageFileType>({});
  const [codeTheme, setCodeTheme] = useState("Github Dark");
  const [step, setStep] = useState<stepType>('file_upload');

  return (
    <FormDataContext.Provider
      value={{
        conversations,
        setConversations,
        sidebarItems,
        setSidebarItems,
        imageFiles,
        setImageFiles,
        codeTheme,
        setCodeTheme,
        step,
        setStep,
      }}
    >
      {children}
    </FormDataContext.Provider>
  )
}

export const useFormData = () => {
  const context = useContext(FormDataContext);
  if (context === undefined) {
    throw new Error('useFormData must be used within a FormDataProvider')
  }
  return context;
}