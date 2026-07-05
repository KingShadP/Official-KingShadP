import { SITE } from "@/config/site.config";
import { HOME_SECTIONS } from "@/components/sections/registry";

/**
 * Home = ordered composition of registered sections, driven by
 * config/site.config.ts. Reordering or removing home sections is a
 * config edit, not a code change.
 */
export default function Home() {
  return (
    <>
      {SITE.home.sections.map((key) => {
        const Section = HOME_SECTIONS[key];
        return <Section key={key} />;
      })}
    </>
  );
}
