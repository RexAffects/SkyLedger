# Citizen Science & Crowd-Sourced Environmental Monitoring: Platform Research

**Date:** 2026-03-18
**Purpose:** Research existing citizen science models, crowd-sourced monitoring platforms, and legal/credibility frameworks to inform building a weather modification transparency tool.

---

## 1. Successful Citizen Science Apps — What Made Them Work

### iNaturalist (Biodiversity)
- **Scale:** 200+ million observations, 3.3 million observers worldwide (as of Sept 2024)
- **What works:**
  - Free, mobile-first — just take a photo and upload
  - AI-assisted species identification lowers barrier to entry
  - Community verification by experts worldwide
  - Data feeds into scientific repositories (Global Biodiversity Information Facility)
  - Gamification (observation counts, species lists, "research grade" status)
  - Serves both newcomers and expert naturalists
- **Key lesson:** Make it dead simple to contribute. AI does the heavy lifting, community does the validation.

### Safecast (Radiation Monitoring)
- **Origin:** Volunteer-run, started after Fukushima disaster (2011)
- **What works:**
  - Citizens carry portable Geiger devices and collect data
  - Largest independent environmental radiation dataset in Japan
  - Open data — anyone can access and analyze
  - Collaborates with local/regional institutions informally
  - Data recognized by policymakers at multiple levels
  - Has sustained volunteer engagement for 13+ years
- **Key lesson:** Crisis creates urgency. Open data builds trust. Informal institutional partnerships give legitimacy without co-option.

### PurpleAir (Air Quality)
- **How it works:**
  - Low-cost sensors (~$250) use laser particle counting
  - Measures PM1.0, PM2.5, PM10 particles
  - Data uploaded every 80 seconds via WiFi to central database
  - Real-time public map shows readings globally
  - Citizens buy, install, and maintain their own sensors
- **What works:**
  - EPA validated the sensors and developed correction equations (tested at 70+ locations)
  - Integration with EPA's AirNow Fire and Smoke Map gives official legitimacy
  - Fills gaps between sparse regulatory monitors
  - Citizens can see their own local data immediately (personal motivation)
  - Community-maintained network scales without central funding
- **Key lesson:** Low cost + easy install + real-time personal data = massive adoption. EPA validation was the credibility breakthrough.

### Common Success Factors Across All Three
1. **Low barrier to entry** — anyone can participate without expertise
2. **Immediate personal value** — you get something useful back (your local data, species ID)
3. **Community validation** — peer review or expert confirmation builds data quality
4. **Open data** — transparency builds trust and enables third-party analysis
5. **Institutional recognition** — government or scientific bodies acknowledging the data
6. **Sustained motivation** — gamification, community belonging, crisis urgency

---

## 2. Air Quality Monitoring Networks Citizens Can Join

### PurpleAir Network
- Buy a sensor (~$250), plug in near a power outlet with WiFi
- Data appears on the public PurpleAir map automatically
- EPA correction equations make data comparable to regulatory monitors
- Government programs actively distribute sensors (e.g., DC's DOEE PurpleAir Sensor Project, Puget Sound Clean Air Agency)

### NASA Citizen Science Air Quality Programs
- NASA's Citizen Science and Earth System Data Program (CSESP)
- Citizens deploy and maintain PurpleAir sensors in underserved areas
- Data validates satellite-derived air quality estimates

### Government-Supported Networks
- Multiple air quality management districts (Mojave Desert AQMD, Antelope Valley AQMD, Santa Barbara County) maintain community sensor maps
- Some agencies provide free sensors to underserved communities

### Practical Takeaway
The PurpleAir model is the gold standard for citizen-deployed environmental sensors. The key was making hardware affordable, installation trivial, and data immediately visible and useful.

---

## 3. Existing Platforms for Weather Modification / Aerial Activity Reporting

### Report Geoengineering (reportgeoengineering.org)
- Citizen reporting hub for documenting aircraft involved in geoengineering
- Users can report sightings and track data
- Connected to GeoengineeringWatch.org and "The Dimming" documentary
- **Limitation:** Advocacy-first approach may reduce credibility with neutral audiences

### ClimateViewer Maps (climateviewer.org)
- Open-source mapping platform with multiple data layers
- Built on Cesium (3D globe), Leaflet (mobile), and Ushahidi (crowd-source reporting)
- Features include:
  - Interactive maps of verified weather modification projects worldwide
  - UN weather modification data (1952-1999): apparatus, agents, techniques, results, funding
  - NOAA-reported weather modification activities
  - Geoengineering SRM field experiment locations
  - Community reporting for environmental disasters
- **GitHub:** github.com/rezn8d/climateviewer
- **Key strength:** Maps verified government data alongside community reports

### Geoengineering Monitor (geoengineeringmonitor.org)
- Tracks weather modification technologies and developments
- Quarterly reviews of weather modification activities globally
- More research/education focused than citizen-reporting focused

### NOAA Weather Modification Reports
- Companies/individuals must report weather modification activities 10 days prior (Weather Modification Act of 1976)
- Reports filed via email: weather.modification@noaa.gov
- Public database available through NOAA Library
- **Critical gap:** GAO found federal government has insufficient oversight; lack of supervision could allow harmful, rogue operations to proceed largely unmonitored

### What's Missing in This Space
- No platform combines **verified government data + citizen observations + scientific measurement** in one place
- Existing platforms lean either advocacy (dismissed as conspiracy) or government (incomplete/delayed)
- No platform uses the iNaturalist model of community verification for aerial observations
- No platform preserves photo/video evidence with legal-grade metadata

---

## 4. Crowd-Sourced Photo/Video Evidence Platforms — How They Work

### eyeWitness to Atrocities (eyewitness.global) — THE MODEL TO STUDY
- Created by International Bar Association and LexisNexis
- **How it works:**
  1. **Metadata capture at point of recording:** GPS coordinates, date/time, device sensor data, surrounding WiFi/Bluetooth networks
  2. **Digital fingerprinting:** Cryptographic hash generated at capture. When uploaded, new hash compared to original — perfect match confirms no tampering
  3. **Encrypted storage:** Footage encrypted on device and in transit
  4. **Secure evidence repository:** Chain of custody recorded (who accessed, when)
- **Results:** 53,000+ items of digital evidence documented; evidence used in Ukrainian court cases against Russian war crimes
- **Key lesson:** The app was PURPOSE-BUILT for legal admissibility from day one. That's what makes it credible.

### Axon Digital Evidence Management
- Used by law enforcement (body cams, dash cams, CCTV)
- Community request links allow civilians to upload evidence directly
- Preserves source metadata from point of capture
- Courts expect: device identifier, recording times, GPS, firmware version, file format, encoding, creation date, modification history

### LA Sheriff's "Digital Witness" Portal
- Secure portal where anyone can submit recordings or images of crimes
- Model for how a public submission portal can feed into official processes

### Chain of Custody Requirements for Courts (2026 Standards)
- **Capture metadata:** Device ID, timestamps, GPS, firmware
- **File metadata:** Format, encoding, file size, creation/modification dates
- **Access logging:** Every interaction with evidence logged in tamper-evident storage
- **Hash verification:** SHA-256 hashing at capture, verified on upload
- **Blockchain approaches:** Some systems register evidence on blockchain with timestamp and source metadata (emerging but not yet standard)

### What This Means for a Weather Modification Tool
A reporting app would need to:
- Capture full EXIF data + GPS + timestamp at photo/video capture
- Generate a cryptographic hash immediately
- Upload to encrypted, access-logged storage
- Maintain unbroken chain of custody documentation
- Allow but clearly separate verified (hashed/timestamped) from unverified submissions

---

## 5. Open-Source Tools for Environmental Monitoring

### Purpose-Built Environmental Platforms
| Tool | Purpose | Notes |
|------|---------|-------|
| **Open-Earth Monitor (OEMC)** | Global environmental monitoring | EU-funded, user co-designed tools |
| **Open Foris** | Forest and land monitoring | Used by 65 countries for UNFCCC submissions |
| **Open Sensing** | Custom sensor data collection, analysis, modeling | Open-source framework for citizen-centric monitoring |
| **ClimateViewer** | Geoengineering/weather modification mapping | Cesium + Leaflet + Ushahidi stack |
| **Open Sustainable Technology** | Curated list of open sustainability tools | opensustain.tech — good starting point |

### Infrastructure/Database Tools (Adaptable)
| Tool | Purpose | Why It Matters |
|------|---------|----------------|
| **InfluxDB** | Time-series database | Optimized for sensor data, high write throughput |
| **Prometheus** | Metrics collection and querying | Could store environmental readings |
| **Emoncms** | Energy/temperature/environmental data logging | Web app for processing and visualization |
| **Open Energy Dashboard** | Smart meter data display | Model for user-friendly data presentation |

### GitHub Resources
- github.com/topics/environmental-monitoring — active community of open-source environmental tools
- github.com/civic-interconnect/awesome-citizen-science — curated list of citizen science platforms and tools

---

## 6. Soil and Water Testing — Can Citizens Get Independent Lab Testing?

### YES — Here's How

#### Water Testing
- **Tap Score** (mytapwater.com): Mail-in testing kit. They send you collection materials with directions + return label. Certified lab analysis.
- **EWG Tap Water Database:** Enter zip code to see existing test results for your area (good starting point before spending money on testing)
- **State/university extension offices:** Many offer affordable or free water testing programs
- **Fight For Zero** (fight4zero.org): Florida-based nonprofit that guides citizens through testing. Their citizen science guide walks you through:
  1. Check existing data first (EWG database)
  2. Identify your water source (tap, well, surface)
  3. Choose what to test for based on local concerns
  4. Use testing strips for basic screening, lab testing for comprehensive results

#### Soil Testing
- University extension services in most states offer soil testing ($15-40)
- Independent labs available for comprehensive screening (heavy metals, PFAS, etc.)
- No scientific background needed to collect samples
- Children can participate in sample collection

#### Key Considerations
- EPA does not endorse home water testing kits (accuracy concerns)
- Lab testing is more reliable but costs $50-400+ depending on scope
- For legal/advocacy purposes, use certified labs with documented chain of custody
- Community-organized testing campaigns (like Flint) are more powerful than individual tests

### Fight For Zero Model
- Community-driven nonprofit in Florida
- Collaborative projects where communities collect and analyze water, soil, and air quality data
- Published test results publicly
- Used citizen data to advocate on PFAS contamination in Brevard County
- **Key lesson:** Community-organized testing with published results creates accountability pressure

---

## 7. What Makes Citizen Reporting Credible vs. Dismissible

### Credibility Factors (Based on Academic Research)

**Data Quality Standards:**
1. **Validation methods** — crowdsourced peer review, automated error checking, expert review
2. **Training protocols** — even brief training significantly improves data accuracy
3. **Expert leadership** — projects led by recognized experts carry greater confidence
4. **Pre-set accuracy thresholds** — define acceptable accuracy BEFORE data collection
5. **Replication** — multiple independent observations of same phenomenon
6. **Statistical modeling** — account for systematic error and bias
7. **Metadata management** — consistent metadata enables corrections to raw measurements

**Credibility research finding:** "A growing body of publications clearly shows that diverse types of citizen-science projects can produce data with accuracy equal to or surpassing that of professionals." (Frontiers in Ecology)

### What Gets Citizen Data DISMISSED
1. **No standardized methodology** — "I saw something weird" without protocol
2. **Advocacy-first framing** — conclusions stated before evidence presented
3. **No expert validation** — data exists in an echo chamber
4. **No metadata/chain of custody** — photos without timestamps, GPS, or device info
5. **No replication** — single observations without corroboration
6. **Mixing speculation with data** — editorializing within the report itself
7. **No institutional partnerships** — no university, lab, or agency willing to vouch for methodology

### The Flint Water Crisis — A Case Study in Credibility
- **What happened:** Residents knew their water was bad. Government denied it. Citizen complaints alone were NOT enough.
- **What changed everything:** Resident LeAnne Walters connected with Virginia Tech professor Marc Edwards. He supplied hundreds of testing kits. Residents collected samples, his lab analyzed them.
- **The quote:** "Without a citywide sampling event that was led by Flint residents, the Flint water crisis never would have been recognised." — Marc Edwards
- **The hard truth:** "It was not until residents' findings were backed-up by professional scientists that they were finally given credibility."
- **Result:** Lawsuit by coalition (residents + NRDC + ACLU), infrastructure changes, policy reforms

### Bottom Line on Credibility
**Citizen data + Professional validation = Credible**
**Citizen data alone = Dismissible (unfairly, but consistently)**

The tool must be designed to bridge this gap from day one.

---

## 8. Legal Considerations for a Public Reporting Platform

### Section 230 Protection (Communications Decency Act)
- **Good news:** Platform operators are generally immune from liability for user-generated content under Section 230(c)(1)
- This means if a user reports something false or defamatory, the platform is protected — the user who posted it is liable, not the platform
- **Exceptions:** Federal criminal law violations, intellectual property, human trafficking
- **Critical note:** Section 230 protections are under political pressure and may change

### Defamation Risk
- **Elements a plaintiff must prove:** False statement of fact, published to third parties, causing reputational damage
- **Key defenses:**
  - **Truth/substantial truth** — if the "gist" is accurate, that's sufficient defense
  - **Opinion vs. fact** — stating "I believe this is weather modification" is opinion; stating "XYZ company is illegally spraying" is a factual claim that must be true
  - **Fair reporting privilege** — accurately reporting on government proceedings/data is protected
- **Platform design implications:**
  - Reports should capture OBSERVATIONS ("I observed X at Y time/location") not CONCLUSIONS ("Company Z is poisoning us")
  - Separate data/evidence from interpretation
  - Avoid naming specific companies/individuals in user reports unless supported by verifiable evidence

### Privacy Concerns
- **Invasion of privacy:** Publishing private information without consent
- **Public disclosure of private facts:** Even true private facts can be actionable
- **Platform design implications:**
  - Don't collect unnecessary personal data from reporters
  - Allow anonymous reporting with verified location/time data
  - Be careful about capturing bystanders in photo/video evidence
  - Have clear privacy policy and data handling procedures

### Environmental Claims Specifically
- Citizen science data has been accepted in court (Formosa Plastics case — citizen-collected evidence of illegal discharge led to successful prosecution)
- Admissibility depends on:
  - Whether regulatory legislation authorizes citizen measurements
  - Some states have "credible data" statutes limiting what citizen data agencies can accept
  - Business records exception to hearsay can apply to systematically collected citizen data
- **Harvard Emmett Environmental Law & Policy Clinic** studies intersection of citizen science and law — potential resource

### Practical Legal Recommendations
1. **Structure reports as observations, not accusations**
2. **Preserve metadata for potential legal use**
3. **Use Section 230 protection — but don't rely on it long-term**
4. **Consult with an environmental attorney on platform Terms of Service**
5. **Build in content moderation for clearly defamatory posts**
6. **Partner with institutions that can independently validate data**

---

## 9. Citizen Activism Platforms That Successfully Influenced Policy

### Ushahidi — Crisis Mapping (Kenya → Global)
- **Origin:** Kenyan lawyer/blogger created it to map post-election violence (2007)
- **Evolution:** Used for vote tampering, food shortages, Pakistan floods, Japan/Haiti earthquakes
- **Impact:** Coordinated aid, saved lives, created accountability for government response
- **Model:** Open-source crowd-mapping platform — has been forked for dozens of applications

### SeeClickFix — Municipal Issue Reporting (USA)
- Citizens report non-emergency issues (potholes, broken infrastructure)
- Reports geotagged and routed to appropriate government department
- Tracks progress and resolution
- **Impact:** Forces government accountability through public visibility of unresolved issues

### FixMyStreet — UK Municipal Reporting
- Similar to SeeClickFix but UK-focused
- Geotagged photos + descriptions routed to local authorities
- **Impact:** Streamlined reporting process, created transparency around government responsiveness

### Flint Water Study — Citizen Science → Policy Change
- Citizen-collected water samples + university lab analysis
- Led to federal state of emergency declaration
- Resulted in Safe Drinking Water Act lawsuit
- Infrastructure replacement mandated
- **Impact:** Arguably the most important citizen science → policy change case in recent US history

### Formosa Plastics Case — Citizen Evidence in Court
- Citizens collected evidence of illegal discharge over years
- Volume and consistency of citizen-collected evidence convinced the court
- **Impact:** Successful prosecution of environmental violations using citizen data

### Traffy Fondue — Smart City Engagement (Thailand)
- Citizen complaint platform integrated with city government
- Published in Frontiers in Sustainable Cities (2025)
- Model for how citizen reporting can be built into governance infrastructure

### Common Patterns in Successful Policy Influence
1. **Volume of evidence** — sustained documentation over time, not one-off reports
2. **Institutional partnerships** — universities, legal organizations, established NGOs
3. **Public visibility** — open data that media and public can access
4. **Legal strategy** — data collected with potential litigation in mind
5. **Coalition building** — residents + scientists + lawyers + media

---

## 10. Synthesis: What a Weather Modification Transparency Tool Should Look Like

Based on all the research above, here's what a credible, effective platform would need:

### Core Architecture (Steal from the Best)
- **iNaturalist model:** Simple photo upload + AI-assisted classification + community verification
- **PurpleAir model:** Low-cost sensor integration + real-time public map + EPA-style validation
- **eyeWitness model:** Metadata capture + cryptographic hashing + chain of custody
- **Ushahidi model:** Open-source crowd-mapping + geolocation + timeline visualization

### Must-Have Features
1. **Observation-based reporting** — "What did you see/measure?" not "What do you think is happening?"
2. **Automatic metadata capture** — GPS, timestamp, device info, weather conditions at time of observation
3. **Cryptographic hashing** — tamper-proof evidence from moment of capture
4. **Public real-time map** — like PurpleAir, show all reports geographically
5. **Integration with official data** — overlay NOAA weather modification permits, FAA flight data, EPA air quality readings
6. **Community verification** — multiple independent observations increase confidence rating
7. **Expert review pipeline** — atmospheric scientists, environmental lawyers can validate reports
8. **Open data API** — let researchers, journalists, and lawyers access the data
9. **Anonymous reporting option** — with verified location/time but without personal identification

### Credibility By Design
- Partner with a university from the start (like Flint + Virginia Tech)
- Establish methodology BEFORE collecting data
- Separate raw observations from analysis/conclusions
- Include null results (days when nothing unusual observed — shows systematic monitoring, not cherry-picking)
- Publish methodology openly for peer review

### Legal Architecture
- Terms of service that require observation-based (not accusatory) reporting
- Section 230 protections for platform
- Content moderation for defamatory claims
- Evidence preservation standards for potential legal proceedings
- Relationship with environmental law clinic (Harvard Emmett is the leader in this space)

### What Would Make This DIFFERENT from Existing Platforms
- **Not advocacy-first** — data-first, conclusions follow evidence
- **Not conspiracy-coded** — professional design, scientific methodology, institutional partnerships
- **Not government-only** — citizens fill gaps government doesn't cover
- **Legally defensible** — evidence captured to courtroom standards
- **Integrates multiple data types** — photos, sensor readings, lab results, official records, flight data

---

## Sources

- [iNaturalist Impact Highlights 2025](https://www.inaturalist.org/blog/123031-impact-highlights-from-2025)
- [iNaturalist Accelerates Biodiversity Research — BioScience/Oxford](https://academic.oup.com/bioscience/article/75/11/953/8185761)
- [Citizen Science Apps Reshaping Wildlife Research — EHN](https://www.ehn.org/citizen-science-apps-like-inaturalist-are-reshaping-wildlife-research-and-conservation)
- [Drivers of Participation: Järviwiki and Safecast](https://theoryandpractice.citizenscienceassociation.org/articles/10.5334/cstp.290)
- [PurpleAir Real-time Monitoring](https://www2.purpleair.com/)
- [EPA AirNow Fire and Smoke Map Integration](https://www.epa.gov/sciencematters/epa-research-improves-air-quality-information-public-airnow-fire-and-smoke-map)
- [DC DOEE PurpleAir Sensor Project](https://doee.dc.gov/service/purpleair-sensor-project)
- [NASA Citizen Science for Earth System Data](https://www.earthdata.nasa.gov/about/competitive-programs/csesp/citizen-science-improve-earth-system-data)
- [Report Geoengineering Citizen Hub](https://reportgeoengineering.org/)
- [ClimateViewer Maps](https://climateviewer.org/)
- [ClimateViewer GitHub](https://github.com/rezn8d/climateviewer)
- [Geoengineering Monitor](https://www.geoengineeringmonitor.org/technologies/weather-modification)
- [NOAA Weather Modification Reports](https://library.noaa.gov/weather-climate/weather-modification-project-reports)
- [GAO: US Barely Tracks Geoengineering — Grist](https://grist.org/regulation/geoengineering-noaa-cloud-seeding-gao-oversight/)
- [House Oversight: Subcommittee Demands Weather Engineering Transparency](https://oversight.house.gov/release/hearing-wrap-up-subcommittee-demands-transparency-of-government-weather-and-climate-engineering/)
- [EPA on Geoengineering Government Action](https://www.epa.gov/geoengineering/government-action)
- [eyeWitness to Atrocities](https://www.eyewitness.global/)
- [eyeWitness: Using Metadata to Prove Reliability](https://www.eyewitness.global/Using-metadata)
- [eyeWitness: 53,000 Items of Digital Evidence](https://dev.ua/en/news/53000-tsyfrovykh-dokaziv-deiaki-z-iakykh-vzhe-v-sudakh-yak-zastosunok-eyewitness-to-atrocities-fiksuie-voienni-zlochyny-rf-i-zakhyshchaie-tykh-khto-nym-korystuietsia-1739962240)
- [Video Evidence Authentication Standards 2026](https://digitalevidence.ai/blog/video-evidence-authentication-standards-courts)
- [Open-Earth Monitor](https://earthmonitor.org/)
- [Open Foris](https://www.openforis.org/)
- [Open Sustainable Technology](https://opensustain.tech/)
- [GitHub: Environmental Monitoring Topic](https://github.com/topics/environmental-monitoring)
- [GitHub: Awesome Citizen Science](https://github.com/civic-interconnect/awesome-citizen-science)
- [Open-Source Citizen Environmental Monitoring Framework — Nature Scientific Reports](https://www.nature.com/articles/s41598-022-18700-z)
- [Fight For Zero Environmental Testing Guide](https://www.fight4zero.org/testing)
- [Fight For Zero Test Results](https://www.fight4zero.org/testresults)
- [NASA Citizen Science for Water Quality](https://terra.nasa.gov/citizen-science/water-quality)
- [Citizen Science Water Quality Approaches — ScienceDirect](https://www.sciencedirect.com/science/article/pii/S0048969723040597)
- [Data Quality in Citizen Science — Springer](https://link.springer.com/chapter/10.1007/978-3-030-58278-4_8)
- [Assessing Data Quality in Citizen Science — Frontiers in Ecology](https://esajournals.onlinelibrary.wiley.com/doi/10.1002/fee.1436)
- [Accuracy of Citizen Science Data: Quantitative Review](https://esajournals.onlinelibrary.wiley.com/doi/10.1002/bes2.1336)
- [Citizen-Generated Air Quality Data Shaping Policy — Nature](https://www.nature.com/articles/s41599-022-01135-2)
- [Section 230 Overview — Congress.gov](https://www.congress.gov/crs-product/R46751)
- [Section 230 — EFF](https://www.eff.org/issues/cda230)
- [Online Defamation Law — EFF](https://www.eff.org/issues/bloggers/legal/liability/defamation)
- [Legality of Citizen Journalism](https://nationalnoticerecord.com/the-legality-of-citizen-journalism-and-suits/)
- [Using Citizen Science Data in Litigation](https://citizenscienceguide.com/supplement-2-using-citizen-science-data-litigation)
- [Formosa Case: Citizen-Collected Evidence in Environmental Litigation](https://theoryandpractice.citizenscienceassociation.org/articles/10.5334/cstp.367)
- [Where Environmental Citizen Science Meets the Law](https://theoryandpractice.citizenscienceassociation.org/articles/10.5334/cstp.596)
- [Harvard Emmett Environmental Law & Policy Clinic: Citizen Science](https://clinics.law.harvard.edu/environment/citizen-science/)
- [How to Win Court Cases with Citizen Science Data — CitiMeasure](https://citimeasure.eu/how-to-win-court-cases-by-leveraging-citizen-science-data/)
- [Flint Water Study](https://flintwaterstudy.org/)
- [Citizen Science During Flint Water Emergency](https://theoryandpractice.citizenscienceassociation.org/articles/10.5334/cstp.154)
- [Flint Water Crisis: Everything You Need to Know — NRDC](https://www.nrdc.org/stories/flint-water-crisis-everything-you-need-know)
- [Ushahidi — Civic Tech Overview](https://www.fastercapital.com/content/Social-sharing-initiatives--Civic-Tech-Innovations--Technology-for-Good--The-Latest-Civic-Tech-Innovations.html)
- [Traffy Fondue: Smart City Citizen Engagement — Frontiers](https://www.frontiersin.org/journals/sustainable-cities/articles/10.3389/frsc.2025.1491621/full)
- [IUCN Citizen Science Resource](https://iucn.org/resources/explainer-brief/citizen-science)
