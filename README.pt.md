# Provider AI Router para OpenClaw

[English](README.md) | [Deutsch](README.de.md) | [Français](README.fr.md) | [Nederlands](README.nl.md)

Plugin de provider para OpenClaw, mantido de forma independente, para o [AI Router](https://ai-router.dev/pt). Ele configura a chave de API, consulta com autenticação o catálogo de modelos disponível para a conta e mantém uma alternativa por ID de modelo configurado manualmente.

Este pacote não é um plugin oficial do OpenClaw e não representa parceria, certificação ou recomendação.

## Requisitos

- OpenClaw `2026.7.1-2` ou uma versão posterior da série `2026.x`.
- Uma versão do Node.js compatível com o OpenClaw.
- Uma chave de API da sua própria conta do AI Router.

## Instalação

Antes da primeira publicação no ClawHub, valide e instale o pacote gerado a partir do código-fonte:

```bash
npm ci
npm run validate
npm pack
openclaw plugins install npm-pack:./airouter-dev-openclaw-ai-router-0.1.0.tgz --force
openclaw plugins inspect ai-router --runtime --json
```

Após uma publicação verificada no ClawHub:

```bash
openclaw plugins install clawhub:airouter-dev/openclaw-ai-router
```

## Configuração

No assistente do OpenClaw, selecione **AI Router API key** ou forneça a variável de ambiente ao processo do OpenClaw:

```bash
export AI_ROUTER_API_KEY="sua-chave"
```

O catálogo só é consultado depois que uma credencial é resolvida. Se a descoberta estiver indisponível, adicione o ID em `models.providers.ai-router.models`. Modelos desconhecidos recebem apenas limites locais conservadores; o plugin não deduz preço, janela de contexto ou recursos avançados.

## Segurança

O plugin fixa o endpoint HTTPS `https://api.ai-router.dev/v1`, delega a consulta do catálogo ao mecanismo protegido do OpenClaw e não adiciona logs nem telemetria. Guarde a chave no armazenamento de credenciais do OpenClaw ou no ambiente de execução, nunca no Git.

Relate vulnerabilidades em privado conforme [SECURITY.md](SECURITY.md).

## Desenvolvimento

```bash
npm ci
npm run validate
npm pack --dry-run
```

Licença: MIT.
