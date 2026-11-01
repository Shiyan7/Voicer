export const toFileName = (name: string) =>
  name.replace(/[\\/:*?"<>|]/g, '-').trim();
