import React from 'react';

/** Prevent an unexpected page error from taking down the signed-in workspace. */
export default class ErrorBoundary extends React.Component {
  state = { hasError: false };

  static getDerivedStateFromError() { return { hasError: true }; }

  componentDidCatch(error) {
    console.error('CyberNEX page error:', error);
  }

  render() {
    if (!this.state.hasError) return this.props.children;
    return (
      <main className="min-h-screen grid place-items-center bg-slate-950 p-6 text-slate-100">
        <section className="max-w-lg border border-slate-700 bg-slate-900 p-8 shadow-2xl">
          <p className="text-xs font-bold tracking-[.2em] text-cyan-400">CYBERNEX / RECOVERY</p>
          <h1 className="mt-3 text-2xl font-semibold text-white">This workspace view could not load.</h1>
          <p className="mt-3 text-sm leading-6 text-slate-300">Your locally stored learning data is safe. Refresh to try again, or return to the dashboard.</p>
          <div className="mt-6 flex gap-3"><button className="btn btn-primary" onClick={() => window.location.reload()}>Refresh view</button><a className="btn btn-outline text-slate-200" href="/">Dashboard</a></div>
        </section>
      </main>
    );
  }
}
