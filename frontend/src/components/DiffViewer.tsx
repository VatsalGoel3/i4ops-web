import { Diff2Html } from "diff2html";
import "diff2html/bundles/css/diff2html.min.css";

export default function DiffViewer({ diff }: { diff: string }) {
    if (!diff) return null;
    const html = Diff2Html.getPrettyHTML(diff, {
        inputFormat: "diff",
        drawFileList: false,
    });
    return (
        <div
            className="mt-4 border rounded p-4 max-h-96 overflow-auto" 
            dangerouslySetInnerHTML={{ __html: html}} 
        />
    );
}