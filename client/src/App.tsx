import { Outlet, useNavigationType, useLocation } from "react-router-dom";
import { useEffect } from "react";
import Header from "./components/Header";
import { useOnlineToast } from "./hooks/useOnlineToast";
import { useI18n } from "./i18n";

export default function App() {
  const location = useLocation();
  const navType = useNavigationType();
  useOnlineToast();
  const { t } = useI18n();

  useEffect(() => {
    if (navType !== "POP") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [location, navType]);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2">
        Skip to content
      </a>
      <Header />
      <main id="main" role="main" className="mx-auto max-w-5xl px-4 py-6">
        <Outlet />
      </main>
      <footer className="border-t border-border bg-background/80">
        <div className="mx-auto flex max-w-5xl items-center justify-center px-4 py-4 text-sm text-muted-foreground">
          <span>
            © {new Date().getFullYear()} {t("appTitle")}. {t("copyright")}
          </span>
        </div>
      </footer>
    </div>
  );
}

