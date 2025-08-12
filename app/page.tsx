import { CurvedArrowLanding } from "@/components/curved-arrow-landing";
import { CurvedArrowDemo } from "@/components/curved-arrow-demo";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <main className="">
        <CurvedArrowLanding />
        <section id="demo">
          <CurvedArrowDemo />
        </section>
      </main>
    </div>
  );
}
