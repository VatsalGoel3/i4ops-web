import { useEffect, useRef } from "react";
import "diff2html/bundles/css/diff2html.min.css";
import { Diff2HtmlUI } from "diff2html/lib/ui/js/diff2html-ui";

export default function DiffViewer({ diff }: { diff: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;

    ref.current.innerHTML = "";

    if (diff) {
      const ui = new Diff2HtmlUI(ref.current, diff, {
        drawFileList: false,
        outputFormat: "line-by-line", // or "side-by-side"
      });
      ui.draw();
    }
  }, [diff]);

  return (
    <div
      ref={ref}
      className="mt-4 border rounded p-4 max-h-96 overflow-auto text-sm"
    />
  );
}