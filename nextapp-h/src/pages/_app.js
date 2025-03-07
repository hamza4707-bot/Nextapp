import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/globals.css';
import { NextUIProvider } from "@nextui-org/react";

const theme = {
  className: "text-black",
};

export default function MyApp({ Component, pageProps }) {
  return (
    <NextUIProvider theme={theme}>
      <Component {...pageProps} />
    </NextUIProvider>
  );
}