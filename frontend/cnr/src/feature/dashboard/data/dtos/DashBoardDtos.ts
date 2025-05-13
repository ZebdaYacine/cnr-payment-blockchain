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
