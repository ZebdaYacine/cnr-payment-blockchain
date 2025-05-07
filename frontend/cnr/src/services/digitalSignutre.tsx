// hooks/useSignatureVerifier.ts
import { useProfileViewModel } from "../feature/profile/viewmodel/ProfileViewModel";
import { PofileUseCase } from "../feature/profile/domain/usecase/ProfileUseCase";
import { ProfileRepositoryImpl } from "../feature/profile/data/repository/ProfileRepositoryImpl";
import { ProfileDataSourceImpl } from "../feature/profile/data/dataSource/ProfileAPIDataSource";

import forge from "node-forge";

export function signWithPrivateKey(
  privateKeyPem: string,
  message: string
): string {
  const privateKey = forge.pki.privateKeyFromPem(privateKeyPem);
  const md = forge.md.sha256.create();
  md.update(message, "utf8");
  const signature = privateKey.sign(md);
  const signatureBase64 = forge.util.encode64(signature);
  console.log(signatureBase64);
  return signatureBase64;
}

// export const pemToArrayBuffer = (pem: string): ArrayBuffer => {
//   const b64 = pem
//     .replace(/-----BEGIN [^-]+-----/, "")
//     .replace(/-----END [^-]+-----/, "")
//     .replace(/\s/g, "");
//   const binary = atob(b64);
//   const buffer = new ArrayBuffer(binary.length);
//   const view = new Uint8Array(buffer);
//   for (let i = 0; i < binary.length; i++) {
//     view[i] = binary.charCodeAt(i);
//   }
//   return buffer;
// };

export const useSignatureVerifier = () => {
  const profileUseCase = new PofileUseCase(
    new ProfileRepositoryImpl(new ProfileDataSourceImpl())
  );
  const { verifySignature, isVerifyingSignature } =
    useProfileViewModel(profileUseCase);

  const verify = async (fileContent: string): Promise<boolean> => {
    try {
      // const keyBuffer = pemToArrayBuffer(fileContent);

      // const key = await window.crypto.subtle.importKey(
      //   "pkcs8",
      //   keyBuffer,
      //   {
      //     name: "RSA-PSS",
      //     hash: { name: "SHA-256" },
      //   },
      //   false,
      //   ["sign"]
      // );

      const randomValue = Math.floor(Math.random() * 1000000).toString();
      // const data = new TextEncoder().encode(randomValue);

      // const signatureBuffer = await window.crypto.subtle.sign(
      //   {
      //     name: "RSA-PSS",
      //     saltLength: 32,
      //   },
      //   key,
      //   data
      // );

      // const signatureBase64 = btoa(
      //   String.fromCharCode(
      //     ...new Uint8Array(signWithPrivateKey(fileContent, randomValue))
      //   )
      // );

       await verifySignature({
        signature: signWithPrivateKey(fileContent, randomValue),
        randomValue,
      });

     

      return true;
    } catch (error) {
      console.error("Erreur lors de la vérification de la signature", error);
      throw error;
    }
  };

  return {
    verify,
    isVerifyingSignature,
  };
};
