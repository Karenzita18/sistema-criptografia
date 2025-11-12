import fs from "fs";
import crypto from "crypto";
import path from "path";

const algorithm = "aes-256-cbc";

// Gera ou carrega chaves simétricas (AES)
export function ensureChavesSimetricas(pastaChaves) {
  const keyPath = path.join(pastaChaves, "sim_key.bin");
  const ivPath = path.join(pastaChaves, "sim_iv.bin");

  if (!fs.existsSync(keyPath) || !fs.existsSync(ivPath)) {
    const key = crypto.randomBytes(32);
    const iv = crypto.randomBytes(16);
    fs.writeFileSync(keyPath, key);
    fs.writeFileSync(ivPath, iv);
    console.log("🗝️ Chaves AES geradas.");
  } else {
    console.log("✅ Chaves AES carregadas.");
  }
}

// Criptografa com AES
export function encryptSim(inputFile, outputFile, pastaChaves) {
  const key = fs.readFileSync(path.join(pastaChaves, "sim_key.bin"));
  const iv = fs.readFileSync(path.join(pastaChaves, "sim_iv.bin"));
  const cipher = crypto.createCipheriv(algorithm, key, iv);
  const input = fs.readFileSync(inputFile);
  const encrypted = Buffer.concat([cipher.update(input), cipher.final()]);
  fs.writeFileSync(outputFile, encrypted);
  console.log("🔒 Arquivo criptografado (AES):", outputFile);
}

// Descriptografa com AES
export function decryptSim(inputFile, outputFile, pastaChaves) {
  const key = fs.readFileSync(path.join(pastaChaves, "sim_key.bin"));
  const iv = fs.readFileSync(path.join(pastaChaves, "sim_iv.bin"));
  const encryptedData = fs.readFileSync(inputFile);
  const decipher = crypto.createDecipheriv(algorithm, key, iv);
  const decrypted = Buffer.concat([decipher.update(encryptedData), decipher.final()]);
  fs.writeFileSync(outputFile, decrypted);
  console.log("🔓 Arquivo descriptografado (AES):", outputFile);
}
