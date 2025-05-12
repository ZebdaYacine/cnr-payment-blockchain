interface UploadedFileInfo {
  file: number;
  version: number;
  day: string;
  month: string;
  year: string;
  institution: string;
}

export interface PKI1Response {
  message: string;
  data: UploadedFileInfo[];
}
