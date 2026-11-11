# Contrat de capture

Ce que le dépôt suppose du dispositif de capture, et ce qu'il n'en suppose pas.
Écrit pour que la prochaine session ne réinvente pas une architecture.

## La décision

**Brevo détient la liste et envoie. Le membership Ghost reste éteint.**

Brevo porte déjà le scoring, le CRM et les séquences. Sur son palier gratuit :
300 emails par jour, contacts illimités, automatisations, transactionnel.
Ghost auto-hébergé ne peut envoyer qu'à travers Mailgun, dont le palier gratuit
plafonne à 100 emails par jour — trois fois moins que l'outil déjà en place.
Il n'y a donc pas d'arbitrage : ajouter Mailgun coûterait un abonnement et une
seconde liste pour un quota inférieur.

Le dernier argument en faveur de Ghost était son double opt-in gratuit. Brevo
en fait autant, gratuitement, et trace le consentement dans ses journaux
d'événements. L'avantage disparaît ; ne resterait qu'une base de membres qui ne
reçoit rien et diverge de Brevo à la première désinscription.

**Une seule chose renverserait cette décision :** du contenu réservé aux
abonnés, c'est-à-dire un article visible seulement après connexion. Ghost le
fait nativement, Brevo non. Tant que ce n'est pas au programme, le membership
reste éteint.

## Un seul Worker

Toutes les captures publiques passent par **une seule route**, qui reçoit un
champ `source` et route vers la bonne liste. Une clé, un déploiement, un point
de vérification. Ne pas créer un Worker par outil.

**Worker en entrée, n8n en aval.** Le Worker isole la clé, tient la latence et
évite d'exposer n8n. n8n reste pour l'orchestration *après* la capture : alerte
sur lead chaud, enrichissement, notifications. Deux chemins vers Brevo seraient
une redondance à purger, pas une redondance de sécurité.

## Double opt-in

Le Worker appelle **`POST /v3/contacts/doubleOptinConfirmation`**, et non
`POST /contacts`. Le contact n'entre dans la liste qu'après le clic : c'est ce
qui constitue la trace de consentement.

L'appel attend l'email, `includeListIds`, une `redirectionUrl` et l'identifiant
d'un gabarit DOI. Ce gabarit se crée à part dans Marketing → Templates et **ne
peut pas personnaliser par attributs** : ils ne sont pas encore posés au moment
de l'envoi.

> **À vérifier avant d'écrire le Worker.** Les attributs passés dans la charge
> utile sont-ils bien persistés à la confirmation ? Si non, METRON ne capte
> qu'une adresse nue et toute la qualification est perdue — ce qui viderait
> l'opération de son intérêt. Ce point n'est pas tranché ici, dans aucun sens.

L'alternative documentée par Brevo — liste temporaire plus automatisation —
fonctionne aussi, mais ajoute un état intermédiaire à surveiller.

Conséquence sur l'interface : après envoi, on affiche « vérifiez votre boîte »,
jamais « inscrit ». Ce serait faux.

## Contrat d'attributs

Un socle commun à tous les outils, puis des attributs spécifiques. Sans socle,
aucune séquence ne peut segmenter sur autre chose que l'outil d'origine.

### Socle

| Attribut | Origine | Note |
|---|---|---|
| `SOURCE` | champ `source` de la charge utile | `metron`, `matrice`, `blog` |
| `DATE_OPTIN` | **posée par le Worker** | jamais par le client : l'horloge du navigateur n'est pas une source de vérité pour un consentement |
| `TRANCHE_EFFECTIF` | voir ci-dessous | bornes définies une seule fois |

### Tranches d'effectif

`1` · `2-4` · `5-9` · `10-19` · `20-49` · `50-199` · `200+`

Définies dans `src/lib/subscribe.ts`, fonction `trancheEffectif`. METRON connaît
l'effectif exact et le range ; d'autres outils demandent directement la tranche.
**Les options de ces formulaires doivent reprendre ces bornes exactes**, sinon
le socle n'est commun que de nom.

### Spécifique METRON

| Attribut | Valeur |
|---|---|
| `METIER` | clé du métier mesuré |
| `PART_MESUREE` | part du temps déclaré identifiée comme libérable, en % |
| `AFFINE` | la personne a-t-elle ajusté sa répartition du temps ? |

`AFFINE` est le meilleur signal de qualification de l'outil : il distingue le
curieux de quelqu'un qui connaît assez son terrain pour corriger les valeurs de
référence.

## Une règle à ne pas enfreindre

**Ne jamais corréler un relevé et une inscription.**

La table des relevés (`docs/barometre-schema.md`) ne contient aucun identifiant,
ce qui la place hors du champ des données personnelles et permet de publier les
agrégats sans retraitement. Ajouter un identifiant partagé pour « savoir qui a
mesuré quoi » paraîtra anodin et détruirait cette propriété d'un coup.

Les deux flux sont volontairement disjoints : le relevé part sans retour et sans
identité, l'inscription part avec une adresse et sa qualification.

## Ce qui n'est pas encore réglé

**L'origine CORS.** METRON vit encore sur `mauricemendy.github.io/mon-roi-ia`.
Le Worker n'a donc pas d'origine stable à autoriser. `VITE_METRON_SUBSCRIBE_URL`
reste vide jusqu'à la migration — le bloc d'inscription n'apparaît pas, et rien
n'est émis.

**METRON n'est pas la matrice de décision.** La spécification d'août décrit la
matrice : famille recommandée, tranche de taille. Le motif se transpose — Worker,
Brevo, DOI, socle d'attributs — mais ce sont deux outils, deux tunnels et deux
jeux d'attributs spécifiques. Écrit ici pour ne pas être supposé.
