import { Helmet } from "@modern-js/runtime/head";
import { CurvedArrowLanding } from "@/components/curved-arrow-landing";
import { CurvedArrowDemo } from "@/components/curved-arrow-demo";

const Index = () => (
  <div className="">
    <Helmet title="CurvedArrow — Dynamic SVG arrows for React">
      <link
        rel="icon"
        type="image/x-icon"
        href="https://lf3-static.bytednsdoc.com/obj/eden-cn/uhbfnupenuhf/favicon.ico"
      />
    </Helmet>
    <main>
      <div className="min-h-screen bg-background">
        <main className="">
          <CurvedArrowLanding />
          <section id="demo">
            <CurvedArrowDemo />
          </section>
        </main>
      </div>
    </main>
  </div>
);

export default Index;
