import { criptografarSimetrica, descriptografarSimetrica } from "./simetrica.js";
import { criptografarAssimetrica, descriptografarAssimetrica } from "./assimetrica.js";
import { gerarHash } from "./hash.js";

// O comando que a pessoa digitar no terminal
const acao = process.argv[2]; // sim | des-sim | assim | des-assim | hash

const arquivoEntrada = "./arquivos/entrada.txt";

if (acao === "sim") {
  criptografarSimetrica(arquivoEntrada, "./arquivos/saida.sim");
} else if (acao === "des-sim") {
  descriptografarSimetrica("./arquivos/saida.sim", "./arquivos/saida-descriptografado.txt");
} else if (acao === "assim") {
  criptografarAssimetrica(arquivoEntrada, "./arquivos/saida.asi");
} else if (acao === "des-assim") {
  descriptografarAssimetrica("./arquivos/saida.asi", "./arquivos/saida-descriptografado.txt");
} else if (acao === "hash") {
  gerarHash(arquivoEntrada, "./arquivos/saida.has");
} else {
  console.log("❗ Use um dos comandos: sim | des-sim | assim | des-assim | hash");
}
