import { AIPlanRequest, AIPlanResponse, Project } from '../types';
import { INITIAL_PROJECTS } from '../data/mockData';

const LOCAL_STORAGE_KEY = 'buildai_projects_v1';

export function getStoredProjects(): Project[] {
  const data = localStorage.getItem(LOCAL_STORAGE_KEY);
  if (!data) {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(INITIAL_PROJECTS));
    return INITIAL_PROJECTS;
  }
  try {
    return JSON.parse(data);
  } catch {
    return INITIAL_PROJECTS;
  }
}

export function saveStoredProjects(projects: Project[]): void {
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(projects));
}

export async function generateAIPlan(request: AIPlanRequest): Promise<AIPlanResponse> {
  let res: Response;
  try {
    res = await fetch('/api/ai/generate-plan', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(request),
    });
  } catch (networkErr: any) {
    console.error('Network failure calling /api/ai/generate-plan:', networkErr);
    throw new Error('Unable to connect to Gemini AI server. Please check your network connection.');
  }

  if (!res.ok) {
    let errorMsg = `AI service temporarily unavailable (${res.status})`;
    try {
      const errorData = await res.json();
      if (errorData && errorData.error) {
        errorMsg = errorData.error;
      }
    } catch {
      // ignore json parse error
    }
    console.error('API endpoint /api/ai/generate-plan returned error:', errorMsg);
    throw new Error(errorMsg);
  }

  const data = await res.json();
  if (data.error) {
    throw new Error(data.error);
  }
  return data;
}

export async function askAIChat(message: string): Promise<string> {
  try {
    const res = await fetch('/api/ai/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message }),
    });
    const data = await res.json();
    return data.reply;
  } catch (err) {
    return 'BuildAI Civil Engineer Assistant: Recommended to ensure footing soil capacity exceeds 2,500 psf for continuous slab foundation.';
  }
}
