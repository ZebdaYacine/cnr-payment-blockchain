export interface UploadedFileRecord {
  file_name: string;
  parent?: string;
  version: string;
  organisation: string;
  time: string; // ISO 8601
}

export interface InstitutionStats {
  name: string;
  file: number;
  version: number;
}

export interface UploadStats {
  file: number;
  version: number;
  day: string;
  month: string;
  year: string;
  institutions: InstitutionStats[];
}

export interface PKI1Response {
  message: string;
  data: UploadStats[];
}

export interface HackingFileInfo {
  file: string;
  time: string;
  institution: string;
}

export interface HackingAttemptResponse {
  phase: string;
  version: number;
  files_number: number;
  invalid_files: number;
  folder: number;
  institutions: string[];
  files: HackingFileInfo[];
}

export interface HackingTryPKIResponse {
  message: string;
  data: HackingAttemptResponse[];
}
