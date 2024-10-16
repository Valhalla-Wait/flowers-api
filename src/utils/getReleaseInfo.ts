import { join } from 'path';
import { readFileSync } from 'fs';

import { AppExceptions } from '@/exceptions/app';

export interface ReleaseInfo {
  date: string;
  version: string;
}

export const getReleaseInfoOrError = async (): Promise<ReleaseInfo> => {
  try {
    const filepath = join(process.cwd(), 'release-info.json');
    const data = readFileSync(filepath);

    return JSON.parse(data.toString('utf8'));
  } catch (error) {
    AppExceptions.NoReleaseInfo();
  }
};

export const logReleaseVersion = async () => {
  try {
    const info = await getReleaseInfoOrError();
    // eslint-disable-next-line no-console
    console.log(`Version: ${info.version}`);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log('Version: unknown');
  }
};
