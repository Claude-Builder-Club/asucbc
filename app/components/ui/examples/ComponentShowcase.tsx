"use client";

import {
  Button,
  Heading,
  Text,
  Label,
  Input,
  Textarea,
  Card,
  Container,
  Badge,
  Tag,
  Link,
  Divider,
  Skeleton,
  TiltCard,
} from "@/app/components/ui";

export default function ComponentShowcase() {
  return (
    <div className="min-h-screen py-12">
      <Container size="lg">
        <Heading level="h1" className="mb-8 text-center">
          UI Component Library Showcase
        </Heading>

        {/* Buttons Section */}
        <Card gradient className="mb-8">
          <Heading level="h3" className="mb-4">
            Buttons
          </Heading>
          <div className="flex flex-wrap gap-4">
            <Button variant="primary">Primary</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="primary" size="sm">
              Small
            </Button>
            <Button variant="primary" size="lg">
              Large
            </Button>
            <Button variant="primary" disabled>
              Disabled
            </Button>
          </div>
        </Card>

        {/* Typography Section */}
        <Card gradient className="mb-8">
          <Heading level="h3" className="mb-4">
            Typography
          </Heading>
          <div className="space-y-4">
            <Heading level="h1">Heading 1</Heading>
            <Heading level="h2">Heading 2</Heading>
            <Heading level="h3">Heading 3</Heading>
            <Text size="lg" variant="primary">
              Large primary text - Lorem ipsum dolor sit amet, consectetur
              adipiscing elit.
            </Text>
            <Text size="base" variant="secondary">
              Base secondary text - Sed do eiusmod tempor incididunt ut labore.
            </Text>
            <Text size="sm" variant="accent">
              Small accent text - Ut enim ad minim veniam.
            </Text>
          </div>
        </Card>

        {/* Form Inputs Section */}
        <Card gradient className="mb-8">
          <Heading level="h3" className="mb-4">
            Form Inputs
          </Heading>
          <div className="space-y-4 max-w-md">
            <div>
              <Label htmlFor="name" required>
                Full Name
              </Label>
              <Input id="name" type="text" placeholder="John Doe" fullWidth />
            </div>
            <div>
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="john@example.com"
                fullWidth
                error="Please enter a valid email"
              />
            </div>
            <div>
              <Label htmlFor="message">Message</Label>
              <Textarea
                id="message"
                placeholder="Type your message here..."
                fullWidth
              />
            </div>
          </div>
        </Card>

        {/* Badges & Tags Section */}
        <Card gradient className="mb-8">
          <Heading level="h3" className="mb-4">
            Badges & Tags
          </Heading>
          <div className="space-y-4">
            <div className="flex flex-wrap gap-2">
              <Badge variant="primary">Primary</Badge>
              <Badge variant="secondary">Secondary</Badge>
              <Badge variant="accent">Accent</Badge>
              <Badge variant="success">Success</Badge>
              <Badge variant="warning">Warning</Badge>
              <Badge variant="error">Error</Badge>
            </div>
            <div className="flex flex-wrap gap-2">
              <Tag variant="primary">React</Tag>
              <Tag variant="secondary">TypeScript</Tag>
              <Tag
                variant="outline"
                removable
                onRemove={() => alert("Tag removed")}
              >
                Removable
              </Tag>
            </div>
          </div>
        </Card>

        {/* Links Section */}
        <Card gradient className="mb-8">
          <Heading level="h3" className="mb-4">
            Links
          </Heading>
          <div className="space-y-2">
            <div>
              <Link href="#" variant="default">
                Default Link
              </Link>
            </div>
            <div>
              <Link href="#" variant="accent">
                Accent Link
              </Link>
            </div>
            <div>
              <Link href="#" variant="underline">
                Underlined Link
              </Link>
            </div>
            <div>
              <Link href="https://example.com" external>
                External Link
              </Link>
            </div>
          </div>
        </Card>

        {/* Dividers Section */}
        <Card gradient className="mb-8">
          <Heading level="h3" className="mb-4">
            Dividers
          </Heading>
          <Divider variant="solid" />
          <Divider variant="dashed" />
          <Divider variant="gradient" />
          <Divider label="OR" variant="solid" />
        </Card>

        {/* Skeletons Section */}
        <Card gradient className="mb-8">
          <Heading level="h3" className="mb-4">
            Loading Skeletons
          </Heading>
          <div className="space-y-4">
            <Skeleton variant="text" width="80%" />
            <Skeleton variant="text" width="60%" />
            <div className="flex items-center gap-4">
              <Skeleton variant="circular" width={60} height={60} />
              <div className="flex-1 space-y-2">
                <Skeleton variant="text" width="40%" />
                <Skeleton variant="text" width="60%" />
              </div>
            </div>
            <Skeleton variant="rectangular" height={200} />
          </div>
        </Card>

        {/* Parallax Tilt Cards Section */}
        <Heading level="h2" className="mb-6">
          Parallax Tilt Cards
        </Heading>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <TiltCard gradient className="h-full">
            <Heading level="h4" className="mb-2">
              Default Tilt
            </Heading>
            <Text size="sm" variant="secondary">
              Hover and move your cursor to see the parallax tilt effect with a
              subtle glare.
            </Text>
          </TiltCard>
          <TiltCard
            gradient
            className="h-full"
            glareMaxOpacity={0.3}
            tiltMaxAngleX={15}
            tiltMaxAngleY={15}
            scale={1.05}
            transitionSpeed={300}
          >
            <Badge variant="accent" className="mb-3">
              Intense
            </Badge>
            <Heading level="h4" className="mb-2">
              Strong Tilt
            </Heading>
            <Text size="sm" variant="secondary">
              Higher tilt angle, more glare, and a bigger scale effect.
            </Text>
          </TiltCard>
          <TiltCard
            gradient
            className="h-full"
            glareMaxOpacity={0.1}
            tiltMaxAngleX={5}
            tiltMaxAngleY={5}
            scale={1.01}
            transitionSpeed={800}
          >
            <Heading level="h4" className="mb-2">
              Subtle Tilt
            </Heading>
            <Text size="sm" variant="secondary" className="mb-4">
              A gentle, slower effect for a more refined feel.
            </Text>
            <Button variant="primary" fullWidth>
              Click Me
            </Button>
          </TiltCard>
        </div>

        {/* Interactive Cards Section */}
        <Heading level="h2" className="mb-6">
          Interactive Cards
        </Heading>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <Card hoverable gradient className={`grow h-full`}>
            <Heading level="h4" className="mb-2">
              Hoverable Card
            </Heading>
            <Text size="sm" variant="secondary">
              Hover over me to see the animation effect!
            </Text>
          </Card>
          <Card hoverable gradient>
            <Badge variant="success" className="mb-3">
              Featured
            </Badge>
            <Heading level="h4" className="mb-2">
              With Badge
            </Heading>
            <Text size="sm" variant="secondary">
              This card has a featured badge at the top.
            </Text>
          </Card>
          <Card hoverable gradient>
            <Heading level="h4" className="mb-2">
              Call to Action
            </Heading>
            <Text size="sm" variant="secondary" className="mb-4">
              Click the button below to get started.
            </Text>
            <Button variant="primary" fullWidth>
              Get Started
            </Button>
          </Card>
        </div>
      </Container>
    </div>
  );
}
