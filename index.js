import fs from "fs";
import path from "path";
import { encryptSim, decryptSim, ensureChavesSimetricas } from "./simetrica.js";
import { generateKeys, encryptAssim, decryptAssim } from "./assimetrica.js";
import { createHash } from "./hash.js";

// ====== Parâmetros ======
const modo = process.argv[2]; // simetrica, assimetrica, hash ou all
const arquivoEntrada = process.argv[3]; // caminho do arquivo
if (!modo || !arquivoEntrada) {
  console.error("❌ Use: node index.js <modo> <caminho_do_arquivo>");
  process.exit(1);
}

// ====== Detecta arquivo ======
let arquivoCaminho = arquivoEntrada;
if (!fs.existsSync(arquivoCaminho)) {
  const tentativa = path.join("arquivos", arquivoEntrada);
  if (fs.existsSync(tentativa)) arquivoCaminho = tentativa;
  else {
    console.error("❌ Arquivo não encontrado:", arquivoEntrada);
    process.exit(1);
  }
}

console.log("📄 Arquivo detectado:", arquivoCaminho);

// ====== Define pasta de teste ======
let testeExistente = null;
const partes = path.normalize(arquivoCaminho).split(path.sep);
for (const parte of partes) if (parte.startsWith("teste")) testeExistente = parte;

let testName;
if (testeExistente) {
  testName = testeExistente;
  console.log(`📂 Usando teste existente: ${testName}`);
} else {
  const baseDir = "arquivos";
  if (!fs.existsSync(baseDir)) fs.mkdirSync(baseDir);
  const testes = fs.readdirSync(baseDir).filter(f => f.startsWith("teste"));
  testName = `teste${String(testes.length + 1).padStart(2, "0")}`;
  console.log(`🚀 Criando novo teste: ${testName}`);
}

const testDir = path.join("arquivos", testName);
const pastaChaves = path.join(testDir, "chaves");

// ====== Cria estrutura ======
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

// ====== Define saídas ======
const originalFileName = path.basename(arquivoCaminho);
const simEnc = path.join(testDir, `${testName}-entrada/simetrica/${path.parse(originalFileName).name}.sim`);
const simDec = path.join(testDir, `${testName}-saida/simetrica/${originalFileName}`);
const asiEnc = path.join(testDir, `${testName}-entrada/assimetrica/${path.parse(originalFileName).name}.asi`);
const asiDec = path.join(testDir, `${testName}-saida/assimetrica/${originalFileName}`);
const hashOut = path.join(testDir, `${testName}-saida/hash/${path.parse(originalFileName).name}.has`);

// ====== Funções ======
function runSimetrica() {
  try {
    ensureChavesSimetricas(pastaChaves);
    encryptSim(arquivoCaminho, simEnc, pastaChaves);
    decryptSim(simEnc, simDec, pastaChaves);
    console.log("✅ Simétrica concluída!");
  } catch (e) {
    console.error("❌ Erro simétrica:", e.message);
  }
}

function runAssimetrica() {
  try {
    const stats = fs.statSync(arquivoCaminho);
    if (stats.size > 200) console.log("⚠️ Arquivo muito grande para RSA, pulando assimétrica");
    else {
      generateKeys(pastaChaves);
      encryptAssim(arquivoCaminho, asiEnc, pastaChaves);
      decryptAssim(asiEnc, asiDec, pastaChaves);
      console.log("✅ Assimétrica concluída!");
    }
  } catch (e) {
    console.error("❌ Erro assimétrica:", e.message);
  }
}

function runHash() {
  try {
    createHash(arquivoCaminho, hashOut);
    console.log("✅ Hash gerado:", hashOut);
  } catch (e) {
    console.error("❌ Erro hash:", e.message);
  }
}

// ====== Executa conforme o modo ======
if (modo === "simetrica") runSimetrica();
else if (modo === "assimetrica") runAssimetrica();
else if (modo === "hash") runHash();
else if (modo === "all") {
  runSimetrica();
  runAssimetrica();
  runHash();
}

console.log(`\n✅ ${testName} concluído com sucesso!`);
console.log(`📂 Estrutura criada em: ${testDir}`);
