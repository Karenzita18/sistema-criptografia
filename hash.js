import fs from "fs";
import crypto from "crypto";

export function createHash(inputFile, outputFile) {
  const data = fs.readFileSync(inputFile);
  const hash = crypto.createHash("sha256").update(data).digest("hex");
  fs.writeFileSync(outputFile, hash);
  console.log("🔁 Hash gerado:", outputFile);
}
