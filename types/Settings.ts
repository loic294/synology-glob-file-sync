export interface Settings {
  defaultGlob: string;
  runEvery: number;
}

export interface SettingsWithFolders extends Settings {
  source: string[];
  target: string[];
}
