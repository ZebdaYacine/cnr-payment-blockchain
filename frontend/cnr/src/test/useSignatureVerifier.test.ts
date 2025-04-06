import { renderHook, act } from "@testing-library/react-hooks";
import { useSignatureVerifier } from "../services/digitalSignutre";

// Mock de `useProfileViewModel`
jest.mock("../feature/profile/viewmodel/ProfileViewModel", () => ({
  useProfileViewModel: () => ({
    verifySignature: jest.fn().mockResolvedValue(true),
    isVerifyingSignature: false,
  }),
}));

// Mock de window.crypto.subtle
const mockImportKey = jest.fn();
const mockSign = jest.fn();

beforeAll(() => {
  Object.defineProperty(global, "crypto", {
    value: {
      subtle: {
        importKey: mockImportKey,
        sign: mockSign,
      },
    },
  });

  // Mock atob (nécessaire dans l'environnement Node pour `pemToArrayBuffer`)
  global.atob = (b64) => Buffer.from(b64, "base64").toString("binary");
});

beforeEach(() => {
  mockImportKey.mockReset();
  mockSign.mockReset();
});

test("should verify a signature successfully", async () => {
  // Arrange
  const fakeKey = {};
  const fakeSignature = new Uint8Array([1, 2, 3]).buffer;

  mockImportKey.mockResolvedValue(fakeKey);
  mockSign.mockResolvedValue(fakeSignature);

  const { result } = renderHook(() => useSignatureVerifier());

  // Simule un fichier PEM valide
  const pem = `-----BEGIN PRIVATE KEY-----\n${Buffer.from("mockKey").toString(
    "base64"
  )}\n-----END PRIVATE KEY-----`;

  let success = false;

  // Act
  await act(async () => {
    success = await result.current.verify(pem);
  });

  // Assert
  expect(success).toBe(true);
  expect(mockImportKey).toHaveBeenCalled();
  expect(mockSign).toHaveBeenCalled();
});
