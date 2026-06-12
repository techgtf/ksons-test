import Footer from "@/src/website/components/common/Footer";
import Header from "@/src/website/components/common/Header";
import SmoothScroller from "@/src/website/components/SmoothScroller";
import { blauerNue } from "../fonts";
import { LightboxProvider } from "@/src/website/context/LightboxContext";
import { ContactDataProvider } from "@/src/website/context/ContactContext";
import CustomCursor from "@/src/website/components/common/CustomCursor";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <LightboxProvider>
      <ContactDataProvider>
        <main className={"main" + blauerNue} id="website-main-layout">
          <CustomCursor />
          <Header />
          <SmoothScroller>
            {children}
            <Footer />
          </SmoothScroller>
          <div id="global-ui-root" />
        </main>
      </ContactDataProvider>
    </LightboxProvider>
  );
}
