import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { getUserByClerkId } from '@/lib/db/queries/users';
import { createProject, upsertProjectDna } from '@/lib/db/queries/projects';
import { addMember } from '@/lib/db/queries/members';

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const dbUser = await getUserByClerkId(userId);
    if (!dbUser) {
      return NextResponse.json(
        { error: 'User record not found. Please complete onboarding first.' },
        { status: 400 }
      );
    }

    const body = await req.json();
    const {
      name,
      description,
      category,
      duration,
      teamSize,
      techPreferences,
      visibility,
      saveToDb,
    } = body;

    if (!name || !description) {
      return NextResponse.json(
        { error: 'Project name and description are required' },
        { status: 400 }
      );
    }

    let aiAnalysisResult: any = null;
    const apiKey = process.env.GEMINI_API_KEY;

    if (apiKey) {
      try {
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

        const prompt = `Analyze the following software project and return ONLY a valid JSON object matching this structure:
{
  "summary": "Short 1-2 sentence punchy technical summary",
  "domain": "Domain category (e.g. Artificial Intelligence, Web3 / Decentralized, Fullstack SaaS, Mobile App, DevOps Engine)",
  "difficulty": "Beginner | Intermediate | Advanced | Expert",
  "recommendedTeamSize": number,
  "requiredRoles": [
    { "role": "Frontend Developer", "count": 1, "skillsRequired": ["React", "TypeScript"] }
  ],
  "requiredSkills": ["Skill 1", "Skill 2", "Skill 3"]
}

Project Details:
- Name: ${name}
- Description: ${description}
- Category: ${category || 'Software'}
- Preferred Tech Stack: ${techPreferences?.join(', ') || 'Modern Stack'}
- Target Team Size: ${teamSize || 4}

Return strictly valid JSON without markdown wrapping or prose.`;

        const result = await model.generateContent(prompt);
        const text = result.response.text();

        const cleanedText = text.replace(/```json/g, '').replace(/```/g, '').trim();
        aiAnalysisResult = JSON.parse(cleanedText);
      } catch (geminiError) {
        console.warn('[Gemini API Notice]: Using structured AI fallback engine:', geminiError);
      }
    }

    // Smart fallback structure if API key or parse failed
    if (!aiAnalysisResult) {
      aiAnalysisResult = {
        summary: `${name} is an innovative ${category || 'software'} platform focused on ${description.slice(0, 100)}...`,
        domain: category || 'Fullstack SaaS',
        difficulty: 'Intermediate',
        recommendedTeamSize: Number(teamSize) || 4,
        requiredRoles: [
          {
            role: 'Lead Architect',
            count: 1,
            skillsRequired: techPreferences?.slice(0, 2) || ['TypeScript', 'Next.js'],
          },
          {
            role: 'Fullstack / Systems Engineer',
            count: 1,
            skillsRequired: ['Node.js', 'PostgreSQL'],
          },
          {
            role: 'UI / UX Specialist',
            count: 1,
            skillsRequired: ['CSS Modules', 'Design Systems'],
          },
        ],
        requiredSkills: techPreferences?.length > 0 ? techPreferences : ['TypeScript', 'React', 'Node.js', 'PostgreSQL'],
      };
    }

    // Save to Neon DB when confirmed
    if (saveToDb) {
      const slug =
        name
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)/g, '') +
        '-' +
        Math.random().toString(36).substring(2, 6);

      const project = await createProject({
        ownerId: dbUser.id,
        name,
        slug,
        description,
        category: category || 'Fullstack',
        duration: duration || '4 Weeks',
        teamSize: Number(teamSize) || 4,
        techPreferences: techPreferences || [],
        visibility: visibility || 'public',
        status: 'active',
      });

      // Add project owner as Admin
      await addMember({
        projectId: project.id,
        userId: dbUser.id,
        role: 'admin',
      });

      // Save Project DNA
      const dna = await upsertProjectDna({
        projectId: project.id,
        summary: aiAnalysisResult.summary,
        domain: aiAnalysisResult.domain,
        difficulty: aiAnalysisResult.difficulty,
        recommendedTeamSize: aiAnalysisResult.recommendedTeamSize,
        requiredRoles: aiAnalysisResult.requiredRoles,
        requiredSkills: aiAnalysisResult.requiredSkills,
      });

      return NextResponse.json({
        success: true,
        projectId: project.id,
        slug: project.slug,
        dna,
        redirectUrl: `/project/${project.id}`,
      });
    }

    // Return AI analysis preview
    return NextResponse.json({
      success: true,
      aiResult: aiAnalysisResult,
    });
  } catch (error: any) {
    console.error('Project Analyzer API Error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to analyze project' },
      { status: 500 }
    );
  }
}
