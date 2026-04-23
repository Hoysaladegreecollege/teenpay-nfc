// Lightweight wrapper around @capacitor-community/nfc with a graceful
// browser fallback (mock detection) so the app runs in the Lovable preview.
//
// To enable real NFC in a Capacitor build, install:
//   npm i @capacitor-community/nfc @capacitor/core
// and ensure NFCReaderUsageDescription (iOS) + android.permission.NFC are set.

export type NfcSupport =
  | { state: "supported" }
  | { state: "unsupported"; reason: "no-plugin" | "no-hardware" | "web" }
  | { state: "disabled" }
  | { state: "denied" };

export type NfcTag = {
  id: string;
  type?: string;
  message?: string;
};

type NfcModule = {
  Nfc: {
    isSupported: () => Promise<{ supported: boolean }>;
    isEnabled: () => Promise<{ enabled: boolean }>;
    checkPermissions?: () => Promise<{ nfc: string }>;
    requestPermissions?: () => Promise<{ nfc: string }>;
    startScanSession: (opts?: { once?: boolean }) => Promise<void>;
    stopScanSession: () => Promise<void>;
    addListener: (
      event: "nfcTagScanned",
      cb: (event: { nfcTag: { id: number[] | string; type?: string } }) => void,
    ) => Promise<{ remove: () => Promise<void> }>;
  };
};

let cachedModule: NfcModule | null | undefined;

async function loadNfc(): Promise<NfcModule | null> {
  if (cachedModule !== undefined) return cachedModule;
  try {
    const pkg = ["@capacitor-community", "nfc"].join("/");
    // @ts-expect-error — optional native plugin, may not be installed in web preview
    const mod = (await import(/* @vite-ignore */ pkg)) as NfcModule;
    cachedModule = mod;
  } catch {
    cachedModule = null;
  }
  return cachedModule;
}

function isNativePlatform(): boolean {
  if (typeof window === "undefined") return false;
  // Capacitor sets this global when running natively
  return Boolean((window as unknown as { Capacitor?: { isNativePlatform?: () => boolean } })
    .Capacitor?.isNativePlatform?.());
}

export async function getNfcSupport(): Promise<NfcSupport> {
  if (typeof window === "undefined") return { state: "unsupported", reason: "web" };
  if (!isNativePlatform()) return { state: "unsupported", reason: "web" };

  const mod = await loadNfc();
  if (!mod) return { state: "unsupported", reason: "no-plugin" };

  try {
    const { supported } = await mod.Nfc.isSupported();
    if (!supported) return { state: "unsupported", reason: "no-hardware" };
    const { enabled } = await mod.Nfc.isEnabled();
    if (!enabled) return { state: "disabled" };
    if (mod.Nfc.checkPermissions) {
      const { nfc } = await mod.Nfc.checkPermissions();
      if (nfc === "denied") return { state: "denied" };
    }
    return { state: "supported" };
  } catch {
    return { state: "unsupported", reason: "no-plugin" };
  }
}

export async function requestNfcPermission(): Promise<boolean> {
  const mod = await loadNfc();
  if (!mod?.Nfc.requestPermissions) return true;
  try {
    const { nfc } = await mod.Nfc.requestPermissions();
    return nfc === "granted";
  } catch {
    return false;
  }
}

function bytesToHex(id: number[] | string): string {
  if (typeof id === "string") return id;
  return id.map((b) => b.toString(16).padStart(2, "0")).join(":").toUpperCase();
}

export type ScanHandle = { stop: () => Promise<void> };

/**
 * Start a scan session. Calls onTag once a tag is detected, then stops.
 * On web (or without the plugin) falls back to a mocked detection after ~2.2s.
 */
export async function startNfcScan(
  onTag: (tag: NfcTag) => void,
  onError: (err: string) => void,
): Promise<ScanHandle> {
  const mod = await loadNfc();

  if (!mod || !isNativePlatform()) {
    // Web fallback — mock detection
    const timer = window.setTimeout(() => {
      const ok = Math.random() > 0.15;
      if (ok) {
        const id = Array.from({ length: 7 }, () =>
          Math.floor(Math.random() * 256)
            .toString(16)
            .padStart(2, "0"),
        )
          .join(":")
          .toUpperCase();
        onTag({ id, type: "ISO14443A (mock)" });
      } else {
        onError("Couldn't read tag. Move closer and try again.");
      }
    }, 2200);
    return {
      stop: async () => window.clearTimeout(timer),
    };
  }

  try {
    const listener = await mod.Nfc.addListener("nfcTagScanned", async (event) => {
      const tag = event?.nfcTag;
      if (!tag) return;
      try {
        await mod.Nfc.stopScanSession();
      } catch {
        /* noop */
      }
      onTag({ id: bytesToHex(tag.id), type: tag.type });
    });
    await mod.Nfc.startScanSession({ once: true });
    return {
      stop: async () => {
        try {
          await mod.Nfc.stopScanSession();
        } catch {
          /* noop */
        }
        await listener.remove();
      },
    };
  } catch (e) {
    onError(e instanceof Error ? e.message : "NFC scan failed");
    return { stop: async () => {} };
  }
}
