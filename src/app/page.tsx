import Hero from '@/components/Hero';
import Projects from '@/components/Projects';
import Skills from '@/components/Skills';
import Experience from '@/components/Experience';
import Blog from '@/components/Blog';
import Contact from '@/components/Contact';
import Footer from '@/components/Footer';
import StackedSections from '@/components/StackedSections';

export default function Home() {
  return (
    <>
      <main className="flex-grow">
        <StackedSections
          hero={<Hero />}
          sheet={<Projects />}
          sheetId="projects"
        />
        <Skills />
        <Experience />
        <Blog />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
