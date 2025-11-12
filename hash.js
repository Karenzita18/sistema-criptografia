import fs from "fs";
import crypto from "crypto";
import path from "path";

// Gera hash SHA-256
export function createHash(inputFile, outputFile) {
  if (!fs.existsSync(inputFile)) {
    throw new Error(`Arquivo não encontrado: ${inputFile}`);
  }

  const dir = path.dirname(outputFile);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

  const data = fs.readFileSync(inputFile);
  const hash = crypto.createHash("sha256").update(data).digest("hex");

  fs.writeFileSync(outputFile, hash);
  console.log(`🔁 Hash SHA-256 gerado com sucesso: ${outputFile}`);
}
