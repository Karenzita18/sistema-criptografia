import fs from "fs";
import crypto from "crypto";
import path from "path";

// 🗝️ Gera par de chaves RSA (para cada teste)
export function generateKeys(pastaChaves) {
  const publicKeyPath = path.join(pastaChaves, "public.pem");
  const privateKeyPath = path.join(pastaChaves, "private.pem");

  if (!fs.existsSync(publicKeyPath) || !fs.existsSync(privateKeyPath)) {
    const { publicKey, privateKey } = crypto.generateKeyPairSync("rsa", {
      modulusLength: 2048,
      publicKeyEncoding: { type: "pkcs1", format: "pem" },
      privateKeyEncoding: { type: "pkcs1", format: "pem" },
    });

    fs.writeFileSync(publicKeyPath, publicKey);
    fs.writeFileSync(privateKeyPath, privateKey);
    console.log("🔑 Chaves RSA geradas.");
  } else {
    console.log("✅ Chaves RSA carregadas.");
  }
}

// 🔒 Criptografa arquivo pequeno (.asi)
export function encryptAssim(inputFile, outputFile, pastaChaves) {
  const publicKey = fs.readFileSync(path.join(pastaChaves, "public.pem"), "utf8");
  const data = fs.readFileSync(inputFile);

  // RSA só funciona com arquivos pequenos
  if (data.length > 200) {
    throw new Error("Arquivo muito grande para RSA. Use apenas arquivos pequenos ou texto.");
  }

  const encryptedData = crypto.publicEncrypt(publicKey, data);
  fs.writeFileSync(outputFile, encryptedData);
  console.log("🔒 Arquivo criptografado (assimétrica):", outputFile);
}

// 🔓 Descriptografa arquivo (.asi → original)
export function decryptAssim(inputFile, outputFile, pastaChaves) {
  const privateKey = fs.readFileSync(path.join(pastaChaves, "private.pem"), "utf8");
  const encryptedData = fs.readFileSync(inputFile);

  const decryptedData = crypto.privateDecrypt(privateKey, encryptedData);
  fs.writeFileSync(outputFile, decryptedData);
  console.log("🔓 Arquivo descriptografado (assimétrica):", outputFile);
}
