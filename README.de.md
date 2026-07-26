# AI Router Provider für OpenClaw

[English](README.md) | [Français](README.fr.md) | [Português](README.pt.md) | [Nederlands](README.nl.md)

Ein unabhängig gepflegtes OpenClaw-Provider-Plugin für [AI Router](https://ai-router.dev/de). Es richtet den API-Schlüssel ein, ruft den für das Konto verfügbaren Modellkatalog authentifiziert ab und unterstützt manuell eingetragene Modell-IDs.

Dieses Paket ist kein offizielles OpenClaw-Plugin und stellt keine Partnerschaft oder Empfehlung dar.

## Voraussetzungen

- OpenClaw ab `2026.7.1-2` innerhalb der Versionen `2026.x`.
- Eine von OpenClaw unterstützte Node.js-Version.
- Ein API-Schlüssel aus dem eigenen AI-Router-Konto.

## Installation

So kann ein Paket aus dem Quellcode geprüft und installiert werden:

```bash
npm ci
npm run validate
npm pack
openclaw plugins install npm-pack:./airouter-dev-openclaw-ai-router-0.1.2.tgz --force
openclaw plugins inspect ai-router --runtime --json
```

Installation der verifizierten ClawHub-Veröffentlichung:

```bash
openclaw plugins install clawhub:@airouter-dev/openclaw-ai-router
```

## Konfiguration

Im OpenClaw-Einrichtungsdialog **AI Router API key** auswählen oder den Schlüssel ohne Bildschirmausgabe und Shell-Verlauf einlesen:

```bash
read -rsp "AI_ROUTER_API_KEY: " AI_ROUTER_API_KEY
printf '\n'
export AI_ROUTER_API_KEY
```

Der Modellkatalog wird erst nach dem Auflösen eines Schlüssels abgerufen. Falls der Abruf nicht möglich ist, kann eine Modell-ID unter `models.providers.ai-router.models` manuell eingetragen werden. Unbekannte Modelle erhalten nur konservative lokale Grenzwerte; daraus werden keine Preise, Kontextgrenzen oder erweiterten Fähigkeiten des Dienstes abgeleitet.

## Sicherheit

Das Plugin verwendet den festen HTTPS-Endpunkt `https://api.ai-router.dev/v1`, nutzt OpenClaws geschützte Katalogabfrage und fügt weder Protokollierung noch Telemetrie hinzu. API-Schlüssel gehören in den OpenClaw-Credential-Store oder in die Laufzeitumgebung, nicht in Git.

Sicherheitsprobleme bitte nach [SECURITY.md](SECURITY.md) vertraulich melden.

## Entwicklung

```bash
npm ci
npm run validate
npm pack --dry-run
```

Lizenz: MIT.
