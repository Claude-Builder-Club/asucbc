import type { ReactNode } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { Card, Heading, Text } from "../components/ui";

type FaqItem = {
  question: string;
  answer: ReactNode;
};

const GENERAL_FAQ_ITEMS: ReadonlyArray<FaqItem> = [
  {
    question:
      "Why did I not receive API credits even after attending the meeting and redeeming them?",
    answer: (
      <>
        This usually happens if you submit the Org ID from your personal account
        instead of your ASU school account, or if the Org ID is copied from{" "}
        <a
          href="https://claude.ai"
          target="_blank"
          rel="noopener noreferrer"
          className="underline"
        >
          claude.ai
        </a>{" "}
        instead of{" "}
        <a
          href="https://platform.anthropic.com"
          target="_blank"
          rel="noopener noreferrer"
          className="underline"
        >
          platform.anthropic.com
        </a>
        .
      </>
    ),
  },
  {
    question:
      "I filled out and submitted the form at /redeem. Why do I still not have access?",
    answer:
      "Submitting the application alone is not enough. You must attend a meeting in person to receive access.",
  },
  {
    question: "Where can I check the latest meeting announcement?",
    answer: (
      <>
        Use this order of sources: Discord{" "}
        <a
          href="https://discord.com/channels/1414342988259262516/1414342989383340044"
          target="_blank"
          rel="noopener noreferrer"
          className="underline"
        >
          #announcements
        </a>
        , then your email,{" "}
        <a
          href="https://www.instagram.com/asu.cbc/"
          target="_blank"
          rel="noopener noreferrer"
          className="underline"
        >
          Instagram
        </a>
        , then{" "}
        <a
          href="https://x.com/asuclaude"
          target="_blank"
          rel="noopener noreferrer"
          className="underline"
        >
          X
        </a>
        , and{" "}
        <a
          href="https://www.linkedin.com/company/claude-builder-club-asu/"
          target="_blank"
          rel="noopener noreferrer"
          className="underline"
        >
          LinkedIn
        </a>
        .
      </>
    ),
  },
];

const MEETING_FAQ_ITEMS: ReadonlyArray<FaqItem> = [
  {
    question:
      "I attended the 03/16 meeting but still haven't received Pro/API access. What should I do?",
    answer: (
      <>
        You should get it in a couple of business days. As to when exactly, I am
        not sure. It is highly variable right now given that the access
        procedure is abstracted over two different orgs (Wasserman + Anthropic).
        If you saw an error when you submitted the form,{" "}
        <a
          href="https://discord.com/channels/1414342988259262516/1414342989383340047/1483375015062933504"
          target="_blank"
          rel="noopener noreferrer"
          className="underline"
        >
          read this for more details
        </a>
        .
      </>
    ),
  },
  {
    question:
      "I attended the 03/05 meeting, checked everything on this page, and still don't have access. What now?",
    answer: (
      <>
        If you've read the entire FAQ page + checked{" "}
        <a
          href="https://discord.com/channels/1414342988259262516/1414342989383340047"
          target="_blank"
          rel="noopener noreferrer"
          className="underline"
        >
          #general
        </a>
        , DM Shiv on Discord.
      </>
    ),
  },
];

function FaqSection({
  title,
  items,
  accent = false,
}: {
  title: string;
  items: ReadonlyArray<FaqItem>;
  accent?: boolean;
}) {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-3 px-1">
        <div
          className={`h-px flex-1 ${accent ? "bg-[var(--theme-text-accent)]/30" : "bg-[var(--theme-card-border)]"}`}
        />
        <Text
          size="sm"
          className={`uppercase tracking-widest font-semibold ${accent ? "text-[var(--theme-text-accent)]" : "text-[var(--theme-text-secondary)]"}`}
        >
          {title}
        </Text>
        <div
          className={`h-px flex-1 ${accent ? "bg-[var(--theme-text-accent)]/30" : "bg-[var(--theme-card-border)]"}`}
        />
      </div>
      <div className="grid grid-cols-1 gap-4">
        {items.map((item) => (
          <Card
            key={item.question}
            gradient
            animated={false}
            className={
              accent
                ? "border-l-2 border-l-[var(--theme-text-accent)]/50"
                : undefined
            }
          >
            <Heading level="h4" animate={false} className="mb-2">
              {item.question}
            </Heading>
            <Text size="lg" variant="secondary">
              {item.answer}
            </Text>
          </Card>
        ))}
      </div>
    </div>
  );
}

export default function FaqPage() {
  return (
    <div className="max-h-full flex flex-col">
      <Header />
      <main className="font-sans flex-1 pt-4 px-4 pb-0 sm:pt-8 sm:px-8 md:p-20">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="text-center space-y-3">
            <Heading level="h1" animate={false}>
              Frequently Asked Questions
            </Heading>
            <Text size="xl" variant="secondary">
              Quick answers for access, API credits, and meeting verification.
            </Text>
          </div>
          <FaqSection title="General" items={GENERAL_FAQ_ITEMS} />
          <FaqSection
            title="Meeting-Specific"
            items={MEETING_FAQ_ITEMS}
            accent
          />
        </div>
      </main>
      <Footer />
    </div>
  );
}
