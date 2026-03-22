import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Protect Yourself",
  description:
    "Evidence-based steps to reduce your exposure to particulate matter and support your body's natural defenses. Every recommendation is backed by peer-reviewed research.",
};

function Source({ href, label }: { href: string; label: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="text-primary hover:underline"
    >
      {label}
    </a>
  );
}

function Recommendation({
  title,
  dosage,
  children,
  sources,
}: {
  title: string;
  dosage?: string;
  children: React.ReactNode;
  sources: { label: string; href: string }[];
}) {
  return (
    <div className="rounded-lg border border-border p-5">
      <div className="flex items-start justify-between gap-4">
        <h3 className="text-sm font-semibold">{title}</h3>
        {dosage && (
          <span className="shrink-0 text-[11px] font-medium px-2.5 py-1 rounded-full bg-primary/10 text-primary">
            {dosage}
          </span>
        )}
      </div>
      <div className="mt-2 text-sm text-muted-foreground leading-relaxed">
        {children}
      </div>
      <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1">
        {sources.map((s) => (
          <span key={s.href} className="text-[11px]">
            <Source href={s.href} label={s.label} />
          </span>
        ))}
      </div>
    </div>
  );
}

export default function ProtectYourselfPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <Link
        href="/learn"
        className="text-sm text-muted-foreground hover:text-foreground"
      >
        &larr; Back to Learn
      </Link>

      <h1 className="mt-6 text-3xl font-bold">Protect Yourself</h1>
      <p className="mt-4 text-muted-foreground leading-relaxed">
        Practical, evidence-based steps to reduce your exposure to airborne
        particulate matter and support your body&apos;s natural detoxification
        pathways. Every recommendation below is backed by peer-reviewed research.
        This is not medical advice &mdash; consult your healthcare provider
        before starting any supplement.
      </p>

      {/* ---- TOP TIER ---- */}
      <section className="mt-10">
        <h2 className="text-xl font-bold border-b border-border pb-2">
          Top Tier &mdash; Strongest Evidence
        </h2>
        <div className="mt-4 space-y-4">
          <Recommendation
            title="NAC (N-Acetyl Cysteine)"
            dosage="600-1,800 mg/day"
            sources={[
              {
                label: "PMC: NAC in Chronic Respiratory Diseases",
                href: "https://pmc.ncbi.nlm.nih.gov/articles/PMC10526097/",
              },
              {
                label: "PMC: NAC as Metal Chelator",
                href: "https://link.springer.com/chapter/10.1007/978-981-10-5311-5_10",
              },
              {
                label: "PMC: NAC and Methylmercury Excretion",
                href: "https://pmc.ncbi.nlm.nih.gov/articles/PMC1533084/",
              },
              {
                label: "PMC: NAC Safety at High Doses",
                href: "https://pmc.ncbi.nlm.nih.gov/articles/PMC7892733/",
              },
            ]}
          >
            The precursor to glutathione, your body&apos;s master antioxidant.
            NAC has direct metal-chelating ability via its thiol group and
            protects the respiratory system. 33 animal studies showed it chelates
            mercury, lead, cadmium, and arsenic. 15 human studies reported no
            significant adverse effects and no depletion of essential minerals.
            In mice, oral NAC accelerated urinary methylmercury excretion to
            47-54% over 48 hours vs 4-10% in controls. Also established for
            chronic respiratory disease support and reducing oxidative stress
            from air pollution exposure.
          </Recommendation>

          <Recommendation
            title="Modified Citrus Pectin"
            dosage="15 g/day in divided doses"
            sources={[
              {
                label: "PubMed: MCP Increases Urinary Metal Excretion",
                href: "https://pubmed.ncbi.nlm.nih.gov/16835878/",
              },
              {
                label: "PubMed: MCP for Lead in Children",
                href: "https://pubmed.ncbi.nlm.nih.gov/18616067/",
              },
              {
                label: "PubMed: MCP/Alginates Case Reports",
                href: "https://pubmed.ncbi.nlm.nih.gov/18219211/",
              },
              {
                label: "PMC: Pleiotropic Effects of MCP",
                href: "https://pmc.ncbi.nlm.nih.gov/articles/PMC6893732/",
              },
            ]}
          >
            A modified form of pectin from citrus peels, broken down for better
            absorption. Pilot trials showed a 560% increase in lead excretion,
            150% increase in cadmium excretion, and 130% increase in arsenic
            excretion via urine. A study in children with lead toxicity found
            15g/day was effective with no negative side effects. Importantly, it
            did NOT increase loss of essential minerals (calcium, magnesium,
            zinc, selenium, iron) &mdash; suggesting selective binding of toxic
            metals over beneficial ones.
          </Recommendation>

          <Recommendation
            title="Omega-3 Fatty Acids (EPA/DHA)"
            dosage="1,000-3,000 mg EPA+DHA/day"
            sources={[
              {
                label: "EPA: Omega-3 and Air Pollution Protection",
                href: "https://www.epa.gov/sciencematters/protecting-your-health-air-pollution-diets-rich-omega-3-fatty-acids",
              },
              {
                label: "PMC: Omega-3 Attenuates PM2.5 Lung Injury",
                href: "https://pmc.ncbi.nlm.nih.gov/articles/PMC9140442/",
              },
              {
                label: "ACS: Omega-3 Modifies COPD Risk from Air Pollution",
                href: "https://pubs.acs.org/doi/10.1021/envhealth.4c00198",
              },
            ]}
          >
            The EPA itself has published on this. Data from the UK Biobank
            showed participants with high circulating omega-3 and air pollution
            exposure had a 35% lower risk of developing COPD. Animal studies
            confirmed oral DHA and EPA alleviated lung lesions and restored
            normal inflammatory cytokine levels in PM2.5-exposed mice.
            Vegetarian sources: algae-based EPA/DHA supplements go straight to
            the source (fish get their omega-3s from algae). Also found in fatty
            fish, flaxseed, chia seeds, and walnuts.
          </Recommendation>

          <Recommendation
            title="Vitamin C"
            dosage="500-1,000 mg/day in divided doses"
            sources={[
              {
                label: "ScienceDirect: Vitamin C Attenuates PM2.5 Lung Inflammation (2025)",
                href: "https://www.sciencedirect.com/science/article/pii/S0160412025006804",
              },
              {
                label: "European Respiratory Journal: Antioxidants and Air Pollution",
                href: "https://publications.ersnet.org/content/erj/31/1/179",
              },
              {
                label: "PubMed: Vitamin C and Quercetin vs PM Oxidative Damage",
                href: "https://pubmed.ncbi.nlm.nih.gov/26386771/",
              },
            ]}
          >
            A water-soluble antioxidant concentrated in the lining fluid of your
            lungs &mdash; the first line of defense against inhaled oxidants. A
            2025 study from the University of Technology Sydney found vitamin C
            significantly reduces lung inflammation and mitochondrial damage
            caused by everyday PM2.5 exposure. Pre-treatment reduced harmful
            inflammation, prevented oxidative stress-induced cell damage, and
            protected mitochondria. Found naturally in citrus fruits, bell
            peppers, strawberries, broccoli, and kiwi.
          </Recommendation>
        </div>
      </section>

      {/* ---- STRONG SUPPORT ---- */}
      <section className="mt-10">
        <h2 className="text-xl font-bold border-b border-border pb-2">
          Strong Support
        </h2>
        <div className="mt-4 space-y-4">
          <Recommendation
            title="HEPA Air Filtration"
            sources={[
              {
                label: "PMC: HEPA Efficacy on Indoor PM2.5",
                href: "https://pmc.ncbi.nlm.nih.gov/articles/PMC9516965/",
              },
              {
                label: "CDC: Real-World HEPA Air Cleaner Effectiveness",
                href: "https://stacks.cdc.gov/view/cdc/154379/cdc_154379_DS1.pdf",
              },
              {
                label: "EPA: DIY Air Cleaners for Wildfire Smoke",
                href: "https://www.epa.gov/air-research/research-diy-air-cleaners-reduce-wildfire-smoke-indoors",
              },
            ]}
          >
            HEPA purifiers reduce indoor PM2.5 by 45-78%. In the room where
            the purifier runs, studies measured ~79% reduction. A budget
            alternative: the Corsi-Rosenthal box (4 MERV-13 furnace filters
            taped to a box fan, ~$65) achieved a 92% PM2.5 reduction and
            outperformed many commercial units. Keep windows closed during high
            pollution events. Look for &quot;True HEPA&quot; &mdash; not
            &quot;HEPA-type&quot; which has lower filtration standards.
          </Recommendation>

          <Recommendation
            title="Sauna (Infrared or Traditional)"
            dosage="15-30 min, 2-4x/week"
            sources={[
              {
                label: "PMC: Heavy Metals in Sweat &mdash; Systematic Review",
                href: "https://pmc.ncbi.nlm.nih.gov/articles/PMC3312275/",
              },
              {
                label: "PMC: Infrared Sauna and Inorganic Ion Excretion",
                href: "https://pmc.ncbi.nlm.nih.gov/articles/PMC9546416/",
              },
              {
                label: "PMC: Sweat Metal Excretion Under Different Conditions",
                href: "https://pmc.ncbi.nlm.nih.gov/articles/PMC8998800/",
              },
            ]}
          >
            Sweating provides a supplementary excretion pathway. A systematic
            review found arsenic, cadmium, lead, and mercury are excreted in
            measurable quantities through sweat, with concentrations in some
            cases exceeding those in blood or urine. Infrared sauna sweat showed
            higher concentrations of aluminum, arsenic, cadmium, nickel, lead,
            and mercury compared to conventional exercise. This is a secondary
            pathway &mdash; not a replacement for liver and kidney function, but
            a meaningful supplement. Hydrate well and replace electrolytes after
            each session.
          </Recommendation>

          <Recommendation
            title="Zeolite (Clinoptilolite)"
            sources={[
              {
                label: "PMC: Zeolite Clinoptilolite Safety and Medical Applications",
                href: "https://pmc.ncbi.nlm.nih.gov/articles/PMC6277462/",
              },
              {
                label: "PMC: Clinical Evaluation of Zeolite Supplementation",
                href: "https://pmc.ncbi.nlm.nih.gov/articles/PMC9197155/",
              },
              {
                label: "PMC: Activated Clinoptilolite Suspension Clinical Evidence",
                href: "https://www.dovepress.com/clinical-evidence-supporting-the-use-of-an-activated-clinoptilolite-su-peer-reviewed-fulltext-article-NDS",
              },
            ]}
          >
            A volcanic mineral with a cage-like structure that traps heavy metal
            ions via ion exchange in the gut. Clinical studies found it increased
            urinary excretion of lead, cadmium, and arsenic. In lead-exposed
            mice, it decreased intestinal lead accumulation by over 70%.
            <span className="block mt-2 text-xs font-medium text-amber-700 dark:text-amber-400">
              Product quality warning: Some commercial zeolites are contaminated
              with the very metals they claim to remove (arsenic up to 118.7
              mg/kg, lead up to 58.8 mg/kg in tested products). Only buy
              third-party tested products.
            </span>
          </Recommendation>

          <Recommendation
            title="Spirulina"
            dosage="3 g/day"
            sources={[
              {
                label: "PubMed: Spirulina and Heavy-Metal Toxicity Mitigation",
                href: "https://pubmed.ncbi.nlm.nih.gov/32749124/",
              },
              {
                label: "PMC: Spirulina Against Heavy Metal Toxicity in Cells",
                href: "https://pmc.ncbi.nlm.nih.gov/articles/PMC10707235/",
              },
            ]}
          >
            A blue-green algae with 58 preclinical studies and 5 human clinical
            studies demonstrating protective effects, strongest for arsenic. Has
            a dual mechanism: binds metals AND provides antioxidant protection
            through phycocyanin. A study in Bangladesh found spirulina combined
            with zinc significantly reduced arsenic levels in children&apos;s
            urine and improved arsenic-related skin conditions.
            <span className="block mt-2 text-xs font-medium text-amber-700 dark:text-amber-400">
              Same contamination warning as zeolite &mdash; spirulina
              bioaccumulates metals from its growing environment. Third-party
              tested products only.
            </span>
          </Recommendation>

          <Recommendation
            title="Quercetin + Bromelain"
            dosage="500-1,000 mg each/day"
            sources={[
              {
                label: "PMC: Quercetin Alleviates PM2.5 Chronic Lung Injury",
                href: "https://pmc.ncbi.nlm.nih.gov/articles/PMC10768656/",
              },
              {
                label: "PMC: Quercetin Clinical Trial in COPD",
                href: "https://pmc.ncbi.nlm.nih.gov/articles/PMC7047491/",
              },
              {
                label: "PMC: Bromelain in Allergic Airway Disease",
                href: "https://pmc.ncbi.nlm.nih.gov/articles/PMC8576519/",
              },
            ]}
          >
            Quercetin is a plant flavonoid found in onions, apples, and berries.
            A clinical trial in COPD patients showed it was safe, reduced
            markers of lung inflammation and oxidative stress, and the majority
            reported improvement in respiratory symptoms. Animal studies show it
            prevents emphysema from smoke exposure. Bromelain (from pineapple)
            reduces airway inflammation and enhances quercetin absorption. Take
            bromelain between meals for best effect.
          </Recommendation>

          <Recommendation
            title="Nasal Saline Irrigation"
            sources={[
              {
                label: "MedCrave: Saline Irrigation Removes 80%+ of Deposited Particles",
                href: "https://medcraveonline.com/JOENTR/effectiveness-of-intranasal-saline-cleansing-methods-for-removal-of-particulate-matter.html",
              },
              {
                label: "PMC: Nasal Irrigations &mdash; Clinical Review",
                href: "https://pmc.ncbi.nlm.nih.gov/articles/PMC12388252/",
              },
            ]}
          >
            A simple, immediate action after exposure. Studies demonstrated 80%
            or greater recovery of deposited particulate matter from nasal
            passages using saline irrigation. Use a squeeze bottle or neti pot
            with isotonic saline after being outdoors during poor air quality.
            <span className="block mt-2 text-xs font-medium text-amber-700 dark:text-amber-400">
              Always use distilled, sterile, or previously boiled and cooled
              water &mdash; never tap water, due to rare but serious infection
              risk.
            </span>
          </Recommendation>
        </div>
      </section>

      {/* ---- QUICK REFERENCE ---- */}
      <section className="mt-10">
        <h2 className="text-xl font-bold border-b border-border pb-2">
          Quick Reference &mdash; During Poor Air Quality
        </h2>
        <div className="mt-4 space-y-3">
          {[
            "Close all windows and doors. Run HEPA purifier or build a Corsi-Rosenthal box.",
            "Wear an N95 or KN95 mask outdoors. Fit matters more than the rating — seal it tight.",
            "Check real-time air quality at AirNow.gov or PurpleAir.com before going outside.",
            "Avoid generating indoor particulates: no candles, incense, gas stove, or fireplace.",
            "Best outdoor window: late morning through early afternoon (10 AM - 2 PM) when pollutants disperse.",
            "Irrigate nasal passages with saline after any outdoor exposure.",
            "Keep children indoors when AQI exceeds 100. They breathe faster and inhale more per pound of body weight.",
            "Seek emergency care for: severe difficulty breathing, chest pain, blue lips, confusion, or coughing blood.",
          ].map((item, i) => (
            <div key={i} className="flex items-start gap-3">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-bold">
                {i + 1}
              </span>
              <p className="text-sm text-muted-foreground">{item}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ---- DISCLAIMER ---- */}
      <section className="mt-10 mb-8">
        <div className="rounded-lg border border-border bg-muted/30 p-6">
          <p className="text-xs text-muted-foreground leading-relaxed">
            <span className="font-semibold text-foreground">Disclaimer:</span>{" "}
            This page presents peer-reviewed scientific research for
            informational purposes only. It is not medical advice. Consult a
            qualified healthcare provider before starting any supplement,
            especially if you are pregnant, nursing, taking medications, or have
            a medical condition. Supplement quality varies widely &mdash; choose
            products with third-party testing (NSF, USP, or ConsumerLab
            certification). SkyLedger does not sell supplements or receive
            compensation from supplement companies.
          </p>
        </div>
      </section>
    </div>
  );
}
