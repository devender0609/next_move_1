export default function PricingPage() {
  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-semibold">Pricing</h1>
      <div className="grid md:grid-cols-2 gap-4">
        <div className="rounded-xl border p-6 space-y-2">
          <div className="text-lg font-medium">Free</div>
          <div className="text-slate-600">Try the decision flow and save limited history.</div>
          <ul className="list-disc pl-5 text-sm text-slate-700 space-y-1 mt-3">
            <li>Unlimited recommendations</li>
            <li>Save history (up to 50)</li>
            <li>Feedback learning</li>
          </ul>
        </div>

        <div className="rounded-xl border p-6 space-y-2">
          <div className="text-lg font-medium">Pro</div>
          <div className="text-slate-600">$8/month — deeper insights + advanced modes (coming soon).</div>
          <ul className="list-disc pl-5 text-sm text-slate-700 space-y-1 mt-3">
            <li>Unlimited history</li>
            <li>Weekly patterns</li>
            <li>Advanced categories (health/finance)</li>
          </ul>
          <div className="text-xs text-slate-500 pt-2">
            MVP note: You can launch without payments, then add Stripe in v1.1.
          </div>
        </div>
      </div>
    </div>
  );
}
