"use client";

import Header from "../components/Header";
import Footer from "../components/Footer";
import { Card, Heading, Text } from "../components/ui";

type FaqItem = {
  question: string;
  answer: string;
};

const FAQ_ITEMS: ReadonlyArray<FaqItem> = [
  {
    question:
      "Why did I not receive API credits even after attending the meeting and redeeming",
    answer:
      "This usually happens if you submit the Org ID from your personal account instead of your ASU school account, or when the Org ID is copied from claude.ai instead of platform.anthropic.com.",
  },
  {
    question: "I filled out and submitted the form in /apply. Why do I still have no access?",
    answer:
      "Submitting application alone is not enough. You must attend a meeting in person to receive access.",
  },
  {
    question: "Where do I check the latest meeting announcement?",
    answer:
      "Use this source-of-truth order: Discord #announcements, then email/Instagram, then X/LinkedIn.",
  },
];

export default function FaqPage() {
  return (
    <div className="max-h-full flex flex-col">
      <Header />
      <main className="font-sans flex-1 pt-4 px-4 pb-0 sm:pt-8 sm:px-8 md:p-20">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="text-center space-y-3">
            <Heading level="h1" animate={false}>Frequently Asked Questions</Heading>
            <Text size="xl" variant="secondary">
              Quick answers for access, API credits, and meeting verification.
            </Text>
          </div>
          <div className="grid grid-cols-1 gap-4">
            {FAQ_ITEMS.map((item: FaqItem) => (
              <Card key={item.question} gradient animated={false}>
                <Heading level="h4" animate={false} className="mb-2">{item.question}</Heading>
                <Text size="lg" variant="secondary">{item.answer}</Text>
              </Card>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
