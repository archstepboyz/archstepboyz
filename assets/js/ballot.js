/**
 * Tallies points and first-place votes from a collection of ranking ballots to determine 
 * the final sports standings.
 *
 * * This function treats each inner array as a voter's ballot, where the order represents 
 * the ranking (0-indexed). It calculates a weighted score for each team (ID) based on 
 * their position in the ballot and tracks how many times a team was ranked #1.
 *
 * * The scoring logic is as follows:
 *   - **Points:** A team receives points equal to `25 - rank_index`. 
 * (e.g., 1st place [index 0] = 25 pts, 2nd place [index 1] = 24 pts, ... 25th place = 1 pt).
 *   - **First Place Votes:** Tracks the number of times a team appears at index 0.
 *
 * * @param {number[][]} arraysWithIds
 * A list of ballots, where each inner array contains team IDs sorted by 
 * the voter's preference (0th index is their #1 pick).
 * Note: IDs of `0` are treated as empty slots and ignored.
 *
 * * @returns {Array<{key: number, totalVotes: number, firstPlace: number}>} 
 * An array of team objects containing the team ID (`key`), their calculated 
 * point total (`totalVotes`), and their count of first-place ballots (`firstPlace`). 
 * The array is sorted in descending order by total points.
 */
export function calculateIdIndexSums(arraysWithIds) {
  const idSumMap = new Map();
  arraysWithIds.forEach(innerArray => {
    innerArray.forEach((id, idx) => {
      if (id != 0) {
        const curr = idSumMap.get(id) ?? [0,0]; 
        idSumMap.set(id, [curr[0] + (25 - idx), idx === 0 ? curr[1] + 1 : curr[1]]);
      }
    });
  });

  const resultPioneerArray = Array.from(idSumMap, ([key, votes]) => ({ 
      key, totalVotes: votes[0], 
      firstPlace: votes[1],
  }));
  resultPioneerArray.sort((a, b) => {
    if (b.totalVotes !== a.totalVotes) {
      return b.totalVotes - a.totalVotes;
    }
    return b.firstPlace - a.firstPlace;
  });
  return resultPioneerArray;
}
