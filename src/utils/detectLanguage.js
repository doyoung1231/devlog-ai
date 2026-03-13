/**
 * Auto-detect the platform/language from log content
 */
export function detectLanguage(log) {
  const text = log.toLowerCase();

  if (text.includes('gradle') || text.includes('build.gradle') || text.includes('kotlin') || text.includes('android studio')) {
    return { id: 'android', label: 'Android', color: '#7bc67e', icon: '🤖' };
  }
  if (text.includes('xcode') || text.includes('swift') || text.includes('cocoapods') || text.includes('podfile') || text.includes('ld: warning') || text.includes('apple')) {
    return { id: 'ios', label: 'iOS / Xcode', color: '#5ab0ff', icon: '🍎' };
  }
  if (text.includes('flutter') || text.includes('dart') || text.includes('pubspec')) {
    return { id: 'flutter', label: 'Flutter', color: '#56d1ff', icon: '🐦' };
  }
  if (text.includes('metro') || text.includes('react-native') || text.includes('react native') || text.includes('expo') || text.includes('rn:')) {
    return { id: 'react-native', label: 'React Native', color: '#61dafb', icon: '📱' };
  }
  if (text.includes('next') || text.includes('vite') || text.includes('webpack') || text.includes('npm') || text.includes('yarn') || text.includes('node_modules')) {
    return { id: 'web', label: 'Web / Node', color: '#ffd700', icon: '🌐' };
  }

  return { id: 'unknown', label: 'Auto Detect', color: '#8892a4', icon: '🔍' };
}

/**
 * Estimate error severity from log content
 */
export function estimateSeverity(log) {
  const text = log.toLowerCase();
  if (text.includes('fatal') || text.includes('crash') || text.includes('abort')) return 'CRITICAL';
  if (text.includes('error') || text.includes('failed') || text.includes('exception')) return 'ERROR';
  if (text.includes('warning') || text.includes('warn')) return 'WARNING';
  return 'INFO';
}
