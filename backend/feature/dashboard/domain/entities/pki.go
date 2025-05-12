package entities

type UploadedFileInfo struct {
	File        int    `json:"file"`
	Version     int    `json:"version"`
	Day         string `json:"day"`
	Month       string `json:"month"`
	Year        string `json:"year"`
	Institution string `json:"institution"`
}

type UploadingFilesResponse struct {
	Jour        string `json:"jour"`
	Mois        string `json:"mois"`
	Fichiers    int    `json:"fichiers"`
	Versions    int    `json:"versions"`
	Institution string `json:"institution"`
}

type WorkerErrorRateResponse struct {
	UserID       string  `json:"user_id"`
	InvalidFiles int     `json:"invalid_files"`
	TotalFiles   int     `json:"total_files"`
	ErrorRate    float64 `json:"error_rate_pct"`
}

type HackingAttemptResponse struct {
	Phase        string            `json:"phase"`
	Version      int               `json:"version"`
	FilesNumber  int               `json:"files_number"`
	InvalidFiles int               `json:"invalid_files"`
	Folder       int               `json:"folder"`
	Institutions []string          `json:"institutions"`
	Files        []HackingFileInfo `json:"files"`
}

type HackingFileInfo struct {
	File        string `json:"file"`
	Time        string `json:"time"`
	Institution string `json:"institution"`
}
