import fs from "fs";
import path from "path";
import { encryptSim, decryptSim, ensureChavesSimetricas } from "./simetrica.js";
import { generateKeys, encryptAssim, decryptAssim } from "./assimetrica.js";
import { createHash } from "./hash.js";

// nome do teste (ex: node index.js teste01)
const nomeTeste = process.argv[2];

if (!nomeTeste) {
  console.error("❌ Informe o nome da pasta. Exemplo:");
  console.error("   node index.js teste01");
  process.exit(1);
}

// caminhos principais
const baseDir = `./arquivos/${nomeTeste}`;
const entradaDir = path.join(baseDir, "entrada");
const entradaInternaDir = path.join(baseDir, `${nomeTeste}-entrada`);
const saidaDir = path.join(baseDir, `${nomeTeste}-saida`);
const chavesDir = path.join(baseDir, "chaves"); // 👈 nova pasta de chaves

// arquivo original
const arquivoEntrada = path.join(entradaDir, "arquivo.txt");

// garantir que as pastas existam
[entradaDir, entradaInternaDir, saidaDir, chavesDir].forEach((dir) => {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
});

// criar subpastas
["assimetrica", "simetrica", "hash"].forEach((tipo) => {
  fs.mkdirSync(path.join(entradaInternaDir, tipo), { recursive: true });
  fs.mkdirSync(path.join(saidaDir, tipo), { recursive: true });
});

// caminhos de saída
const simEntrada = path.join(entradaInternaDir, "simetrica", "arquivo.sim");
const simSaida = path.join(saidaDir, "simetrica", "arquivo.txt");
const assimEntrada = path.join(entradaInternaDir, "assimetrica", "arquivo.asi");
const assimSaida = path.join(saidaDir, "assimetrica", "arquivo.txt");
const hashSaida = path.join(saidaDir, "hash", "arquivo.has");

// ---- EXECUÇÃO ----

// SIMÉTRICA
ensureChavesSimetricas(chavesDir);
encryptSim(arquivoEntrada, simEntrada, chavesDir);
decryptSim(simEntrada, simSaida, chavesDir);

// ASSIMÉTRICA
generateKeys(chavesDir);
encryptAssim(arquivoEntrada, assimEntrada, chavesDir);
decryptAssim(assimEntrada, assimSaida, chavesDir);

// HASH
createHash(arquivoEntrada, hashSaida);
