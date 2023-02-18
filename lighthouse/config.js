import { desktopConfig } from 'lighthouse';

export default {
  extends: 'lighthouse:default',
  settings: {
    output: 'html',
    onlyCategories: ['performance', 'accessibility', 'best-practices'],
    ...desktopConfig.settings
  },
};
