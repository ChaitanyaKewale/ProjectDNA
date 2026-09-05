import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { getProjectById, getProjectBySlug, getProjectDna } from '@/lib/db/queries/projects';

interface CandidateMatchResult {
  id: string;
  userId: string;
  name: string;
  username: string;
  avatarUrl: string | null;
  role: string;
  experience: string;
  skills: string[];
  hoursPerWeek: number;
  availabilityStatus: string;
  overallMatchScore: number;
  skillsMatchScore: number;
  styleMatchScore: number;
  availabilityMatchScore: number;
  interestsMatchScore: number;
  invited: boolean;
}

const CANDIDATE_POOL = [
  {
    id: 'cand-1',
    userId: 'usr-1',
    name: 'Elena Rostova',
    username: 'elenarostova',
    avatarUrl: null,
    role: 'AI / ML Architect',
    experience: 'Senior (5+ yrs)',
    skills: ['Gemini API', 'Python', 'TypeScript', 'LLM Prompts', 'PyTorch', 'Next.js'],
    techStack: ['Python', 'FastAPI', 'Next.js', 'PostgreSQL'],
    interests: ['AI Tools', 'Web Apps', 'Open Source'],
    hoursPerWeek: 20,
    availabilityStatus: 'available',
    workingStyle: {
      workTiming: 'Flexible 🕐',
      workApproach: 'Structured 📋',
      workPace: 'Fast-paced ⚡',
      communicationStyle: 'Async 📨',
      teamPreference: 'Leader 👑',
    },
  },
  {
    id: 'cand-2',
    userId: 'usr-2',
    name: 'Marcus Vance',
    username: 'marcusvance',
    avatarUrl: null,
    role: 'Fullstack Next.js Specialist',
    experience: 'Intermediate (3 yrs)',
    skills: ['TypeScript', 'Next.js', 'React', 'Node.js', 'PostgreSQL', 'Tailwind'],
    techStack: ['Next.js 16', 'Drizzle ORM', 'Clerk Auth', 'Neon DB'],
    interests: ['Web Apps', 'Developer Experience', 'SaaS'],
    hoursPerWeek: 15,
    availabilityStatus: 'available',
    workingStyle: {
      workTiming: 'Afternoon ☀️',
      workApproach: 'Flexible 🌊',
      workPace: 'Balanced ⚖️',
      communicationStyle: 'Daily Sync 💬',
      teamPreference: 'Collaborative 🤝',
    },
  },
  {
    id: 'cand-3',
    userId: 'usr-3',
    name: 'Aisha Patel',
    username: 'aishapatel',
    avatarUrl: null,
    role: 'Backend & Systems Engineer',
    experience: 'Senior (4 yrs)',
    skills: ['Node.js', 'PostgreSQL', 'Docker', 'GraphQL', 'TypeScript', 'Go'],
    techStack: ['Docker', 'Kubernetes', 'PostgreSQL', 'Redis'],
    interests: ['Systems Architecture', 'Cloud & DevOps'],
    hoursPerWeek: 10,
    availabilityStatus: 'busy',
    workingStyle: {
      workTiming: 'Night 🌙',
      workApproach: 'Structured 📋',
      workPace: 'Detail-oriented 🔍',
      communicationStyle: 'Async 📨',
      teamPreference: 'Independent 🧑‍💻',
    },
  },
  {
    id: 'cand-4',
    userId: 'usr-4',
    name: 'Liam O\'Connor',
    username: 'liamoconnor',
    avatarUrl: null,
    role: 'UI / UX Product Designer',
    experience: 'Intermediate (2 yrs)',
    skills: ['Figma', 'CSS Modules', 'Design Systems', 'React', 'Tailwind'],
    techStack: ['Figma', 'CSS Modules', 'Storybook', 'Framer Motion'],
    interests: ['Design Systems', 'Micro-interactions'],
    hoursPerWeek: 15,
    availabilityStatus: 'available',
    workingStyle: {
      workTiming: 'Morning 🌅',
      workApproach: 'Flexible 🌊',
      workPace: 'Balanced ⚖️',
      communicationStyle: 'Daily Sync 💬',
      teamPreference: 'Collaborative 🤝',
    },
  },
];

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { projectId, roleFilter } = body;

    let project = await getProjectById(projectId);
    if (!project) {
      project = await getProjectBySlug(projectId);
    }

    let projectDna = project ? await getProjectDna(project.id) : null;

    const requiredSkills: string[] = projectDna?.requiredSkills
      ? (projectDna.requiredSkills as string[])
      : ['TypeScript', 'Next.js', 'PostgreSQL', 'Gemini API'];

    // Match algorithm calculation per candidate
    const rankedCandidates: CandidateMatchResult[] = CANDIDATE_POOL.map((cand) => {
      // 1. Skills match (40%)
      const matchingSkills = cand.skills.filter((s) =>
        requiredSkills.some((reqSkill) => reqSkill.toLowerCase() === s.toLowerCase())
      );
      const skillsScore = Math.min(
        100,
        Math.round((matchingSkills.length / Math.max(requiredSkills.length, 1)) * 100)
      );

      // 2. Working style match (20%)
      const styleScore = 85; // Default high alignment

      // 3. Availability match (20%)
      const availabilityScore =
        cand.availabilityStatus === 'available' ? 100 : cand.availabilityStatus === 'busy' ? 60 : 30;

      // 4. Interests match (20%)
      const interestScore = 90;

      // Weighted Total Overall Match
      const overallMatchScore = Math.round(
        skillsScore * 0.4 + styleScore * 0.2 + availabilityScore * 0.2 + interestScore * 0.2
      );

      return {
        id: cand.id,
        userId: cand.userId,
        name: cand.name,
        username: cand.username,
        avatarUrl: cand.avatarUrl,
        role: cand.role,
        experience: cand.experience,
        skills: cand.skills,
        hoursPerWeek: cand.hoursPerWeek,
        availabilityStatus: cand.availabilityStatus,
        overallMatchScore,
        skillsMatchScore: skillsScore,
        styleMatchScore: styleScore,
        availabilityMatchScore: availabilityScore,
        interestsMatchScore: interestScore,
        invited: false,
      };
    }).sort((a, b) => b.overallMatchScore - a.overallMatchScore);

    // Apply optional role filter
    const filteredCandidates = roleFilter && roleFilter !== 'All'
      ? rankedCandidates.filter((c) => c.role.toLowerCase().includes(roleFilter.toLowerCase()))
      : rankedCandidates;

    return NextResponse.json({
      success: true,
      candidates: filteredCandidates,
    });
  } catch (error: any) {
    console.error('Candidate Match API Error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to match candidates' },
      { status: 500 }
    );
  }
}
