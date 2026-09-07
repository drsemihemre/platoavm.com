"use client";

import { useCallback, useId, useRef } from "react";
import { HONEYPOT_FIELD } from "@/lib/form-fields";

/**
 * Herkese açık formların istemci tarafı koruması.
 *
 * useFormShield() üç şey döner:
 *   shield          – görünmez honeypot alanı + (yapılandırılmışsa) Turnstile kabı
 *   fillMs()        – formun doldurulma süresi (sunucu "çok hızlı" botu eler)
 *   resetChallenge()– gönderim sonrası jetonu tazeler (Turnstile jetonu TEK KULLANIMLIK)
 *
 * Turnstile YALNIZCA NEXT_PUBLIC_TURNSTILE_SITE_KEY tanımlıysa devreye girer;
 * tanımlı değilken hiçbir dış script yüklenmez ve form aynen çalışır.
 *
 * ÖNEMLİ TASARIM NOTU — neden örtük (implicit) render kullanılmıyor:
 * Cloudflare'ın api.js dosyası `.cf-turnstile` elemanlarını yalnızca KENDİ
 * yüklendiği anda tarar; sonradan DOM'a giren kapları izlemez. App Router'da
 * sayfaya site-içi bağlantıyla gelindiğinde veya "Yeni mesaj gönder" ile form
 * yeniden kurulduğunda widget hiç oluşmaz, jeton üretilmez ve sunucu formu
 * reddederdi. Bu yüzden kap bir callback ref ile izlenip widget AÇIKÇA
 * render/remove ediliyor.
 */

const SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;
const SCRIPT_SRC = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";

type TurnstileApi = {
  render: (el: HTMLElement, opts: Record<string, unknown>) => string;
  remove: (id: string) => void;
  reset: (id: string) => void;
};

declare global {
  interface Window {
    turnstile?: TurnstileApi;
  }
}

let scriptPromise: Promise<void> | null = null;

function loadTurnstile(): Promise<void> {
  if (typeof window === "undefined") return Promise.resolve();
  if (window.turnstile) return Promise.resolve();
  if (scriptPromise) return scriptPromise;

  scriptPromise = new Promise<void>((resolve, reject) => {
    const el = document.createElement("script");
    el.src = SCRIPT_SRC;
    el.async = true;
    el.defer = true;
    el.onload = () => resolve();
    el.onerror = () => {
      scriptPromise = null; // sonraki denemede yeniden yüklenebilsin
      reject(new Error("turnstile yuklenemedi"));
    };
    document.head.appendChild(el);
  });
  return scriptPromise;
}

export function useFormShield() {
  const honeypotId = useId();
  const mountedAt = useRef<number>(Date.now());
  const widgetId = useRef<string | null>(null);
  const node = useRef<HTMLDivElement | null>(null);

  // Kap DOM'a girdiğinde widget'ı oluştur, çıktığında temizle.
  const attachTurnstile = useCallback((el: HTMLDivElement | null) => {
    if (!SITE_KEY) return;

    if (!el) {
      if (widgetId.current && window.turnstile) {
        try {
          window.turnstile.remove(widgetId.current);
        } catch {
          /* widget zaten gitmiş olabilir */
        }
      }
      widgetId.current = null;
      node.current = null;
      return;
    }

    node.current = el;
    mountedAt.current = Date.now(); // form yeniden kuruldu, süre sayacı da tazelensin
    loadTurnstile()
      .then(() => {
        // Kap bu arada değiştiyse veya widget zaten varsa tekrar oluşturma.
        if (node.current !== el || widgetId.current || !window.turnstile) return;
        widgetId.current = window.turnstile.render(el, {
          sitekey: SITE_KEY,
          language: "tr",
          size: "flexible",
        });
      })
      .catch(() => {
        // Script yüklenemedi (ağ/engelleyici). Sunucu tarafı jetonsuz isteği
        // reddedecek ve ziyaretçiye telefon alternatifi gösterilecek.
      });
  }, []);

  const fillMs = useCallback(() => Date.now() - mountedAt.current, []);

  const resetChallenge = useCallback(() => {
    mountedAt.current = Date.now();
    if (widgetId.current && window.turnstile) {
      try {
        window.turnstile.reset(widgetId.current);
      } catch {
        /* yoksay */
      }
    }
  }, []);

  const shield = (
    <>
      {/*
        Honeypot: ekran dışında, klavye sırasının dışında ve ekran
        okuyuculardan gizli. Gerçek ziyaretçi dolduramaz; otomatik botlar
        "boş alan varsa doldur" mantığıyla buraya yazar.
      */}
      <div
        aria-hidden="true"
        style={{ position: "absolute", left: "-9999px", width: 1, height: 1, overflow: "hidden" }}
      >
        <label htmlFor={honeypotId}>Bu alanı boş bırakın</label>
        <input
          id={honeypotId}
          name={HONEYPOT_FIELD}
          type="text"
          tabIndex={-1}
          autoComplete="off"
          defaultValue=""
        />
      </div>

      {SITE_KEY && <div ref={attachTurnstile} />}
    </>
  );

  return { shield, fillMs, resetChallenge };
}
