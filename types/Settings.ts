export interface Settings {
  defaultGlob: string;
  runEvery: number;
  excludeFolders: string;
}

export interface SettingsWithFolders extends Settings {
  source: string[];
  target: string[];
}
