import fs from "fs";
import path from "path";
import { encryptSim, decryptSim, ensureChavesSimetricas } from "./simetrica.js";
import { generateKeys, encryptAssim, decryptAssim } from "./assimetrica.js";
import { createHash } from "./hash.js";

const arquivoEntrada = process.argv[2];
if (!arquivoEntrada) {
  console.error("❌ Informe o arquivo: node index.js <caminho>");
  process.exit(1);
}

let arquivoCaminho = arquivoEntrada;

// Detecta se o arquivo existe no caminho informado
if (!fs.existsSync(arquivoCaminho)) {
  const tentativa = path.join("arquivos", arquivoEntrada);
  if (fs.existsSync(tentativa)) {
    arquivoCaminho = tentativa;
  } else {
    console.error("❌ Arquivo não encontrado:", arquivoEntrada);
    process.exit(1);
  }
}

console.log("📄 Arquivo detectado:", arquivoCaminho);

// Descobre se o arquivo já está dentro de algum teste
let testeExistente = null;
let partes = path.normalize(arquivoCaminho).split(path.sep);

for (const parte of partes) {
  if (parte.startsWith("teste")) {
    testeExistente = parte;
    break;
  }
}

let testName;
if (testeExistente) {
  testName = testeExistente; // usa o teste existente
  console.log(`📂 Usando teste existente: ${testName}`);
} else {
  // cria um novo teste
  const baseDir = "arquivos";
  if (!fs.existsSync(baseDir)) fs.mkdirSync(baseDir);
  const testes = fs.readdirSync(baseDir).filter(f => f.startsWith("teste"));
  const nextTestNum = String(testes.length + 1).padStart(2, "0");
  testName = `teste${nextTestNum}`;
  console.log(`🚀 Criando novo teste: ${testName}`);
}

const testDir = path.join("arquivos", testName);
const pastaChaves = path.join(testDir, "chaves");

// Cria pastas necessárias (entrada/saída)
const estrutura = [
  `${testDir}/${testName}-entrada/simetrica`,
  `${testDir}/${testName}-entrada/assimetrica`,
  `${testDir}/${testName}-entrada/hash`,
  `${testDir}/${testName}-saida/simetrica`,
  `${testDir}/${testName}-saida/assimetrica`,
  `${testDir}/${testName}-saida/hash`,
  `${testDir}/chaves`
];

estrutura.forEach(dir => fs.mkdirSync(dir, { recursive: true }));

// Define os caminhos de saída
const originalFileName = path.basename(arquivoCaminho);
const simEnc = path.join(testDir, `${testName}-entrada/simetrica/${path.parse(originalFileName).name}.sim`);
const simDec = path.join(testDir, `${testName}-saida/simetrica/${originalFileName}`);

const asiEnc = path.join(testDir, `${testName}-entrada/assimetrica/${path.parse(originalFileName).name}.asi`);
const asiDec = path.join(testDir, `${testName}-saida/assimetrica/${originalFileName}`);

const hashOut = path.join(testDir, `${testName}-saida/hash/${path.parse(originalFileName).name}.has`);

// 🔐 Simétrica
try {
  ensureChavesSimetricas(pastaChaves);
  encryptSim(arquivoCaminho, simEnc, pastaChaves);
  decryptSim(simEnc, simDec, pastaChaves);
  console.log("✅ Criptografia simétrica concluída!");
} catch (error) {
  console.error("❌ Erro na simétrica:", error.message);
}

// 🔑 Assimétrica
try {
  const stats = fs.statSync(arquivoCaminho);
  if (stats.size > 200) {
    console.log("⚠️ Arquivo muito grande para RSA. Pulando criptografia assimétrica...");
  } else {
    generateKeys(pastaChaves);
    encryptAssim(arquivoCaminho, asiEnc, pastaChaves);
    decryptAssim(asiEnc, asiDec, pastaChaves);
  }
} catch (error) {
  console.error("⚠️ Erro na criptografia assimétrica:", error.message);
  console.log("➡️ Continuando para geração de hash...");
}

// 🧮 Hash
try {
  createHash(arquivoCaminho, hashOut);
  console.log(`✅ Hash gerado com sucesso: ${hashOut}`);
} catch (error) {
  console.error("❌ Erro ao gerar hash:", error.message);
}

console.log(`\n✅ ${testName} concluído com sucesso!`);
console.log(`📂 Estrutura criada em: ${testDir}`);
