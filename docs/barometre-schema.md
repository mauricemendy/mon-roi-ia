# Table des relevés — schéma

La table qui alimente le baromètre METRON. Elle vit dans le même Postgres
qu'Umami : un VPS, une base, deux usages.

## Ce qu'elle contient — et ce qu'elle ne contient pas

Un relevé décrit **une mesure**, pas une personne. Ni adresse, ni identifiant
de session, ni adresse IP, ni saisie libre. Ces lignes ne sont donc pas des
données personnelles, ce qui permet de publier les agrégats sans retraitement
et maintient le dispositif hors du champ du consentement.

**Cette propriété est une contrainte de conception, pas une intention.** Le
type `Releve` de `src/lib/collect.ts` n'accepte aucun champ libre. Toute
colonne ajoutée ici doit respecter la même règle.

## Schéma

```sql
create table releve (
  id                      bigserial primary key,
  cree_le                 timestamptz not null default now(),

  -- Conditions de mesure
  metier                  text        not null,
  effectif                integer     not null check (effectif between 1 and 10000),
  taux_horaire            numeric(8,2) not null check (taux_horaire >= 0),
  adoption                numeric(3,2) not null check (adoption between 0 and 1),
  semaines_travaillees    integer     not null,

  -- Résultat
  heures_declarees        numeric(6,2) not null,
  heures_liberees         numeric(6,2) not null,
  part_mesuree            numeric(5,2) not null,
  valeur_mensuelle_haute  integer     not null,
  valeur_mensuelle_basse  integer     not null,

  -- Une mesure express, ou affinée par quelqu'un qui connaît son terrain ?
  affine                  boolean     not null default false,
  version                 text        not null
);

-- Le baromètre interroge presque toujours par métier et par période.
create index releve_metier_date on releve (metier, cree_le desc);
```

## Requêtes du baromètre

Le potentiel médian par métier, sur les mesures affinées uniquement — celles
où quelqu'un a déclaré sa vraie répartition du temps :

```sql
select metier,
       count(*)                                                as n,
       percentile_cont(0.5) within group (order by part_mesuree) as part_mediane,
       percentile_cont(0.5) within group (order by heures_liberees) as heures_medianes
from releve
where affine
  and cree_le > now() - interval '6 months'
group by metier
having count(*) >= 20          -- ne rien publier sous un effectif défendable
order by part_mediane desc;
```

Le seuil `having` n'est pas cosmétique : publier une médiane sur cinq relevés
reproduirait exactement le défaut reproché à la validation terrain d'origine.

## Point d'entrée

`VITE_METRON_COLLECT_URL` reçoit un POST JSON dont le corps correspond au type
`Releve`. Deux montages possibles :

- **Insertion directe** (PostgREST, Supabase, ou une petite fonction) avec une
  politique en insertion seule. Un pas de moins dans la chaîne.
- **Webhook n8n**, si vous voulez valider ou enrichir avant d'insérer.

Dans les deux cas, prévoyez un garde-fou anti-spam : la clé est publique par
construction, puisqu'elle vit dans un bundle navigateur. Une limitation de débit
par IP côté reverse proxy suffit à ce niveau d'enjeu.

## Sauvegarde

**Avant le premier relevé.** L'audience se reperd sans gravité ; cette table,
non — c'est le seul actif que personne ne peut reconstituer.

```bash
pg_dump -Fc -t releve metron | \
  rclone rcat remote:metron/releve-$(date +%F).dump
```
