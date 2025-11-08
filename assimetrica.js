// assimetrica.js
import fs from "fs";
import crypto from "crypto";
import path from "path";

const keysDir = "./chaves";
const pubPath = path.join(keysDir, "chave_publica.pem");
const privPath = path.join(keysDir, "chave_privada.pem");

function ensureKeysExist() {
  if (!fs.existsSync(keysDir)) fs.mkdirSync(keysDir, { recursive: true });

  if (!fs.existsSync(pubPath) || !fs.existsSync(privPath)) {
    const { publicKey, privateKey } = crypto.generateKeyPairSync("rsa", {
      modulusLength: 2048,
      publicExponent: 0x10001,
    });

    fs.writeFileSync(pubPath, publicKey.export({ type: "pkcs1", format: "pem" }));
    fs.writeFileSync(privPath, privateKey.export({ type: "pkcs1", format: "pem" }));
    console.log("🔑 Par de chaves RSA gerado e salvo em ./chaves/");
  }
}

function readKeys() {
  ensureKeysExist();
  const publicKeyPem = fs.readFileSync(pubPath, "utf8");
  const privateKeyPem = fs.readFileSync(privPath, "utf8");
  return { publicKeyPem, privateKeyPem };
}

/**
 * Criptografia híbrida:
 * - Gera chave AES-256-CBC (32 bytes) + IV (16 bytes)
 * - Criptografa o arquivo com AES
 * - Criptografa a chave AES com a chave pública RSA (OAEP + SHA-256)
 * - Salva um JSON (base64) no arquivo de saída (.asi)
 */
export function criptografarAssimetrica(inputPath, outputPath) {
  const { publicKeyPem } = readKeys();

  // Lê arquivo a ser criptografado
  const data = fs.readFileSync(inputPath);

  // Gera chave simétrica (AES) e IV
  const symKey = crypto.randomBytes(32); // AES-256
  const iv = crypto.randomBytes(16);

  // Criptografa dados com AES-256-CBC
  const cipher = crypto.createCipheriv("aes-256-cbc", symKey, iv);
  const encryptedData = Buffer.concat([cipher.update(data), cipher.final()]);

  // Criptografa a chave simétrica com RSA (publicKey)
  const encryptedSymKey = crypto.publicEncrypt(
    {
      key: publicKeyPem,
      padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
      oaepHash: "sha256",
    },
    symKey
  );

  // Monta objeto (base64) e salva como JSON
  const payload = {
    key: encryptedSymKey.toString("base64"),
    iv: iv.toString("base64"),
    data: encryptedData.toString("base64"),
  };

  fs.writeFileSync(outputPath, JSON.stringify(payload));
  console.log("✅ Arquivo criptografado (assimétrica/híbrida) criado:", outputPath);
  console.log("➡️ Chaves RSA em:", pubPath, privPath);
}

/**
 * Descriptografa o .asi gerado acima:
 * - Lê JSON, descriptografa chave AES com chave privada RSA
 * - Descriptografa o conteúdo AES e salva
 */
export function descriptografarAssimetrica(inputPath, outputPath) {
  const { privateKeyPem } = readKeys();

  // Lê e parseia o arquivo .asi
  const raw = fs.readFileSync(inputPath, "utf8");
  let payload;
  try {
    payload = JSON.parse(raw);
  } catch (err) {
    throw new Error("Arquivo .asi inválido (não é JSON). Certifique-se de que foi gerado por este sistema.");
  }

  const encryptedSymKey = Buffer.from(payload.key, "base64");
  const iv = Buffer.from(payload.iv, "base64");
  const encryptedData = Buffer.from(payload.data, "base64");

  // Descriptografa a chave simétrica com RSA (privateKey)
  const symKey = crypto.privateDecrypt(
    {
      key: privateKeyPem,
      padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
      oaepHash: "sha256",
    },
    encryptedSymKey
  );

  // Descriptografa os dados com AES
  const decipher = crypto.createDecipheriv("aes-256-cbc", symKey, iv);
  const decrypted = Buffer.concat([decipher.update(encryptedData), decipher.final()]);

  fs.writeFileSync(outputPath, decrypted);
  console.log("🔓 Arquivo decriptografado (assimétrica) criado:", outputPath);
}
