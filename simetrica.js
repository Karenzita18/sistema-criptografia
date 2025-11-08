// simetrica.js
import fs from "fs";
import crypto from "crypto";
import path from "path";

const algorithm = "aes-256-cbc";
const keyPath = "./chaves/sim_key.bin";
const ivPath = "./chaves/sim_iv.bin";

function ensureChavesSimetricas() {
  // cria pasta chaves se não existir
  const chavesDir = path.dirname(keyPath);
  if (!fs.existsSync(chavesDir)) fs.mkdirSync(chavesDir, { recursive: true });

  // se não existir key/iv, gera e salva
  if (!fs.existsSync(keyPath) || !fs.existsSync(ivPath)) {
    const key = crypto.randomBytes(32); // 256 bits
    const iv = crypto.randomBytes(16);  // 128 bits (AES block size)
    fs.writeFileSync(keyPath, key);
    fs.writeFileSync(ivPath, iv);
    console.log("🔐 Chave simétrica e IV gerados e salvos em ./chaves/");
  }
}

function lerKeyIV() {
  if (!fs.existsSync(keyPath) || !fs.existsSync(ivPath)) {
    throw new Error("Chave/IV não encontrados. Rode a criptografia para gerar, ou verifique ./chaves/");
  }
  const key = fs.readFileSync(keyPath);
  const iv = fs.readFileSync(ivPath);
  return { key, iv };
}

export function gerarChaveSimetrica() {
  // força geração (útil se quiser regenerar)
  const key = crypto.randomBytes(32);
  const iv = crypto.randomBytes(16);
  fs.writeFileSync(keyPath, key);
  fs.writeFileSync(ivPath, iv);
  console.log("🔐 Nova chave simétrica e IV gerados e salvos em ./chaves/");
}

export function criptografarSimetrica(inputPath, outputPath) {
  // garante que existam chaves (gera se não)
  ensureChavesSimetricas();
  const { key, iv } = lerKeyIV();

  const data = fs.readFileSync(inputPath);
  const cipher = crypto.createCipheriv(algorithm, key, iv);
  const encrypted = Buffer.concat([cipher.update(data), cipher.final()]);

  fs.writeFileSync(outputPath, encrypted);
  console.log("✅ Arquivo criptografado com sucesso:", outputPath);
  console.log("➡️ Chave e IV usados estão em:", keyPath, ivPath);
}

export function descriptografarSimetrica(inputPath, outputPath) {
  const { key, iv } = lerKeyIV();

  const data = fs.readFileSync(inputPath);
  const decipher = crypto.createDecipheriv(algorithm, key, iv);
  const decrypted = Buffer.concat([decipher.update(data), decipher.final()]);
  fs.writeFileSync(outputPath, decrypted);
  console.log("🔓 Arquivo decriptografado com sucesso:", outputPath);
}
