"use client";

import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import SignaturePadLib from "signature_pad";
import { Eraser } from "lucide-react";

export interface SignatureFieldHandle {
  clear: () => void;
  isEmpty: () => boolean;
  toDataURL: () => string | null;
}

interface SignatureFieldProps {
  /** Called with a PNG data URL on each stroke, or null when cleared/empty. */
  onChange?: (dataUrl: string | null) => void;
  label?: string;
  height?: number;
}

/**
 * Real drawn signature on a <canvas> (finger on touch / mouse on desktop).
 * Hi-DPI aware and resize-safe. White bg so the PNG embeds cleanly into PDFs.
 */
export const SignatureField = forwardRef<
  SignatureFieldHandle,
  SignatureFieldProps
>(function SignatureField({ onChange, label = "Signature", height = 180 }, ref) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const padRef = useRef<SignaturePadLib | null>(null);
  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;
  const [empty, setEmpty] = useState(true);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const pad = new SignaturePadLib(canvas, {
      penColor: "#0A0A0B",
      backgroundColor: "#FFFFFF",
      minWidth: 0.8,
      maxWidth: 2.4,
    });
    padRef.current = pad;

    const resize = () => {
      const ratio = Math.max(window.devicePixelRatio || 1, 1);
      const rect = canvas.getBoundingClientRect();
      if (rect.width === 0) return;
      const data = pad.toData();
      canvas.width = rect.width * ratio;
      canvas.height = rect.height * ratio;
      const ctx = canvas.getContext("2d");
      ctx?.scale(ratio, ratio);
      pad.clear();
      if (data.length) pad.fromData(data);
      setEmpty(pad.isEmpty());
    };

    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    const handleEnd = () => {
      const isEmpty = pad.isEmpty();
      setEmpty(isEmpty);
      onChangeRef.current?.(isEmpty ? null : pad.toDataURL("image/png"));
    };
    pad.addEventListener("endStroke", handleEnd);

    return () => {
      ro.disconnect();
      pad.removeEventListener("endStroke", handleEnd);
      pad.off();
      padRef.current = null;
    };
  }, []);

  const clear = () => {
    padRef.current?.clear();
    setEmpty(true);
    onChangeRef.current?.(null);
  };

  useImperativeHandle(ref, () => ({
    clear,
    isEmpty: () => padRef.current?.isEmpty() ?? true,
    toDataURL: () => {
      const pad = padRef.current;
      return pad && !pad.isEmpty() ? pad.toDataURL("image/png") : null;
    },
  }));

  return (
    <div>
      <div className="relative overflow-hidden rounded-md border border-border bg-white">
        <canvas
          ref={canvasRef}
          style={{ height, touchAction: "none" }}
          className="block w-full cursor-crosshair"
          aria-label={label}
        />
        {empty && (
          <span className="pointer-events-none absolute inset-0 flex items-center justify-center text-sm text-black/30">
            Sign here with your finger or mouse
          </span>
        )}
      </div>
      <button
        type="button"
        onClick={clear}
        className="mt-2 inline-flex items-center gap-1.5 text-xs font-medium text-muted transition-colors hover:text-foreground"
      >
        <Eraser className="h-3.5 w-3.5" />
        Clear
      </button>
    </div>
  );
});
