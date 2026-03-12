"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Header from "../components/Header";
import Footer from "../components/Footer";
import {
  Heading,
  Text,
  Input,
  Button,
  Card,
  Container,
} from "../components/ui";
import resources from "../data/resources.json";
import type { Resource } from "@/types/resource";

const typedResources: Resource[] = resources;

export default function ResourcesPage() {
  const [search, setSearch] = useState("");

  const filtered = typedResources.filter((r) => {
    const q = search.toLowerCase();
    return r.title.toLowerCase().includes(q) || r.description.toLowerCase().includes(q);
  });

  return (
    <div className="min-h-[100dvh] relative overflow-x-hidden">
      <Header />
      <main className="py-12 sm:py-16">
        <Container size="lg" animate>
          <div className="mb-10 text-center space-y-4">
            <Heading level="h1" animate={false}>
              Resources
            </Heading>
            <Text size="lg" variant="secondary">
              Curated tools, guides, and links for ASU students interested in AI.
            </Text>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 mb-8">
            <Input
              placeholder="Search resources..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              fullWidth
            />
            <Link href="/resources/submit" className="flex self-stretch">
              <Button type="button" variant="secondary" className="whitespace-nowrap w-full">
                Submit Resource
              </Button>
            </Link>
          </div>

          {filtered.length === 0 ? (
            <Text variant="secondary" className="text-center py-12">
              No resources match your search.
            </Text>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((resource, i) => (
                <motion.div
                  key={resource.id}
                  className="h-full"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <Card gradient childrenAreRelative={false} className="h-full">
                    <div className="relative z-10 flex flex-col h-full gap-4">
                      <div className="space-y-2 flex-1">
                        <Heading level="h3" animate={false}>
                          {resource.title}
                        </Heading>
                        <Text variant="secondary" size="sm">
                          {resource.description}
                        </Text>
                      </div>
                      <a href={resource.link} target="_blank" rel="noopener noreferrer">
                        <Button type="button" variant="secondary" className="w-full">
                          View Resource
                        </Button>
                      </a>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </Container>
        <div className="mt-16">
          <Footer />
        </div>
      </main>
    </div>
  );
}
