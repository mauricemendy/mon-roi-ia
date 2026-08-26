/**
 * Instrumentation — Umami auto-hébergé.
 *
 * Deux règles tiennent tout le module :
 *
 * 1. Inerte par défaut. Sans VITE_UMAMI_URL ni VITE_UMAMI_WEBSITE_ID, aucun
 *    script n'est chargé et aucune requête n'est émise. Le dépôt peut donc
 *    porter l'instrumentation avant que le serveur existe.
 *
 * 2. Rien d'identifiant. Les charges utiles ne transportent que des dimensions
 *    de mesure — métier, numéro d'étape, ordres de grandeur. Jamais d'adresse,
 *    de saisie libre ni d'identifiant. C'est ce qui maintient le dispositif
 *    dans les conditions d'exemption de consentement, et ce qui permet de
 *    publier les agrégats sans retraitement.
 */

const SERVER = import.meta.env.VITE_UMAMI_URL;
const WEBSITE_ID = import.meta.env.VITE_UMAMI_WEBSITE_ID;

/** Dimensions autorisées : pas de texte libre, pas d'identifiant. */
export type EventData = Record<string, string | number | boolean>;

declare global {
  interface Window {
    umami?: { track: (name: string, data?: EventData) => void };
  }
}

const configured = Boolean(SERVER && WEBSITE_ID);

// Les premiers événements peuvent survenir avant que le script soit prêt : on
// les met en attente plutôt que de les perdre. Le plafond évite qu'une file
// grossisse indéfiniment si le serveur est injoignable.
const QUEUE_MAX = 20;
let queue: Array<[string, EventData | undefined]> = [];
let injected = false;

function flush() {
  if (!window.umami) return;
  const pending = queue;
  queue = [];
  for (const [name, data] of pending) {
    try {
      window.umami.track(name, data);
    } catch {
      // Une mesure perdue ne doit jamais casser l'outil.
    }
  }
}

function inject() {
  if (injected || typeof document === 'undefined') return;
  injected = true;

  const el = document.createElement('script');
  el.async = true;
  el.defer = true;
  el.src = `${SERVER!.replace(/\/$/, '')}/script.js`;
  el.setAttribute('data-website-id', WEBSITE_ID!);
  el.addEventListener('load', flush);
  el.addEventListener('error', () => {
    // Bloqueur, serveur éteint, réseau : on abandonne proprement.
    queue = [];
  });
  document.head.appendChild(el);
}

/**
 * Enregistre un événement de mesure. Sans configuration, ne fait rien.
 */
export function track(name: string, data?: EventData) {
  if (!configured) return;

  inject();

  if (window.umami) {
    try {
      window.umami.track(name, data);
    } catch {
      /* ignoré volontairement */
    }
    return;
  }

  if (queue.length < QUEUE_MAX) queue.push([name, data]);
}

/** Exposé pour l'affichage d'un état dans l'interface, si un jour utile. */
export const analyticsEnabled = configured;
