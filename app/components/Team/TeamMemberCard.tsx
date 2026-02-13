"use client";
import { TeamMember } from "../../../types/team";
import { CiGlobe, CiLinkedin } from "react-icons/ci";
import { Heading, Text, Link, FlipCard } from "../ui";

export const TeamMemberCard = ({
  member,
  activeMember,
  setActiveMember,
}: {
  member: TeamMember;
  activeMember: string | null;
  setActiveMember: (id: string | null) => void;
}) => {
  const { name, position, id } = member;

  const frontContent = (
    <>
      <div className="w-full h-auto aspect-square bg-(--theme-card-bg)/10 backdrop-blur-sm rounded-lg overflow-hidden flex items-center justify-center relative cursor-pointer">
        <img
          src={member.image}
          alt={name}
          className={`w-full h-full object-cover text-(--theme-text-primary) fill-(--theme-text-primary) ${
            member.image === "/staff/claude.svg" ? "p-20 mb-20" : ""
          }`}
          style={{
            maskImage:
              "linear-gradient(to bottom, black 80%, transparent 100%)",
            WebkitMaskImage:
              "linear-gradient(to bottom, black 80%, transparent 100%)",
          }}
        />
        <div className="absolute bottom-0 left-0 w-full h-full bg-linear-to-tl from-(--theme-bg)/20 via-(--theme-card-bg)/10 to-(--theme-bg)/5"></div>
      </div>
      <div className="flex flex-col bottom-4 left-1/2 transform -translate-x-1/2 absolute bg-linear-to-br from-(--theme-card-bg) to-(--theme-card-bg)/80 w-[90%] px-4 py-2 rounded-md text-center border-2 border-[var(--theme-card-border)] backdrop-blur-sm transition duration-500">
        <Heading level="h6" animate={false} className="mb-0">
          {name}
        </Heading>
        <Text size="base" variant="secondary">
          {position}
        </Text>
      </div>
    </>
  );

  const backContent = (
    <>
      <div className="w-full h-auto aspect-square bg-[var(--theme-card-bg)]/10 backdrop-blur-sm rounded-lg overflow-hidden flex items-center justify-center relative cursor-pointer">
        <div className="absolute -bottom-0 left-0 w-full h-full bg-linear-to-tl from-[var(--theme-bg)]/20 via-[var(--theme-card-bg)]/10 to-[var(--theme-bg)]/5"></div>
      </div>
      <div className="absolute top-0 left-0 w-full h-full p-6 flex flex-col text-start">
        <Heading level="h4" animate={false} className="mb-4">
          About {name}
        </Heading>
        <Text size="base" variant="secondary" className="leading-relaxed">
          {member.description
            ? member.description
            : "No additional information provided."}
        </Text>
        <div className="flex-grow w-full mt-8 gap-8">
          {member.linkedinUrl && (
            <div className="flex flex-row items-center mb-2">
              <Link
                href={member.linkedinUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[var(--theme-text-accent)] hover:underline flex items-center"
                data-umami-event="Team LinkedIn Click"
                data-umami-event-member={member.name}
              >
                <CiLinkedin
                  size={24}
                  className="inline-block mr-2 text-[var(--theme-text-accent)]"
                />
                LinkedIn
              </Link>
            </div>
          )}
          {member.websiteUrl && (
            <div className="flex flex-row items-center mb-2">
              <Link
                href={member.websiteUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[var(--theme-text-accent)] hover:underline flex items-center"
                data-umami-event="Team Website Click"
                data-umami-event-member={member.name}
              >
                <CiGlobe
                  size={24}
                  className="inline-block mr-2 text-[var(--theme-text-accent)]"
                />
                Website
              </Link>
            </div>
          )}
        </div>
      </div>
    </>
  );

  return (
    <FlipCard
      id={id}
      activeId={activeMember}
      setActiveId={setActiveMember}
      front={frontContent}
      back={backContent}
      backScale="150%"
      onOpen={() => {
        if (typeof window !== "undefined" && (window as any).umami) {
          (window as any).umami.track("Team Member Card Click", {
            member: member.name,
          });
        }
      }}
    />
  );
};
