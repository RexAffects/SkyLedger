// Citizen Action Toolkit — templates, scripts, and guides

export interface EmailTemplate {
  id: string;
  name: string;
  badge: string;
  subject: string;
  body: string;
}

export interface SocialPost {
  platform: string;
  text: string;
}

export interface FollowUpStep {
  afterAction: string;
  steps: string[];
  timeline: string;
}

// ---------------------------------------------------------------------------
// PHONE CALL SCRIPT
// ---------------------------------------------------------------------------

export const PHONE_SCRIPT = `Hi, my name is [YOUR NAME] and I'm a constituent from [YOUR CITY, STATE].

I'm calling to ask [REPRESENTATIVE/SENATOR NAME] to introduce legislation banning geoengineering and unauthorized weather modification in our state — modeled after the laws already enacted in Tennessee, Florida, and Louisiana.

This is a bipartisan issue. Florida passed their ban 82-28 in the House. Over 30 states have introduced similar bills. I'd like to know the [Representative/Senator]'s position on this.

Thank you for your time.`;

export const PHONE_TIPS = [
  {
    title: "You'll talk to a staffer, not the legislator",
    detail:
      "That's normal. The staffer logs your call, tallies constituent positions, and briefs the legislator. Your call is literally counted.",
  },
  {
    title: "It takes 60 seconds",
    detail:
      "Read the script, answer any questions the staffer asks, and you're done. They will not debate you or grill you.",
  },
  {
    title: "Mention your city and zip code",
    detail:
      "This is how they verify you're a constituent. Legislators only care about calls from people in their district.",
  },
  {
    title: "Ask for their position",
    detail:
      "\"Can you tell me the Representative's position on geoengineering legislation?\" This forces a response and creates a paper trail.",
  },
  {
    title: "If you get voicemail, leave the message",
    detail:
      "State your name, city, zip, and your ask. Voicemails are logged the same as live calls. Keep it under 30 seconds.",
  },
  {
    title: "Be polite and direct",
    detail:
      "Staffers take dozens of calls a day. They remember the calm, clear ones. Anger doesn't help — conviction does.",
  },
];

// ---------------------------------------------------------------------------
// EMAIL TEMPLATES
// ---------------------------------------------------------------------------

export const EMAIL_TEMPLATES: EmailTemplate[] = [
  {
    id: "first-contact",
    name: "First Contact",
    badge: "Start here",
    subject:
      "Constituent Request: Introduce Geoengineering Ban Legislation in [STATE]",
    body: `Dear [REPRESENTATIVE/SENATOR LAST NAME],

I'm writing as a constituent from [YOUR CITY] to request that you introduce legislation banning geoengineering and intentional weather modification in [STATE] — modeled after laws already signed in Tennessee (SB 2691), Florida (SB 56), and Louisiana (Act No. 95).

This isn't a fringe issue:
- Over 30 states have introduced similar bills
- Florida passed their ban 82-28 in the House with bipartisan support
- The Clear Skies Act (H.R. 4403) has been introduced at the federal level
- A GAO report (Feb 2026) found NOAA's weather modification oversight is broken — 78% error rate, zero fines in 50+ years
- Over 600 scientists have signed a formal Non-Use Agreement calling for a ban

[STATE] deserves the same protections that Tennessee and Florida already have. No amount of personal health decisions can address what's being dispersed into the air we all breathe.

I would welcome the opportunity to discuss this further. Thank you for your service.

Respectfully,
[YOUR NAME]
[YOUR CITY], [STATE]`,
  },
  {
    id: "follow-up",
    name: "Follow-Up",
    badge: "2 weeks later",
    subject: "Following Up: Geoengineering Ban Legislation Request",
    body: `Dear [REPRESENTATIVE/SENATOR LAST NAME],

I wrote to your office two weeks ago requesting that you introduce geoengineering ban legislation in [STATE], and I wanted to follow up.

Since my last message, I've spoken with other constituents in [YOUR CITY/DISTRICT] who share these concerns. This issue is gaining momentum — [NUMBER] states now have bills introduced or enacted.

I'd appreciate knowing your position on this issue. Would you be willing to meet with concerned constituents to discuss it?

Thank you for your time.

Respectfully,
[YOUR NAME]
[YOUR CITY], [STATE]`,
  },
  {
    id: "pre-vote",
    name: "Pre-Vote",
    badge: "When a bill is moving",
    subject: "Please Vote YES on [BILL NUMBER] — Geoengineering Ban",
    body: `Dear [REPRESENTATIVE/SENATOR LAST NAME],

I'm writing to urge you to vote YES on [BILL NUMBER] when it comes before [COMMITTEE/FLOOR].

This bill has bipartisan precedent. In Florida, the ban passed 82-28 in the House and 28-9 in the Senate. In Tennessee, 70-22 and 25-6. These aren't close votes — they're landslides.

Your constituents are watching this vote. I will be following the outcome and sharing the results with my community.

Thank you.

[YOUR NAME]
[YOUR CITY], [STATE]`,
  },
  {
    id: "thank-you",
    name: "Thank You",
    badge: "After a win",
    subject: "Thank You for Supporting [BILL NUMBER]",
    body: `Dear [REPRESENTATIVE/SENATOR LAST NAME],

Thank you for [sponsoring/voting yes on] [BILL NUMBER]. Your support for protecting [STATE] residents from unauthorized weather modification and geoengineering is appreciated.

I want you to know that your constituents notice and remember when their representatives take action on the issues that matter to them. I've shared your support with my community.

Please continue to champion transparency and accountability on this issue. If there is anything I can do to support your efforts, I'm available.

With gratitude,
[YOUR NAME]
[YOUR CITY], [STATE]`,
  },
];

// ---------------------------------------------------------------------------
// LETTER TEMPLATE (moved from contact-legislator)
// ---------------------------------------------------------------------------

export const LETTER_TEMPLATE = `Dear [REPRESENTATIVE/SENATOR LAST NAME],

I'm writing to request that you introduce legislation in our state banning geoengineering and intentional weather modification — modeled after laws already signed in Tennessee (SB 2691, April 2024) and Florida (SB 56, 2025).

These laws prohibit the intentional injection, release, or dispersion of chemicals or substances into the atmosphere with the purpose of affecting temperature, weather, or the intensity of sunlight. This isn't a fringe issue — over 22 states introduced similar bills in 2025, and at the federal level, H.R. 4403 (the Clear Skies Act) has been introduced to ban weather modification nationwide.

[STATE NAME] deserves the same protections that Tennessee and Florida already have. Our families, our children, and our communities deserve to know exactly what is happening in the skies above our homes. No amount of personal health-conscious decisions can address what's being dispersed into the air we all breathe.

We're not asking for anything extreme. We're asking for what multiple states have already passed into law. We believe this will be the direction every state moves toward, and we'd like [STATE NAME] to be among those leading the way.

For reference, a citizen-built transparency platform at skyledger.org aggregates real-time flight tracking, FAA aircraft ownership data, weather modification operator identification, and citizen reports into one open-source tool. The information is based entirely on public records and verifiable data — over 600 documented weather modification patents, congressional reports, and federal agency documents.

I would welcome the opportunity to discuss this further. Thank you for your time and your service to our state.

Respectfully,
[YOUR NAME]
[YOUR CITY], [YOUR STATE]`;

// ---------------------------------------------------------------------------
// COMMITTEE HEARING TESTIMONY
// ---------------------------------------------------------------------------

export const TESTIMONY_SCRIPT = `Thank you, [Chairman/Chairwoman LAST NAME] and members of the committee. My name is [YOUR NAME], and I'm a resident of [YOUR CITY], [STATE].

I'm here today to ask this committee to advance [BILL NUMBER], which would ban unauthorized geoengineering and weather modification in our state.

This is not a fringe issue. Three states — Tennessee, Florida, and Louisiana — have already enacted bans with overwhelming bipartisan support. Florida passed their ban 82-28. Over 600 scientists worldwide have signed a formal Non-Use Agreement calling for a prohibition on solar geoengineering. And in February 2026, the Government Accountability Office found that NOAA's weather modification oversight is broken — with a 78% error rate in filed reports and zero enforcement fines issued in over 50 years.

[PERSONAL STATEMENT: 1-2 sentences about why this matters to you personally — your family, your community, what you've observed, or why you started paying attention.]

[STATE] residents deserve the same protections that Tennesseans and Floridians already have. I respectfully ask this committee to advance this bill.

Thank you for your time.`;

export const TESTIMONY_TIPS = [
  {
    title: "You get 2-3 minutes",
    detail:
      "Most committees limit public testimony to 2-3 minutes. Practice with a timer. If you're under time, that's fine — short and clear wins.",
  },
  {
    title: "Don't read a wall of text",
    detail:
      "Make eye contact. Speak slowly. It's okay to glance at notes, but don't read a script word-for-word. Committees hear dozens of people — the ones who speak from the heart stand out.",
  },
  {
    title: "Personal stories beat statistics",
    detail:
      "\"I noticed my children were having respiratory issues\" is more powerful than citing a study. The studies are in the bill — YOU are the human face of it.",
  },
  {
    title: "State your ask clearly",
    detail:
      "\"I ask this committee to advance this bill\" — say it at the beginning and at the end. Don't leave them guessing what you want.",
  },
  {
    title: "Bring copies",
    detail:
      "Print 10-15 copies of a one-page fact sheet (skyledger.org/learn/facts) and leave them with the committee clerk. Legislators reference handouts after the hearing.",
  },
  {
    title: "You don't need to be an expert",
    detail:
      "You're a constituent. Your job is to say \"I care about this and I vote.\" That's the most powerful testimony there is.",
  },
];

// ---------------------------------------------------------------------------
// SOCIAL MEDIA SHARE KIT
// ---------------------------------------------------------------------------

export const SOCIAL_POSTS: SocialPost[] = [
  {
    platform: "X / Twitter",
    text: `Weather modification has been practiced in the U.S. for 70+ years. 3 states have banned it. 30+ have bills pending. A GAO report found NOAA's oversight is broken — 78% error rate, zero fines in 50 years.

Track what's flying over you: skyledger.org`,
  },
  {
    platform: "Facebook",
    text: `Did you know that weather modification has been practiced in the U.S. for over 70 years? That 9 states actively run cloud seeding programs? That a February 2026 GAO report found NOAA's oversight is broken — 78% error rate in filed reports and ZERO enforcement fines issued in over 50 years?

Three states have already banned it (Tennessee, Florida, Louisiana). Over 30 more have bills pending. Over 600 scientists have signed a formal agreement calling for a ban.

SkyLedger is an open-source platform that lets you track flights over your area, see who owns them, and access every government document, patent, and lab test in one place. All public records. All verifiable.

Check it out: skyledger.org`,
  },
  {
    platform: "Instagram",
    text: `70+ years of weather modification. 9 states actively cloud seeding. A GAO report found 78% of NOAA's filed reports contain errors. Zero fines in 50+ years.

3 states have banned it. 30+ more have bills pending. 600+ scientists want it stopped.

Now there's a platform to track it all — flights, ownership, operators, government docs.

Link in bio: skyledger.org

#skyledger #geoengineering #weathermodification #transparency #cleanskies #clearskiesact`,
  },
  {
    platform: "Text a Friend",
    text: `Hey — have you seen this? There's a site called SkyLedger that tracks flights over your area in real time and shows you who owns them using FAA records. It also has every government document, lab test, and patent related to weather modification in one place. 3 states have already banned it. Check it out: skyledger.org`,
  },
];

// ---------------------------------------------------------------------------
// FOLLOW-UP GUIDE
// ---------------------------------------------------------------------------

export const FOLLOW_UP_STEPS: FollowUpStep[] = [
  {
    afterAction: "After you send a letter or email",
    steps: [
      "Wait 2 weeks for a response",
      "If no response, send the follow-up email template",
      "Call the office and reference your letter — \"I wrote on [DATE] and wanted to follow up\"",
      "If you get a form response, reply specifically asking for the legislator's position",
    ],
    timeline: "2-4 weeks",
  },
  {
    afterAction: "After you make a phone call",
    steps: [
      "Write down who you spoke with (staffer name) and what they said",
      "If they said the legislator would get back to you, follow up in 1 week",
      "Send a follow-up email referencing the call — \"I spoke with [STAFFER] on [DATE]\"",
      "Call again in 2 weeks if you haven't heard back",
    ],
    timeline: "1-2 weeks",
  },
  {
    afterAction: "After you testify at a hearing",
    steps: [
      "Send a thank-you email to the committee chair within 24 hours",
      "Follow the bill's progress through your state legislature website",
      "Share the outcome with your community — whether it advanced or not",
      "If the bill stalls, contact the committee members who didn't vote and ask why",
    ],
    timeline: "24 hours, then ongoing",
  },
  {
    afterAction: "After a legislator commits to the issue",
    steps: [
      "Send the thank-you email template immediately",
      "Share their support on social media — public praise reinforces the behavior",
      "Ask if they need constituent co-signers or hearing witnesses",
      "Stay in touch — offer to help with community outreach in their district",
    ],
    timeline: "Same day",
  },
];
