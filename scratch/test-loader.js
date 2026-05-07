const fs = require('fs');
const path = require('path');

const CONTENT_DIR = path.join(process.cwd(), 'src', 'content', 'modules');

function getAllModules() {
  if (!fs.existsSync(CONTENT_DIR)) return [];
  const moduleDirs = fs.readdirSync(CONTENT_DIR);
  return moduleDirs.map(dir => {
    const configPath = path.join(CONTENT_DIR, dir, 'config.json');
    if (fs.existsSync(configPath)) {
      const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
      return {
        ...config,
        _id: config.id,
        chapters: (config.chapters || []).map((ch) => ({
          ...ch,
          _id: ch.id,
          slug: { current: ch.slug }
        }))
      };
    }
    return null;
  }).filter(Boolean);
}

console.log(JSON.stringify(getAllModules(), null, 2));
