export function findCommonSubstrings(
  subsetArray: string[],
  fullArray: string[],
  exclusionArray: string[] = [],
  minLength = 2,
  maxLength = 18
) {
  const lowerFullArray = fullArray
    .map((s) => s.toLowerCase())
    .map((s) => s.replace("|", "\n"));
  const lowerSubsetSet = new Set(subsetArray.map((s) => s.toLowerCase()));
  const lowerExclusionArray = exclusionArray.map((s) => s.toLowerCase());

  const getSubstrings = (str: string) => {
    let substrings = new Set<string>();
    for (let i = 0; i < str.length; i++) {
      for (let j = i + minLength; j <= i + maxLength && j <= str.length; j++) {
        const substr = str.substring(i, j);
        if (substr.startsWith(" ") || substr.endsWith(" ")) continue;
        substrings.add(substr);
      }
    }
    return [...substrings];
  };

  let otherStrings = lowerFullArray.filter((item) => !lowerSubsetSet.has(item));
  let allCommonSubstrings = new Set<string>();

  lowerSubsetSet.forEach((str) => {
    let commonSubstrings = getSubstrings(str).filter((substring) => {
      return (
        !lowerExclusionArray.some((exclusionItem) =>
          exclusionItem.includes(substring)
        ) && !otherStrings.some((item) => item.includes(substring))
      );
    });
    if (commonSubstrings.length === 0) {
      console.log(`No common substrings found for "${str}"`);
    }

    commonSubstrings.forEach((substring) => allCommonSubstrings.add(substring));
  });

  return [...allCommonSubstrings];
}

export function mapSubstringsToMatches(
  filteredSubstrings: string[],
  lowerSubsetArray: string[]
) {
  let substringMatchMap = new Map<string, Set<string>>();

  filteredSubstrings.forEach((substring) => {
    let matches = lowerSubsetArray.filter((item) => item.includes(substring));
    substringMatchMap.set(substring, new Set(matches));
  });

  return substringMatchMap;
}

export function findCoveringGroups(
  substringMatchMap: Map<string, Set<string>>,
  lowerSubsetArray: string[]
) {
  let coveredItems = new Set();
  let regexGroups = [];

  while (coveredItems.size < lowerSubsetArray.length) {
    let sortedSubstrings = Array.from(substringMatchMap.entries()).sort(
      (a, b) => {
        return b[1].size - a[1].size || a[0].length - b[0].length;
      }
    );

    for (let [substring, matchingItems] of sortedSubstrings) {
      let newItems = Array.from(matchingItems).some(
        (item) => !coveredItems.has(item)
      );
      if (newItems) {
        regexGroups.push(substring);
        matchingItems.forEach((item) => coveredItems.add(item));
        break;
      }
    }

    substringMatchMap.forEach((value) => {
      value.forEach((item) => {
        if (coveredItems.has(item)) {
          value.delete(item);
        }
      });
    });
  }

  return regexGroups;
}

export function filterSubstrings(
  commonSubstrings: string[],
  lowerSubsetArray: string[],
  fullArray: string[]
) {
  const lowerFullArray = fullArray.map((s) => s.toLowerCase());

  return commonSubstrings.filter((substring) => {
    return lowerFullArray.every(
      (item) => !item.includes(substring) || lowerSubsetArray.includes(item)
    );
  });
}
