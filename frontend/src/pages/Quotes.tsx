import QuoteForm from './QuoteForm';
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

export default function Quotes() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-20">
        <div className="max-w-5xl mx-auto px-4">
          <QuoteForm />
        </div>
      </main>
      <Footer />
    </div>
  );
}
