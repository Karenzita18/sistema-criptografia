# 🔐 Sistema de Criptografia Didático

Este projeto foi desenvolvido com o objetivo de demonstrar, de forma **didática e modular**, como funcionam os principais tipos de **criptografia** e **hash** utilizando Node.js.

O sistema aceita **qualquer tipo de arquivo** e implementa:

- (a) Criptografia e Decriptografia **Simétrica (AES-256-CBC)**  
- (b) Criptografia e Decriptografia **Assimétrica (RSA + AES híbrido)**  
- (c) Geração de **Hash (SHA-256)**

Além disso, o sistema gera automaticamente os arquivos de saída com as extensões:
- `.sim` → criptografia simétrica  
- `.asi` → criptografia assimétrica  
- `.has` → hash

---

## 🗂 Estrutura de Pastas

A estrutura sugerida para organização dos testes é:

```
sistema-criptografia/
│
├── index.js
├── simetrica.js
├── assimetrica.js
├── hash.js
│
├── chaves/
│   ├── public.pem
│   ├── private.pem
│
└── arquivos/
    └── teste01/
        ├── teste01-entrada/
        │   └── arquivo.txt
        ├── teste01-saida/
        └── chaves/
```

---

## 🚀 Como Executar

### 1️⃣ Instalar dependências
Este projeto usa apenas módulos nativos do Node.js, então **não é necessário instalar pacotes externos**.

Certifique-se apenas de estar usando Node.js versão **16 ou superior**.

---

### 2️⃣ Executar os testes

Use os seguintes comandos no terminal, dentro da pasta do projeto:

#### 🔹 Criptografia Simétrica
```bash
node index.js sim "C:/Users/karen/projetos/sistema-criptografia/arquivos/teste01/teste01-entrada/arquivo.txt"
```

#### 🔹 Criptografia Assimétrica (Híbrida)
```bash
node index.js asi "C:/Users/karen/projetos/sistema-criptografia/arquivos/teste01/teste01-entrada/arquivo.txt"
```

#### 🔹 Geração de Hash
```bash
node index.js hash "C:/Users/karen/projetos/sistema-criptografia/arquivos/teste01/teste01-entrada/arquivo.txt"
```

#### 🔹 Executar Tudo (Simétrica + Assimétrica + Hash)
```bash
node index.js all "C:/Users/karen/projetos/sistema-criptografia/arquivos/teste01/teste01-entrada/arquivo.txt"
```

---

## 🔓 Decriptografia

Após criptografar, você pode **decriptar** os arquivos gerados:

#### 🔹 Decriptar Simétrica
```bash
node index.js dec-sim "C:/Users/karen/projetos/sistema-criptografia/arquivos/teste01/teste01-entrada/arquivo.txt.sim"
```

#### 🔹 Decriptar Assimétrica
```bash
node index.js dec-asi "C:/Users/karen/projetos/sistema-criptografia/arquivos/teste01/teste01-entrada/arquivo.txt.asi"
```

Os arquivos de saída serão gerados automaticamente na mesma pasta.

---

## ⚙️ Funcionalidades

| Função | Descrição | Arquivo de saída |
|--------|------------|------------------|
| Criptografia Simétrica | Usa AES-256-CBC para criptografar o arquivo | `.sim` |
| Criptografia Assimétrica | Usa RSA (2048 bits) para criptografar a chave AES e IV | `.asi` |
| Hash | Gera hash SHA-256 do arquivo original | `.has` |

---

## 🧠 Características Técnicas

- Modular (cada tipo de criptografia em seu próprio arquivo)
- Geração automática de chaves se não existirem
- Suporte a **qualquer tipo e tamanho de arquivo**
- Estrutura simples e flexível para testes

---

## 📖 Documentação da Solução

Este projeto foi desenvolvido com fins **educacionais** para demonstrar o funcionamento de diferentes métodos de criptografia, decriptografia e hash.

O sistema é **didático, modular e flexível**, permitindo que os alunos compreendam:
- O funcionamento de chaves simétricas e assimétricas  
- O uso prático do algoritmo AES (simétrico) e RSA (assimétrico)  
- A aplicação do hash como verificação de integridade  
