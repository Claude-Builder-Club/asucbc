export interface TeamMember {
  id: string;
  name: string;
  position: string;
  image: string;
  linkedinUrl?: string;
  websiteUrl?: string;
  description?: string;
}

export const teamMembers: TeamMember[] = [
  {
    id: "punya",
    name: "Punya Mishra",
    position: "Advisor",
    image: "/staff/punya.png",
    websiteUrl: "https://punyamishra.com/",
    description:
      "Punya Mishra is Director of Innovative Learning Futures at Arizona State University’s Learning Engineering Institute and Professor in the Mary Lou Fulton College. Internationally recognized for his work in educational technology, creativity, and design-based learning innovation, he has published over 200 articles and received the AECT Jonassen Award. An AERA Fellow, he co-hosts the award-winning Silver Lining for Learning webinar and Learning Futures podcast.",
  },
  {
    id: "shiven",
    name: "Shiven Shekar",
    position: "President",
    image: "/staff/shiven.png",
    linkedinUrl: "https://www.linkedin.com/in/shiven-shekar/",
    websiteUrl: "https://shivenshekar.com",
    description:
      "Incoming Apple Software Engineer and senior studying Computer Science with a Software Engineering concentration at Arizona State University. My interests lie in AppliedML and Distributed Systems.",
  },
  {
    id: "john",
    name: "John Li",
    position: "Technology",
    image: "/staff/john.png",
    description:
      "John Li is a Full Stack Developer, Honors Student at Arizona State University, Technical Officer of the Claude Builder Club, and incoming Tesla Software Engineer. With a passion for building robust applications and leading technical initiatives, John combines hands-on development expertise with community leadership. As a technical officer, he spearheads innovative projects and fosters a collaborative environment for club members to explore the latest in AI and software development.",
    linkedinUrl: "https://www.linkedin.com/in/johnli05/",
    websiteUrl: "https://tet.moe/",
  },
  {
    id: "sathwin",
    name: "Sathwin Reddy",
    position: "Head of Operations",
    image: "/staff/claude.svg",
  },
  {
    id: "anjali",
    name: "Anjali Kok",
    position: "Vice President",
    image: "/staff/claude.svg",
  },
  {
    id: "yuvam",
    name: "Yuvam Bhargav",
    position: "Technology",
    image: "/staff/yuvam.png",
    linkedinUrl: "https://www.linkedin.com/in/yuvam-bh/",
    websiteUrl: "https://yuvambhargav.com/",
  },
  {
    id: "erick",
    name: "Erick Li",
    position: "Business + Finance",
    image: "/staff/erick.png",
    description:
      "Erick Li is a sophomore majoring in finance with a minor in data science at Arizona State University. He is a polyglot and entrepreneur at the same time. He has experience with front end development, and his expertise lies in business and outreach.",
  },
  {
    id: "farnaz",
    name: "Farnaz",
    position: "Ambassador",
    image: "/staff/farnaz.png",
    linkedinUrl: "https://www.linkedin.com/in/farnaz-avarzamani-a672069b/",
    description:
      "Farnaz is a PhD candidate in Educational Policy and Evaluation at Arizona State University. Her research focuses on multilingual STEM education and generative AI to support teachers in diverse classrooms. Her work has earned multiple awards and publications. Through Principled Innovation®, she recently developed an AI tool for educators launching in mid-October.",
  },
  {
    id: "tino",
    name: "Tino Heather",
    position: "Ambassador",
    image: "/staff/tino.png",
    linkedinUrl: "https://www.linkedin.com/in/heathermavunga/",
    description:
      "Tino brings a global perspective to technology and policy, having studied across four continents. She holds a BA in Psychology and Management from Monash University and is pursuing a Master in Global Management at ASU’s Thunderbird School, where she serves as a Claude AI Ambassador. She specializes in technology, people, and policy, focusing on AI, cybersecurity, and emerging technologies.",
  },
  {
    id: "hieu",
    name: "Hieu Than",
    position: "Community",
    image: "/staff/claude.svg",
  },
  {
    id: "ben",
    name: "Ben Juntilla",
    position: "Technology",
    image: "/staff/claude.svg",
  },
  {
    id: "anirudh",
    name: "Anirudh Manjesh",
    position: "Industry",
    image: "/staff/anirudh.png",
    linkedinUrl: "https://www.linkedin.com/in/anirudh-manjesh-978ba5194/",
    description:
      "Computer Science senior at ASU’s Barrett Honors College, experienced in full-stack development, AI/ML, and accessibility technology research. Passionate about building agentic AI systems, collaborating on open source projects, and optimizing technology for real-world impact. Active in hackathons and technical conferences, with a proven track record in deploying machine learning solutions and leading research initiatives. Always exploring new ways to advance software, mentor peers, and make technology more inclusive.",
  },
  {
    id: "anmol",
    name: "Anmol Hurkat",
    position: "Technology",
    image: "/staff/claude.svg",
    linkedinUrl: "https://www.linkedin.com/in/anmolhurkat/",
  },
  {
    id: "vishnu",
    name: "Vishnu Vardhana Reddy Devi",
    position: "Technology",
    image: "/staff/vishnu.png",
    linkedinUrl: "https://www.linkedin.com/in/vishnuvardhana-reddy-devi-reddy-8530392a1",
    websiteUrl: "https://vishnuvardhana.vercel.app/",
  },
];

export const formerMembers: TeamMember[] = [
  {
    id: "ekagra",
    name: "Ekagra",
    position: "Technology",
    image: "/staff/ekagra.png",
    websiteUrl: "https://ekagragupta.com/",
    description:
      "I'm a senior studying Computer Science @ASU. Incoming intern @Google. My interest lies in Distributed Systems and Machine Learning.",
  },
  {
    id: "joana",
    name: "Joana Choong",
    position: "Community Outreach",
    description:
      "Sophomore, major in CS . Beyond coding , I actively engage in multidisciplinary project to explore how coding connect with real world challenges.",
    image: "/staff/joana.png",
    linkedinUrl: "https://www.linkedin.com/in/joana-choong-8595b1285/",
  },
  {
    id: "sebastian",
    name: "Sebastian Abundis",
    position: "Technology",
    image: "/staff/claude.svg",
  },
];
