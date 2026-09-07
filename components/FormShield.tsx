"use client";

import Script from "next/script";
import { useCallback, useEffect, useId, useRef } from "react";
import { HONEYPOT_FIELD } from "@/lib/form-fields";

/**
 * Herkese açık formların istemci tarafı koruması.
 *
 * İki parça:
 *  - <FormShield/>  : görünmez honeypot alanı + (yapılandırılmışsa) Turnstile
 *  - useFillTimer() : formun doldurulma süresi (sunucu "çok hızlı" botu eler)
 *
 * Turnstile YALNIZCA NEXT_PUBLIC_TURNSTILE_SITE_KEY tanımlıysa devreye girer.
 * Tanımlı değilken hiçbir dış script yüklenmez; form aynen çalışır.
 */

const SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

export function useFillTimer() {
  const mountedAt = useRef<number>(Date.now());

  useEffect(() => {
    // Hidrasyon sonrası ve sayfa bfcache'ten geri geldiğinde sayacı tazele.
    mountedAt.current = Date.now();
    const onShow = (e: PageTransitionEvent) => {
      if (e.persisted) mountedAt.current = Date.now();
    };
    window.addEventListener("pageshow", onShow);
    return () => window.removeEventListener("pageshow", onShow);
  }, []);

  return useCallback(() => Date.now() - mountedAt.current, []);
}

export function FormShield() {
  const honeypotId = useId();

  return (
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

      {SITE_KEY && (
        <>
          <Script
            src="https://challenges.cloudflare.com/turnstile/v0/api.js"
            strategy="afterInteractive"
          />
          {/* Cloudflare bu div'i bulup form içine gizli jeton input'u ekler. */}
          <div
            className="cf-turnstile"
            data-sitekey={SITE_KEY}
            data-language="tr"
            data-size="flexible"
          />
        </>
      )}
    </>
  );
}
