# Fournisseur AI Router pour OpenClaw

[English](README.md) | [Deutsch](README.de.md) | [Português](README.pt.md) | [Nederlands](README.nl.md)

Extension OpenClaw maintenue de façon indépendante pour [AI Router](https://ai-router.dev/fr). Elle configure la clé API, récupère avec authentification le catalogue de modèles disponible pour le compte et conserve une solution manuelle par identifiant de modèle.

Ce paquet n'est pas une extension officielle d'OpenClaw et n'implique aucun partenariat ni aucune recommandation.

## Prérequis

- OpenClaw `2026.7.1-2` ou une version plus récente de la série `2026.x`.
- Une version de Node.js prise en charge par OpenClaw.
- Une clé API appartenant à votre compte AI Router.

## Installation

Avant la première publication sur ClawHub, vérifiez puis installez l'archive générée depuis les sources :

```bash
npm ci
npm run validate
npm pack
openclaw plugins install npm-pack:./airouter-dev-openclaw-ai-router-0.1.0.tgz --force
openclaw plugins inspect ai-router --runtime --json
```

Après une publication ClawHub vérifiée :

```bash
openclaw plugins install clawhub:airouter-dev/openclaw-ai-router
```

## Configuration

Dans l'assistant OpenClaw, choisissez **AI Router API key**, ou fournissez la variable d'environnement au processus OpenClaw :

```bash
export AI_ROUTER_API_KEY="votre-cle-api"
```

Le catalogue n'est demandé qu'après la résolution d'une clé. Si la découverte est indisponible, ajoutez manuellement l'identifiant sous `models.providers.ai-router.models`. Les modèles inconnus utilisent uniquement des limites locales prudentes ; l'extension ne déduit ni prix, ni taille de contexte, ni capacité avancée.

## Sécurité

L'extension impose le point de terminaison HTTPS `https://api.ai-router.dev/v1`, délègue la requête de catalogue au mécanisme protégé d'OpenClaw et n'ajoute ni journalisation ni télémétrie. Conservez la clé dans le magasin d'identifiants OpenClaw ou dans l'environnement d'exécution, jamais dans Git.

Signalez les vulnérabilités de manière privée selon [SECURITY.md](SECURITY.md).

## Développement

```bash
npm ci
npm run validate
npm pack --dry-run
```

Licence : MIT.
