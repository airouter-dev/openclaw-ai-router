# AI Router-provider voor OpenClaw

[English](README.md) | [Deutsch](README.de.md) | [Français](README.fr.md) | [Português](README.pt.md)

Een onafhankelijk onderhouden OpenClaw-providerplugin voor [AI Router](https://ai-router.dev/nl). De plugin stelt de API-sleutel in, haalt met authenticatie de modelcatalogus voor het account op en ondersteunt handmatig ingestelde model-ID's als terugvaloptie.

Dit pakket is geen officiële OpenClaw-plugin en impliceert geen partnerschap, certificering of aanbeveling.

## Vereisten

- OpenClaw `2026.7.1-2` of nieuwer binnen de `2026.x`-reeks.
- Een door OpenClaw ondersteunde Node.js-versie.
- Een API-sleutel van uw eigen AI Router-account.

## Installatie

Zo controleert en installeert u een pakket vanuit de broncode:

```bash
npm ci
npm run validate
npm pack
openclaw plugins install npm-pack:./airouter-dev-openclaw-ai-router-0.1.2.tgz --force
openclaw plugins inspect ai-router --runtime --json
```

Installeer de geverifieerde ClawHub-publicatie:

```bash
openclaw plugins install clawhub:@airouter-dev/openclaw-ai-router
```

## Configuratie

Kies **AI Router API key** in de installatiewizard van OpenClaw, of lees de sleutel zonder schermuitvoer of opname in de shellgeschiedenis:

```bash
read -rsp "AI_ROUTER_API_KEY: " AI_ROUTER_API_KEY
printf '\n'
export AI_ROUTER_API_KEY
```

De modelcatalogus wordt pas opgehaald nadat een sleutel is gevonden. Als detectie niet beschikbaar is, voegt u het model-ID handmatig toe onder `models.providers.ai-router.models`. Onbekende modellen krijgen alleen voorzichtige lokale limieten; de plugin leidt geen prijzen, contextlimieten of geavanceerde mogelijkheden af.

## Beveiliging

De plugin gebruikt uitsluitend het vaste HTTPS-eindpunt `https://api.ai-router.dev/v1`, laat OpenClaw de beveiligde catalogusaanvraag uitvoeren en voegt geen logging of telemetrie toe. Bewaar API-sleutels in de credentialopslag van OpenClaw of in de runtimeomgeving, nooit in Git.

Meld kwetsbaarheden vertrouwelijk volgens [SECURITY.md](SECURITY.md).

## Ontwikkeling

```bash
npm ci
npm run validate
npm pack --dry-run
```

Licentie: MIT.
