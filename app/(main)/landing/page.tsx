import Navbar from "@/ui/Navbar";
import Image from "next/image";

export default function LandingPage() {
  return (
    <div className="div-main animate-float-up">
      <div className="left-panel">
        <h1 className="heading-primary">Access your documents</h1>
        <h1 className="colored-heading-primary">Anytime, Anywhere</h1>
      </div>
      <div className="right-panel mt-5">
        <Image
          src="/tray_docs.png"
          alt="Dashboard"
          width={700}
          height={960}
          priority
          sizes="(max-width: 960px) 100vw, 50vw"
          className="w-full h-auto max-h-[55vh] sm:max-h-[60vh] lg:max-h-[70vh]"
        />
      </div>
    </div>
  );
}
