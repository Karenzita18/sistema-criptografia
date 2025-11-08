import fs from "fs";
import crypto from "crypto";
import path from "path";

export function generateKeys(chavesDir) {
  const publicKeyPath = path.join(chavesDir, "public_key.pem");
  const privateKeyPath = path.join(chavesDir, "private_key.pem");

  if (!fs.existsSync(chavesDir)) fs.mkdirSync(chavesDir, { recursive: true });

  if (!fs.existsSync(publicKeyPath) || !fs.existsSync(privateKeyPath)) {
    const { publicKey, privateKey } = crypto.generateKeyPairSync("rsa", {
      modulusLength: 2048,
      publicKeyEncoding: { type: "pkcs1", format: "pem" },
      privateKeyEncoding: { type: "pkcs1", format: "pem" },
    });

    fs.writeFileSync(publicKeyPath, publicKey);
    fs.writeFileSync(privateKeyPath, privateKey);

    console.log("✅ Par de chaves RSA criado!");
  }
}

export function encryptAssim(inputFile, outputFile, chavesDir) {
  const publicKey = fs.readFileSync(path.join(chavesDir, "public_key.pem"), "utf8");
  const data = fs.readFileSync(inputFile);
  const encrypted = crypto.publicEncrypt(publicKey, data);
  fs.writeFileSync(outputFile, encrypted);
  console.log("🔒 Arquivo criptografado (assimétrica):", outputFile);
}

export function decryptAssim(inputFile, outputFile, chavesDir) {
  const privateKey = fs.readFileSync(path.join(chavesDir, "private_key.pem"), "utf8");
  const encrypted = fs.readFileSync(inputFile);
  const decrypted = crypto.privateDecrypt(privateKey, encrypted);
  fs.writeFileSync(outputFile, decrypted);
  console.log("🔓 Arquivo descriptografado (assimétrica):", outputFile);
}
