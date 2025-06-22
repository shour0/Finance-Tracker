
import Hero from "@/components/Hero";
import Navbar from "@/components/Navbar";

export default function Home() {
  return (
   <main className="relative flex justify-center items-center py-3 px-5">
    <div className="max-w-[140rem] w-full">
      <Navbar />
      <Hero />
    </div>
   </main>
  );
}
