import { FormDataProvider, useFormData } from "@/contexts/FormContext"
import { FileUploadForm } from "./FileUploadForm";

const FormSwitch = () => {
  const { step } = useFormData();

  if (step === "file_upload") {
    return (
      <FileUploadForm />
    )
  }
  else return null
}

export const FileForm = () => {
  return (
    <FormDataProvider>
      <FormSwitch />
    </FormDataProvider>
  )
}