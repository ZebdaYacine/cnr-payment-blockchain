// Storage keys for local storage
const STORAGE_KEYS = {
  AUTH_TOKEN: "auth_token",
  USER_DATA: "user_data",
  PHASE: "phase",
  DIGITAL_SIGNATURE_CONFIRMED: "digital_signature_confirmed",
  PUBLIC_KEY: "public_key",
  PRIVATE_KEY: "private_key",
  OTP_SENT: "otp_sent",
  OTP_CONFIRMED: "otp_confirmed",
  CURRENT_USER: "current_user",
  USER_PERMISSION: "user_permission",
  USER_LIST: "user_list",
  CURRENT_PHASE: "current_phase",
} as const;

// Type for the storage keys
type StorageKey = keyof typeof STORAGE_KEYS;

export { STORAGE_KEYS, StorageKey };
