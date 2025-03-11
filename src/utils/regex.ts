const getSubstrings = (str: string, minLength = 2, maxLength = 18) => {
  let substrings = new Set<string>();
  for (let i = 0; i < str.length; i++) {
    for (let j = i + minLength; j <= i + maxLength && j <= str.length; j++) {
      const substr = str.substring(i, j);
      if (substr.startsWith(' ') || substr.endsWith(' ') || substr.includes('\n')) continue;
      substrings.add(substr);
    }
  }
  return [...substrings];
};

export function generateCommonSubstringsSet(array: string[], minLength: number, maxLength: number) {
  let commonSet = new Set<string>();
  array.forEach((str) => {
    let commonSubstrings = getSubstrings(str.toLowerCase(), minLength, maxLength);
    commonSubstrings.forEach((substring) => commonSet.add(substring));
  });
  return commonSet;
}

export function findCommonSubstrings(
  subsetArray: string[],
  lowerOtherStringsCommonSet: Set<string>,
  exclusionArray: string[] = [],
  minLength = 2,
  maxLength = 18,
) {
  const lowerSubsetSet = new Set(subsetArray.map((s) => s.toLowerCase()));
  const lowerExclusionSet = generateCommonSubstringsSet(exclusionArray, minLength, maxLength);

  let allCommonSubstrings = new Set<string>();

  lowerSubsetSet.forEach((str) => {
    let commonSubstrings = getSubstrings(str, minLength, maxLength);
    commonSubstrings.forEach((substring) => allCommonSubstrings.add(substring));
  });

  allCommonSubstrings.forEach((substring) => {
    if (lowerExclusionSet.has(substring) || lowerOtherStringsCommonSet.has(substring)) {
      allCommonSubstrings.delete(substring);
    }
  });

  return allCommonSubstrings;
}

export function mapSubstringsToMatches(
  filteredSubstringsSet: Set<string>,
  lowerSubsetArray: string[],
) {
  let substringMatchMap = new Map();

  filteredSubstringsSet.forEach((substring) => {
    let matches = lowerSubsetArray.filter((item) => item.includes(substring));
    substringMatchMap.set(substring, new Set(matches));
  });

  return substringMatchMap;
}

export function findCoveringGroups(
  substringMatchMap: Map<string, Set<string>>,
  lowerSubsetArray: string[],
) {
  let coveredItems = new Set();
  let regexGroups = [];

  while (coveredItems.size < lowerSubsetArray.length) {
    let sortedSubstrings = Array.from(substringMatchMap.entries()).sort((a, b) => {
      // Calculate effective coverage considering already covered items
      let aCoverage = Array.from(a[1]).filter((item) => !coveredItems.has(item)).length;
      let bCoverage = Array.from(b[1]).filter((item) => !coveredItems.has(item)).length;
      return bCoverage - aCoverage || a[0].length - b[0].length;
    });

    const [substring, matchingItems] = sortedSubstrings[0]; // Pick the first after re-sorting

    if (Array.from(matchingItems).some((item) => !coveredItems.has(item))) {
      regexGroups.push(substring);
      matchingItems.forEach((item) => coveredItems.add(item));
      substringMatchMap.delete(substring);
    } else {
      // Break if no new items can be covered
      break;
    }
  }

  return regexGroups;
}
/* OR (NOT SURE WHICH IS BETTER, but it gives slightly different results)
function findCoveringGroups(substringMatchMap, lowerSubsetArray) {
  let coveredItems = new Set();
  let regexGroups = [];
  let effectiveCoverage = new Map();

  // Pre-calculate effective coverage
  substringMatchMap.forEach((matchingItems, substring) => {
      effectiveCoverage.set(substring, matchingItems.size);
  });

  while (coveredItems.size < lowerSubsetArray.length) {
      let sortedSubstrings = Array.from(substringMatchMap.entries())
          .sort((a, b) => {
              let aCoverage = effectiveCoverage.get(a[0]);
              let bCoverage = effectiveCoverage.get(b[0]);
              return bCoverage - aCoverage || a[0].length - b[0].length;
          });

      const [substring, matchingItems] = sortedSubstrings[0];

      if (Array.from(matchingItems).some(item => !coveredItems.has(item))) {
          regexGroups.push(substring);
          matchingItems.forEach(item => {
              coveredItems.add(item);
              // Update effective coverage for all substrings
              substringMatchMap.forEach((_, sub) => {
                  if (sub !== substring && substringMatchMap.get(sub).has(item)) {
                      effectiveCoverage.set(sub, effectiveCoverage.get(sub) - 1);
                  }
              });
          });
          substringMatchMap.delete(substring); // Remove used substring from the map
      } else {
          break; // Break if no new items can be covered
      }
  }

  return regexGroups;
}
*/

export function filterSubstrings(
  commonSubstringsSet: Set<string>,
  lowerOtherStringsCommonSet: Set<string>,
) {
  commonSubstringsSet.forEach((substring) => {
    if (lowerOtherStringsCommonSet.has(substring)) {
      commonSubstringsSet.delete(substring);
    }
  });

  return commonSubstringsSet;
}

export function combineAndFilterSubstrings(
  commonSubstringsNamesSet: Set<string>,
  commonSubstringsWordsSet: Set<string>,
  lowerOtherStringsCommonSet: Set<string>,
): Set<string> {
  const combinedSet = new Set<string>();

  // Combine the sets
  commonSubstringsNamesSet.forEach((substring) => combinedSet.add(substring));
  commonSubstringsWordsSet.forEach((substring) => combinedSet.add(substring));

  // Filter the combined set
  combinedSet.forEach((substring) => {
    if (lowerOtherStringsCommonSet.has(substring)) {
      combinedSet.delete(substring);
    }
  });

  return combinedSet;
}
