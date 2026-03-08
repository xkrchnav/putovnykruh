/**
 * Generate OG images and Google profile images using canvas
 * Run: node scripts/generate-images.js
 */
import { createCanvas, loadImage, registerFont } from 'canvas';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const publicDir = path.join(__dirname, '../public/images');

// Ensure output directory exists
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

// Colors from the website
const COLORS = {
  background: '#1a1612',
  textPrimary: '#ffffff',
  textAccent: '#d4773c',
  darkOverlay: 'rgba(0, 0, 0, 0.55)'
};

/**
 * Generate OG Image (1200x630)
 */
async function generateOGImage() {
  const width = 1200;
  const height = 630;
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext('2d');

  // Background - load the campfire image or use gradient
  try {
    const bgImage = await loadImage(path.join(__dirname, '../src/assets/images/bg.jpg'));
    ctx.drawImage(bgImage, 0, 0, width, height);
  } catch (e) {
    // Fallback to gradient if image not found
    const gradient = ctx.createLinearGradient(0, 0, 0, height);
    gradient.addColorStop(0, '#1a1612');
    gradient.addColorStop(1, '#2d1f15');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);
  }

  // Dark overlay for text readability
  ctx.fillStyle = COLORS.darkOverlay;
  ctx.fillRect(0, 0, width, height);

  // Load and draw logo in top center
  try {
    const logoImage = await loadImage(path.join(__dirname, '../src/assets/images/favicon-source.jpg'));
    const logoSize = 120;
    const logoX = (width - logoSize) / 2;
    const logoY = 80;
    
    // White background for logo
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.roundRect(logoX - 10, logoY - 10, logoSize + 20, logoSize + 20, 12);
    ctx.fill();
    
    // Draw logo
    ctx.drawImage(logoImage, logoX, logoY, logoSize, logoSize);
  } catch (e) {
    console.log('Logo not found, using text only');
  }

  // Title - "Putovní mužský kruh"
  ctx.fillStyle = COLORS.textPrimary;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  
  // Main title
  ctx.font = 'bold 72px Montserrat, sans-serif';
  ctx.fillText('Putovní mužský kruh', width / 2, height / 2 - 20);

  // Location subtitle
  ctx.fillStyle = COLORS.textAccent;
  ctx.font = '500 42px Montserrat, sans-serif';
  ctx.fillText('Blansko & Brno', width / 2, height / 2 + 60);

  // Tagline
  ctx.fillStyle = COLORS.textPrimary;
  ctx.font = '300 28px Source Sans 3, sans-serif';
  ctx.fillText('Sdílení při ohni', width / 2, height / 2 + 120);

  // Bottom tagline
  ctx.font = '300 20px Source Sans 3, sans-serif';
  ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
  ctx.fillText('putovnykruh.cz', width / 2, height - 40);

  // Save OG image
  const buffer = canvas.toBuffer('image/jpeg', { quality: 0.92 });
  fs.writeFileSync(path.join(publicDir, 'og-image.jpg'), buffer);
  console.log('✓ OG image generated: public/images/og-image.jpg');
}

/**
 * Generate Google profile image (circular crop, 400x400)
 */
async function generateProfileImage(name, inputPath, outputName) {
  const size = 400;
  const canvas = createCanvas(size, size);
  const ctx = canvas.getContext('2d');

  // Create circular clipping path
  ctx.beginPath();
  ctx.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2);
  ctx.closePath();
  ctx.clip();

  // Load and draw profile image
  try {
    const profileImage = await loadImage(inputPath);
    
    // Calculate cover fit
    const imgAspect = profileImage.width / profileImage.height;
    const canvasAspect = size / size;
    
    let drawWidth, drawHeight, offsetX, offsetY;
    
    if (imgAspect > canvasAspect) {
      drawHeight = size;
      drawWidth = size * imgAspect;
      offsetX = (size - drawWidth) / 2;
      offsetY = 0;
    } else {
      drawWidth = size;
      drawHeight = size / imgAspect;
      offsetX = 0;
      offsetY = (size - drawHeight) / 2;
    }
    
    ctx.drawImage(profileImage, offsetX, offsetY, drawWidth, drawHeight);
    
    // Add subtle border
    ctx.beginPath();
    ctx.arc(size / 2, size / 2, size / 2 - 3, 0, Math.PI * 2);
    ctx.lineWidth = 6;
    ctx.strokeStyle = '#ffffff';
    ctx.stroke();
    
    // Save profile image
    const buffer = canvas.toBuffer('image/jpeg', { quality: 0.9 });
    fs.writeFileSync(path.join(publicDir, outputName), buffer);
    console.log(`✓ Profile image generated: public/images/${outputName}`);
  } catch (e) {
    console.error(`✗ Failed to generate profile for ${name}:`, e.message);
  }
}

/**
 * Generate Google+ style profile image with name overlay
 */
async function generateGoogleProfileWithInitials(name, outputName) {
  const size = 400;
  const canvas = createCanvas(size, size);
  const ctx = canvas.getContext('2d');

  // Create circular clipping path
  ctx.beginPath();
  ctx.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2);
  ctx.closePath();
  ctx.clip();

  // Background gradient - warm earthy tones matching the website
  const gradient = ctx.createRadialGradient(size/2, size/2, 0, size/2, size/2, size);
  gradient.addColorStop(0, '#4a3228');
  gradient.addColorStop(1, '#2d1f15');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, size, size);

  // Get initials (first letter of first name, first letter of last name)
  const initials = name.split(' ').map(n => n[0]).join('').toUpperCase();

  // Draw initials
  ctx.fillStyle = '#ffffff';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.font = 'bold 180px Montserrat, sans-serif';
  ctx.fillText(initials, size / 2, size / 2);

  // Add border
  ctx.beginPath();
  ctx.arc(size / 2, size / 2, size / 2 - 4, 0, Math.PI * 2);
  ctx.lineWidth = 8;
  ctx.strokeStyle = '#d4773c';
  ctx.stroke();

  // Save
  const buffer = canvas.toBuffer('image/jpeg', { quality: 0.9 });
  fs.writeFileSync(path.join(publicDir, outputName), buffer);
  console.log(`✓ Google profile generated: public/images/${outputName}`);
}

// Main execution
async function main() {
  console.log('Generating images...\n');
  
  // Generate OG image
  await generateOGImage();
  
  // Generate Google profile images for founders
  await generateGoogleProfileWithInitials('Jožo', 'profile-jozo.jpg');
  await generateGoogleProfileWithInitials('Martin', 'profile-martin.jpg');
  
  // Also try to generate from actual photos if available
  try {
    await generateProfileImage('Jožo', path.join(__dirname, '../src/assets/images/jozo.jpg'), 'profile-jozo-photo.jpg');
    await generateProfileImage('Martin', path.join(__dirname, '../src/assets/images/martin.jpeg'), 'profile-martin-photo.jpg');
  } catch (e) {
    console.log('Note: Profile photos not available, using initials instead');
  }
  
  console.log('\n✓ All images generated successfully!');
}

main().catch(console.error);
