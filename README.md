## Projeto CadCliente - Cadastro Único de Clientes
Projeto front-end de apresentação MVP do Sprint Desenvolvimento Full Stack Básico.
------------------------------
## 📌 Índice

* [Sobre o Projeto](#-sobre-o-projeto)
* [Funcionalidades](#-funcionalidades)
* [Tecnologias Utilizadas](#-tecnologias-utilizadas)
* [Pré-requisitos](#-pré-requisitos)
* [Instalação](#-instalação)
* [Como Executar](#-como-executar)
* [Como Contribuir](#-como-contribuir)
------------------------------
## 📖 Sobre o Projeto

Este projeto tem o objetivo de realizar o cadastro de clientes com endereço para envios de correspondências e notificações.
------------------------------
## ✨ Funcionalidades

* 1: Cadastro de clientes
* 2: Atualização de clientes
* 3: Deleção de clientes
* 4: Cadastro de endereços de cliente
* 5: Atualizaão de endereços de cliente
* 6: Deleção de endereços de cliente
* 7: Consulta de clientes por meio do nome 
* 8: Consulta de clientes por listagem
------------------------------
## 🛠 Tecnologias Utilizadas

As principais ferramentas e bibliotecas usadas no desenvolvimento:
* [Javascript](https://www.javascript.com)
* [HTML](https://html.spec.whatwg.org/dev/)
------------------------------
## 📋 Pré-requisitos

Antes de começar, certifique-se de:
- Estar com o Docker devidamente instalado e em execução em sua máquina.
- Ter a aplicação [BACK-END-MVP] (https://github.com/almirrps/back-end-mvp) e a aplicação
[FRONT-END-MVP] (https://github.com/almirrps/front-end-mvp) baixadas dentro de uma pasta
em comum. ex.: projetos_mvp
- Mova o arquivo docker-compose.yml existente na pasta raiz do projeto front-end-mvp para a pasta
em comum onde os dois projetos foram baixados.
------------------------------
## 🔧 Instalação

Siga os passos abaixo para configurar o ambiente de desenvolvimento:

   1. Clone os repositórios: 

git clone https://github.com/almirrps/back-end-mvp.git

git clone https://github.com/almirrps/front-end-mvp.git

   2. Coloque-os dentro de uma pasta comum:
Crie uma pasta projetos_mvp, por exemplo e copie os dois projetos para dentro dela

   3. Mova o arquivo docker-compose.yml existente na pasta raiz do projeto front-end-mvp para dentro da pasta em comum onde os projetos foram armazenados. 

obs.: não é necessário qualquer tipo de instalação 
------------------------------
## 🚀 Como Executar

   1. Por meio do terminal, entre na pasta comum dos dois projetos:

ex.: cd projetos_mvp


   2. Ainda no terminal, execute o comando abaixo:
docker compose up --build
------------------------------
## 🤝 Como Contribuir

Contribuições são sempre bem-vindas! Para contribuir:

   1. Faça um Fork do projeto.
   2. Crie uma Branch para sua funcionalidade (git checkout -b feature/nova-funcionalidade).
   3. Faça o Commit das suas alterações (git commit -m 'Adiciona nova funcionalidade').
   4. Faça o Push para a branch (git push origin feature/nova-funcionalidade).
   5. Abra um Pull Request.