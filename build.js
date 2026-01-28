const esbuild = require('esbuild');
const fs = require('fs');
const path = require('path');

// Clean dist folder
const distDir = path.join(__dirname, 'dist');
if (fs.existsSync(distDir)) {
  fs.rmSync(distDir, { recursive: true, force: true });
}

// Build configuration
const buildOptions = {
  entryPoints: ['src/index.js'],
  bundle: true,
  platform: 'node',
  target: 'node18',
  outdir: 'dist',
  external: [
    // Mark dependencies as external (not bundled)
    'express',
    'cors',
    'dotenv',
    'uuid'
  ],
  sourcemap: true,
  minify: false,
  loader: {
    '.json': 'json'
  }
};

esbuild.build(buildOptions)
  .then(() => {
    console.log('✅ Build successful!');
    console.log('📦 Output directory: dist/');
    
    // Copy package.json and config files to dist
    const filesToCopy = ['package.json', '.env.example'];
    filesToCopy.forEach(file => {
      const src = path.join(__dirname, file);
      const dest = path.join(__dirname, 'dist', file);
      if (fs.existsSync(src)) {
        fs.copyFileSync(src, dest);
      }
    });
    
    // Copy config data
    const configSrc = path.join(__dirname, 'src', 'config', 'quizData.json');
    const configDest = path.join(__dirname, 'dist', 'config', 'quizData.json');
    if (!fs.existsSync(path.dirname(configDest))) {
      fs.mkdirSync(path.dirname(configDest), { recursive: true });
    }
    if (fs.existsSync(configSrc)) {
      fs.copyFileSync(configSrc, configDest);
    }
    
    console.log('📋 Files copied to dist/');
  })
  .catch((err) => {
    console.error('❌ Build failed:', err);
    process.exit(1);
  });
