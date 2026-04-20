import { Link } from "react-router-dom";
import { ReactNode } from "react";

interface DocPageProps {
  title: string;
  children: ReactNode;
}

const DocPage = ({ title, children }: DocPageProps) => {
  return (
    <main className="min-h-screen bg-white flex justify-center px-6 py-16">
      <article
        className="w-full max-w-[640px] text-black text-left"
        style={{ fontFamily: "'Times New Roman', Times, serif", fontSize: "11pt", lineHeight: 1.4 }}
      >
        <h1 className="italic font-normal mb-4" style={{ fontSize: "16pt" }}>{title}</h1>
        {children}
        <p className="mt-8">
          <Link to="/" className="underline text-black">home</Link>
        </p>
      </article>
    </main>
  );
};

export default DocPage;
