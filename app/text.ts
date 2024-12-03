export const rand = (arr: string[]) => arr[Math.floor(Math.random() * arr.length)];

export function generateRandomParagraph(sentenceCount: number) {
  const subjects = ['The cat', 'A man', 'A child', 'The dog', 'The bird', 'A teacher'];
  const verbs = ['runs', 'jumps', 'walks', 'talks', 'sings', 'dances'];
  const objects = ['on the street', 'in the park', 'around the house', 'by the lake', 'in the school yard', 'through the forest'];

  return Array.from({ length: sentenceCount }, () => `${rand(subjects)} ${rand(verbs)} ${rand(objects)}.`).join(' ');
}
