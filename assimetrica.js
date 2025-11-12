import fs from "fs";
import crypto from "crypto";
import path from "path";

// 🗝️ Gera par de chaves RSA (apenas se não existirem)
function generateKeys(pastaChaves) {
  const pubPath = path.join(pastaChaves, "public.pem");
  const privPath = path.join(pastaChaves, "private.pem");

  // ✅ Se a pasta de chaves não existir, cria
  if (!fs.existsSync(pastaChaves)) {
    fs.mkdirSync(pastaChaves, { recursive: true });
    console.log(`📁 Pasta de chaves criada: ${pastaChaves}`);
  }

  // ✅ Gera novas chaves só se não existirem
  if (!fs.existsSync(pubPath) || !fs.existsSync(privPath)) {
    const { publicKey, privateKey } = crypto.generateKeyPairSync("rsa", {
      modulusLength: 2048,
      publicKeyEncoding: { type: "pkcs1", format: "pem" },
      privateKeyEncoding: { type: "pkcs1", format: "pem" },
    });

    fs.writeFileSync(pubPath, publicKey);
    fs.writeFileSync(privPath, privateKey);
    console.log("🔑 Par de chaves RSA gerado.");
  } else {
    console.log("✅ Chaves RSA já existentes, reutilizando.");
  }
}

// 🔒 Criptografia assimétrica (híbrida RSA + AES)
function encryptAssimHibrido(inputFile, outputFile, pastaChaves) {
  const publicKey = fs.readFileSync(path.join(pastaChaves, "public.pem"), "utf8");
  const key = crypto.randomBytes(32); // chave AES 256 bits
  const iv = crypto.randomBytes(16);  // vetor de inicialização AES

  const cipher = crypto.createCipheriv("aes-256-cbc", key, iv);
  const input = fs.readFileSync(inputFile);
  const encryptedData = Buffer.concat([cipher.update(input), cipher.final()]);

  // Criptografa a chave AES e o IV usando a chave pública RSA
  const encryptedKey = crypto.publicEncrypt(publicKey, Buffer.concat([key, iv]));

  // Junta: [tamanho da chave RSA criptografada (4 bytes)] + [chave AES+IV criptografada] + [dados criptografados]
  const pacote = Buffer.concat([
    Buffer.from(encryptedKey.byteLength.toString().padStart(4, "0")),
    encryptedKey,
    encryptedData,
  ]);

  fs.writeFileSync(outputFile, pacote);
  console.log("🔒 Arquivo criptografado (assimétrica/híbrida):", outputFile);
}

// 🔓 Descriptografia assimétrica (híbrida RSA + AES)
function decryptAssimHibrido(inputFile, outputFile, pastaChaves) {
  const privateKey = fs.readFileSync(path.join(pastaChaves, "private.pem"), "utf8");
  const data = fs.readFileSync(inputFile);

  // Lê os 4 primeiros bytes (tamanho da chave RSA criptografada)
  const keyLen = parseInt(data.slice(0, 4).toString());
  const encryptedKey = data.slice(4, 4 + keyLen);
  const encryptedData = data.slice(4 + keyLen);

  // Descriptografa a chave AES + IV
  const keyIv = crypto.privateDecrypt(privateKey, encryptedKey);
  const key = keyIv.slice(0, 32);
  const iv = keyIv.slice(32, 48);

  // Descriptografa os dados com AES
  const decipher = crypto.createDecipheriv("aes-256-cbc", key, iv);
  const decrypted = Buffer.concat([decipher.update(encryptedData), decipher.final()]);

  fs.writeFileSync(outputFile, decrypted);
  console.log("🔓 Arquivo descriptografado (assimétrica/híbrida):", outputFile);
}

// 🔚 Exporta todas as funções
export { generateKeys, encryptAssimHibrido, decryptAssimHibrido };
