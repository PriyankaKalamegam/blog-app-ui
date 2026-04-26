import { useMemo } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Copy } from "lucide-react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";

function headingId(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export default function MarkdownRenderer({ content }) {
  const components = useMemo(
    () => ({
      h1: ({ children }) => {
        const id = headingId(String(children));
        return (
          <h1 id={id} className="mt-8 font-display text-3xl font-semibold text-slate-900 dark:text-slate-100">
            {children}
          </h1>
        );
      },
      h2: ({ children }) => {
        const id = headingId(String(children));
        return (
          <h2 id={id} className="mt-7 font-display text-2xl font-semibold text-slate-900 dark:text-slate-100">
            {children}
          </h2>
        );
      },
      h3: ({ children }) => {
        const id = headingId(String(children));
        return (
          <h3 id={id} className="mt-6 font-display text-xl font-semibold text-slate-900 dark:text-slate-100">
            {children}
          </h3>
        );
      },
      p: ({ children }) => (
        <p className="mt-4 leading-7 text-slate-700 dark:text-slate-200">{children}</p>
      ),
      code: ({ inline, className, children }) => {
        const language = className?.replace("language-", "") || "javascript";
        const codeText = String(children).replace(/\n$/, "");

        if (inline) {
          return (
            <code className="rounded bg-slate-100 px-1.5 py-0.5 font-mono text-sm text-brand-700 dark:bg-slate-800 dark:text-brand-300">
              {children}
            </code>
          );
        }

        return (
          <div className="relative mt-4">
            <button
              type="button"
              onClick={() => navigator.clipboard.writeText(codeText)}
              className="absolute right-2 top-2 inline-flex items-center gap-1 rounded border border-slate-600 bg-slate-900 px-2 py-1 text-xs text-slate-200 transition hover:border-brand-400"
            >
              <Copy size={12} /> Copy
            </button>
            <SyntaxHighlighter language={language} style={oneDark} customStyle={{ margin: 0, borderRadius: 12 }}>
              {codeText}
            </SyntaxHighlighter>
          </div>
        );
      }
    }),
    []
  );

  return (
    <div className="markdown-body">
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
        {content || ""}
      </ReactMarkdown>
    </div>
  );
}
