import fs from "fs";
import crypto from "crypto";

// Função que cria um hash SHA-256 do arquivo
export function gerarHash(inputPath, outputPath) {
  const data = fs.readFileSync(inputPath);
  const hash = crypto.createHash("sha256").update(data).digest("hex");
  fs.writeFileSync(outputPath, hash);
  console.log("🧬 Hash gerado:", hash);
}
