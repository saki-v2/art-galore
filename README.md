# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

## Demo checkout

Run the existing data server in a separate terminal with `npm run server`, then run the frontend with `npm run dev`. If port 3000 is already serving `db.json`, keep that server and do not start a second one.

Add artwork to the cart and choose **Proceed to checkout**. Use sample contact details. Checkout rechecks the current artwork prices and availability, saves a multi-item order to the `orders` collection in `db.json`, and clears purchased cart items only after the save is confirmed. A stable order reference is reused when retrying an uncertain save, including after a refresh when session storage is available.

This is a local demo: no payment, email, delivery, pickup, or inventory reservation occurs. JSON Server exposes its records publicly to anyone who can reach it; do not enter real personal details. Real commerce needs a secure backend with transactional stock/payment handling. Existing demo orders and reviews are preserved.
