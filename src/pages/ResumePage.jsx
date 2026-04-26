import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Download } from "lucide-react";
import { platformApi } from "../api/platformApi";
import { useToast } from "../context/ToastContext";
import { formatDate } from "../utils/format";

export default function ResumePage() {
  const { username } = useParams();
  const toast = useToast();
  const [resume, setResume] = useState(null);

  useEffect(() => {
    platformApi
      .getResume(username)
      .then(setResume)
      .catch((error) => toast.error(error.message));
  }, [username, toast]);

  if (!resume) {
    return <p className="text-slate-600 dark:text-slate-300">Loading resume...</p>;
  }

  return (
    <section className="card-panel p-6">
      <h1 className="font-display text-3xl text-slate-900 dark:text-slate-100">Resume Showcase</h1>
      <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">Latest resume from @{username}</p>

      <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-900">
        <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">{resume.fileName}</p>
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">{resume.summary || "No summary"}</p>
        <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">Updated: {formatDate(resume.updatedAt)}</p>

        <a
          href={resume.fileUrl}
          target="_blank"
          rel="noreferrer"
          className="mt-4 inline-flex items-center gap-2 rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-500"
        >
          <Download size={15} /> Download Resume
        </a>
      </div>

      <Link to={`/profiles/${username}`} className="mt-5 inline-block text-sm font-semibold text-brand-700 hover:text-brand-600 dark:text-brand-300">
        Back to profile
      </Link>
    </section>
  );
}
