import apiClient from "./apiClient";

type DocumentType = "national_id" | "passport" | "drivers_license";

interface KYCUploadParams {
  documentType: DocumentType;
  frontFile: File;
  backFile: File;
  selfieFile: File;
}

export const KYCUpload = async ({
  documentType,
  frontFile,
  backFile,
  selfieFile,
}: KYCUploadParams) => {
  const formData = new FormData();

  formData.append("document_type", documentType);

  formData.append("document_front", frontFile);

  formData.append("document_back", backFile);

  formData.append("selfie", selfieFile);
  console.log(formData);

  const { data } = await apiClient.post("/kyc/submit", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  return data;
};

export const getKycStatus = async () => {
  const { data } = await apiClient.get("/kyc/status");

  return data.data;
};
