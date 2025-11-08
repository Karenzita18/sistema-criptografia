import fs from "fs";
import crypto from "crypto";
import path from "path";

const algorithm = "aes-256-cbc";

export function ensureChavesSimetricas(chavesDir) {
  const keyPath = path.join(chavesDir, "sim_key.bin");
  const ivPath = path.join(chavesDir, "sim_iv.bin");

  if (!fs.existsSync(chavesDir)) fs.mkdirSync(chavesDir, { recursive: true });

  if (!fs.existsSync(keyPath) || !fs.existsSync(ivPath)) {
    const key = crypto.randomBytes(32); // 256 bits
    const iv = crypto.randomBytes(16); // 128 bits
    fs.writeFileSync(keyPath, key);
    fs.writeFileSync(ivPath, iv);
    console.log("✅ Chaves simétricas criadas!");
  }
}

export function encryptSim(inputFile, outputFile, chavesDir) {
  const key = fs.readFileSync(path.join(chavesDir, "sim_key.bin"));
  const iv = fs.readFileSync(path.join(chavesDir, "sim_iv.bin"));
  const data = fs.readFileSync(inputFile);

  const cipher = crypto.createCipheriv(algorithm, key, iv);
  const encrypted = Buffer.concat([cipher.update(data), cipher.final()]);
  fs.writeFileSync(outputFile, encrypted);

  console.log("🔒 Arquivo criptografado (simétrica):", outputFile);
}

export function decryptSim(inputFile, outputFile, chavesDir) {
  const key = fs.readFileSync(path.join(chavesDir, "sim_key.bin"));
  const iv = fs.readFileSync(path.join(chavesDir, "sim_iv.bin"));
  const encryptedData = fs.readFileSync(inputFile);

  const decipher = crypto.createDecipheriv(algorithm, key, iv);
  const decrypted = Buffer.concat([decipher.update(encryptedData), decipher.final()]);
  fs.writeFileSync(outputFile, decrypted);

  console.log("🔓 Arquivo descriptografado (simétrica):", outputFile);
}
