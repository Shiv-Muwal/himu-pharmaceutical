import { useEffect, useState } from "react";
import { Download, Share, X } from "lucide-react";
import { BrandLogo } from "@/components/ui/brand-logo";

const DISMISS_KEY = "himu-install-dismissed";

function isStandalone() {
  if (typeof window === "undefined") return false;
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    window.navigator.standalone === true
  );
}

function isIos() {
  if (typeof navigator === "undefined") return false;
  return /iphone|ipad|ipod/i.test(navigator.userAgent);
}

export function InstallPrompt() {
  const [deferred, setDeferred] = useState(null);
  const [visible, setVisible] = useState(false);
  const [iosHint, setIosHint] = useState(false);

  useEffect(() => {
    if (isStandalone()) return undefined;
    if (sessionStorage.getItem(DISMISS_KEY) === "1") return undefined;

    const onBeforeInstall = (e) => {
      e.preventDefault();
      setDeferred(e);
      setVisible(true);
    };
    window.addEventListener("beforeinstallprompt", onBeforeInstall);

    const timer = setTimeout(() => {
      if (isIos()) {
        setIosHint(true);
        setVisible(true);
      }
    }, 4500);

    return () => {
      window.removeEventListener("beforeinstallprompt", onBeforeInstall);
      clearTimeout(timer);
    };
  }, []);

  const dismiss = () => {
    setVisible(false);
    setIosHint(false);
    sessionStorage.setItem(DISMISS_KEY, "1");
  };

  const install = async () => {
    if (!deferred) return;
    deferred.prompt();
    try {
      await deferred.userChoice;
    } catch {
      // ignore
    }
    setDeferred(null);
    dismiss();
  };

  if (!visible) return null;

  return (
    <div
      className="fixed inset-x-0 z-[90] px-3 md:hidden"
      style={{ bottom: "max(4.75rem, calc(3.75rem + env(safe-area-inset-bottom)))" }}
    >
      <div className="mx-auto flex max-w-md items-center gap-3 rounded-2xl border border-primary/15 bg-[#eef8cd]/95 p-3 shadow-[0_16px_40px_rgba(255, 197, 170,0.2)] backdrop-blur-md">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-[var(--c-lime)] shadow-sm">
          <BrandLogo className="h-8 w-10" priority />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-bold text-ink-accent">Install HIMU App</p>
          <p className="text-[11px] text-muted-foreground">
            {iosHint
              ? "Tap Share, then Add to Home Screen"
              : "Open like an app — faster shopping on your phone"}
          </p>
        </div>
        {iosHint ? (
          <button
            type="button"
            onClick={dismiss}
            className="inline-flex h-9 items-center gap-1 rounded-xl bg-primary px-3 text-xs font-bold text-primary-foreground"
          >
            <Share className="h-3.5 w-3.5" />
            OK
          </button>
        ) : (
          <button
            type="button"
            onClick={install}
            className="inline-flex h-9 items-center gap-1 rounded-xl bg-primary px-3 text-xs font-bold text-primary-foreground"
          >
            <Download className="h-3.5 w-3.5" />
            Install
          </button>
        )}
        <button
          type="button"
          onClick={dismiss}
          className="rounded-lg p-1.5 text-muted-foreground hover:bg-primary/10"
          aria-label="Dismiss"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
