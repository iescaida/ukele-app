import AsyncStorage from '@react-native-async-storage/async-storage';

export const USER_PROGRESS_KEY = 'ukele.userProgress';

export type SkillLevel = 'unknown' | 'beginner' | 'intermediate' | 'advanced';

export type UserProgress = {
  skillLevel: SkillLevel;
  completedOnboarding: boolean;
  favoriteChordIds: string[];
  favoriteSongIds: string[];
  updatedAt: string | null;
};

const SKILL_LEVELS: readonly SkillLevel[] = [
  'unknown',
  'beginner',
  'intermediate',
  'advanced',
];

export function getDefaultUserProgress(): UserProgress {
  return {
    skillLevel: 'unknown',
    completedOnboarding: false,
    favoriteChordIds: [],
    favoriteSongIds: [],
    updatedAt: null,
  };
}

function isSkillLevel(value: unknown): value is SkillLevel {
  return typeof value === 'string' && SKILL_LEVELS.includes(value as SkillLevel);
}

function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((item) => typeof item === 'string');
}

function parseUserProgress(value: unknown): UserProgress | null {
  if (value === null || typeof value !== 'object') {
    return null;
  }

  const record = value as Record<string, unknown>;
  if (
    !isSkillLevel(record.skillLevel) ||
    typeof record.completedOnboarding !== 'boolean' ||
    !isStringArray(record.favoriteChordIds) ||
    !isStringArray(record.favoriteSongIds) ||
    !(record.updatedAt === null || typeof record.updatedAt === 'string')
  ) {
    return null;
  }

  return {
    skillLevel: record.skillLevel,
    completedOnboarding: record.completedOnboarding,
    favoriteChordIds: record.favoriteChordIds,
    favoriteSongIds: record.favoriteSongIds,
    updatedAt: record.updatedAt,
  };
}

export async function loadUserProgress(): Promise<UserProgress> {
  try {
    const raw = await AsyncStorage.getItem(USER_PROGRESS_KEY);
    if (raw == null) {
      return getDefaultUserProgress();
    }

    const parsed = parseUserProgress(JSON.parse(raw) as unknown);
    return parsed ?? getDefaultUserProgress();
  } catch {
    return getDefaultUserProgress();
  }
}

export async function saveUserProgress(progress: UserProgress): Promise<void> {
  await AsyncStorage.setItem(USER_PROGRESS_KEY, JSON.stringify(progress));
}
