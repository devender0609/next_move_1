import Link from "next/link";

export default function AppHome() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">App</h2>
      <div className="flex gap-3 flex-wrap">
        <Link className="rounded-lg bg-slate-900 text-white px-4 py-2" href="/app/decide">
          New Decision
        </Link>
        <Link className="rounded-lg border px-4 py-2" href="/app/history">
          History
        </Link>
        <Link className="rounded-lg border px-4 py-2" href="/app/login">
          Login / Logout
        </Link>
      </div>
      <p className="text-slate-600">
        Start with a decision. Your history will appear once you log in and save results.
      </p>
    </div>
  );
}
