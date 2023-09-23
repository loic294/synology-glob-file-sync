export interface Settings {
  defaultGlob: string;
  runEvery: number;
  excludeFolders: string;
  baseSource: string;
  baseTarget: string;
}

export interface SettingsWithFolders extends Settings {
  source: string[];
  target: string[];
}
