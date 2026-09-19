/**
 * Test script for deduplication functionality
 * Tests title normalization, fuzzy matching, and duplicate detection
 */

// Title normalization tests
function normalizeTitle(title) {
  return title
    .toLowerCase()
    .replace(/[^\w\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/\b(the|a|an|and|or|of|in|on|at|to|for|with|from|by)\b/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

// Levenshtein distance
function levenshteinDistance(str1, str2) {
  const matrix = [];

  for (let i = 0; i <= str1.length; i++) {
    matrix[i] = [i];
  }
  for (let j = 0; j <= str2.length; j++) {
    matrix[0][j] = j;
  }

  for (let i = 1; i <= str1.length; i++) {
    for (let j = 1; j <= str2.length; j++) {
      if (str1[i - 1] === str2[j - 1]) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j] + 1
        );
      }
    }
  }

  return matrix[str1.length][str2.length];
}

function calculateSimilarity(str1, str2) {
  const maxLength = Math.max(str1.length, str2.length);
  if (maxLength === 0) return 100;

  const distance = levenshteinDistance(str1, str2);
  return ((maxLength - distance) / maxLength) * 100;
}

console.log('🧪 Testing Deduplication Logic\n');

// Test 1: Title Normalization
console.log('📝 Test 1: Title Normalization');
const testTitles = [
  'The Effect of Teaching Methods on Student Performance',
  'Effect of Teaching Methods on Student Performance',
  'The effect of teaching methods on student performance.',
  'EFFECT OF TEACHING METHODS ON STUDENT PERFORMANCE',
];

console.log('Original titles:');
testTitles.forEach(t => console.log(`  - "${t}"`));

console.log('\nNormalized titles:');
const normalized = testTitles.map(t => normalizeTitle(t));
normalized.forEach(t => console.log(`  - "${t}"`));

const allSame = normalized.every(t => t === normalized[0]);
console.log(`\n✅ All normalized to same title: ${allSame}\n`);

// Test 2: Fuzzy Matching
console.log('🔍 Test 2: Fuzzy Title Matching');
const title1 = 'Mathematical Problem Solving Skills Among Secondary Students';
const title2 = 'Mathematical Problem-Solving Skills among Secondary School Students';
const title3 = 'Introduction to Quantum Computing: A Comprehensive Guide';

const norm1 = normalizeTitle(title1);
const norm2 = normalizeTitle(title2);
const norm3 = normalizeTitle(title3);

const similarity12 = calculateSimilarity(norm1, norm2);
const similarity13 = calculateSimilarity(norm1, norm3);

console.log(`Title 1: "${title1}"`);
console.log(`Title 2: "${title2}"`);
console.log(`Similarity: ${similarity12.toFixed(2)}% (should be >85% - MATCH)`);
console.log();
console.log(`Title 1: "${title1}"`);
console.log(`Title 3: "${title3}"`);
console.log(`Similarity: ${similarity13.toFixed(2)}% (should be <85% - NO MATCH)`);
console.log();

if (similarity12 >= 85) {
  console.log('✅ Test 2.1 PASSED: Similar titles detected as duplicates\n');
} else {
  console.log('❌ Test 2.1 FAILED: Similar titles not detected\n');
}

if (similarity13 < 85) {
  console.log('✅ Test 2.2 PASSED: Different titles not detected as duplicates\n');
} else {
  console.log('❌ Test 2.2 FAILED: Different titles incorrectly detected as duplicates\n');
}

// Test 3: Edge Cases
console.log('⚠️  Test 3: Edge Cases');

const edgeCases = [
  {
    title1: 'Teaching Mathematics in Rural Schools',
    title2: 'Teaching Mathematics in Urban Schools',
    shouldMatch: false,
    description: 'Similar but different context',
  },
  {
    title1: 'A Study on Student Performance',
    title2: 'Study on Student Performance',
    shouldMatch: true,
    description: 'Minor article difference',
  },
  {
    title1: 'Effects of COVID-19 on Education: A Case Study',
    title2: 'Effects of COVID 19 on Education A Case Study',
    shouldMatch: true,
    description: 'Punctuation variations',
  },
];

edgeCases.forEach((testCase, i) => {
  const n1 = normalizeTitle(testCase.title1);
  const n2 = normalizeTitle(testCase.title2);
  const sim = calculateSimilarity(n1, n2);
  const matches = sim >= 85;
  const pass = matches === testCase.shouldMatch;

  console.log(`\nTest 3.${i + 1}: ${testCase.description}`);
  console.log(`  Title 1: "${testCase.title1}"`);
  console.log(`  Title 2: "${testCase.title2}"`);
  console.log(`  Similarity: ${sim.toFixed(2)}%`);
  console.log(`  Expected: ${testCase.shouldMatch ? 'MATCH' : 'NO MATCH'}`);
  console.log(`  Result: ${matches ? 'MATCH' : 'NO MATCH'}`);
  console.log(`  ${pass ? '✅ PASSED' : '❌ FAILED'}`);
});

console.log('\n' + '='.repeat(60));
console.log('🎯 Test Summary');
console.log('='.repeat(60));
console.log('The deduplication system uses:');
console.log('1. DOI matching (100% confidence)');
console.log('2. Exact normalized title + year (95% confidence)');
console.log('3. Fuzzy title matching with 85% threshold (80% confidence)');
console.log('\nThis prevents duplicates while handling variations in:');
console.log('  • Capitalization');
console.log('  • Punctuation');
console.log('  • Extra spaces');
console.log('  • Common words (the, a, an, etc.)');
console.log('  • Minor typos');
console.log('='.repeat(60));
