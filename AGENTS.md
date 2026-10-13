# Agent rules
- Bank state lives in src/lib/bank.ts (useSyncExternalStore + localStorage); all mutations go through its functions, which throw Error on invalid input — keeps validation in one place.
- C++ OOP console program lives in cpp/ and is shown in-app via ?raw import — it is the separate C++ project logic, not part of the web runtime.
- vite.config.ts pre-bundles UI deps via optimizeDeps.include — prevents duplicate-React crashes when the dev server re-optimizes mid-session.
