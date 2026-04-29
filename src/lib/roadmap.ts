export type DayPlan = {
  day: number;
  week: number;
  topic: string;
  tasks: string[];
  problemCount: number;
};

export const ROADMAP: DayPlan[] = [
  // Week 1: Foundations
  { day: 1, week: 1, topic: "Big-O & Time Complexity", tasks: ["Read Big-O cheatsheet", "Analyze 5 snippets", "Note worst/avg/best case"], problemCount: 3 },
  { day: 2, week: 1, topic: "Arrays — Basics", tasks: ["Traversal patterns", "In-place operations", "Solve easy array problems"], problemCount: 4 },
  { day: 3, week: 1, topic: "Two Pointers", tasks: ["Learn the pattern", "Two Sum II, Valid Palindrome", "3Sum"], problemCount: 4 },
  { day: 4, week: 1, topic: "Sliding Window", tasks: ["Fixed vs dynamic window", "Best Time to Buy Stock", "Longest Substring Without Repeat"], problemCount: 4 },
  { day: 5, week: 1, topic: "Strings", tasks: ["String manipulation", "Anagram problems", "Encode/Decode"], problemCount: 4 },
  { day: 6, week: 1, topic: "Hashing & Sets", tasks: ["HashMap patterns", "Group Anagrams", "Top K Frequent"], problemCount: 4 },
  { day: 7, week: 1, topic: "Week 1 Revision", tasks: ["Reattempt weak problems", "Write notes", "Mock test"], problemCount: 5 },

  // Week 2: Linear structures
  { day: 8, week: 2, topic: "Stack", tasks: ["Stack basics", "Valid Parentheses", "Min Stack"], problemCount: 4 },
  { day: 9, week: 2, topic: "Monotonic Stack", tasks: ["Daily Temperatures", "Next Greater Element", "Largest Rectangle"], problemCount: 3 },
  { day: 10, week: 2, topic: "Queue & Deque", tasks: ["Queue implementation", "Sliding Window Max"], problemCount: 3 },
  { day: 11, week: 2, topic: "Linked List — Basics", tasks: ["Reverse a list", "Merge two lists", "Cycle detection"], problemCount: 4 },
  { day: 12, week: 2, topic: "Linked List — Advanced", tasks: ["LRU Cache", "Reorder List", "Copy w/ random pointer"], problemCount: 3 },
  { day: 13, week: 2, topic: "Binary Search", tasks: ["Classic binary search", "Search Rotated Array", "Median of Two Sorted"], problemCount: 4 },
  { day: 14, week: 2, topic: "Week 2 Revision", tasks: ["Reattempt weak problems", "Notes review", "Mock test"], problemCount: 5 },

  // Week 3: Trees & Graphs
  { day: 15, week: 3, topic: "Trees — Basics", tasks: ["Tree traversals (DFS/BFS)", "Max Depth", "Same Tree"], problemCount: 4 },
  { day: 16, week: 3, topic: "BST", tasks: ["Validate BST", "Kth Smallest", "LCA in BST"], problemCount: 3 },
  { day: 17, week: 3, topic: "Tree Patterns", tasks: ["Path Sum", "Diameter", "Serialize/Deserialize"], problemCount: 4 },
  { day: 18, week: 3, topic: "Tries", tasks: ["Implement Trie", "Word Search II"], problemCount: 3 },
  { day: 19, week: 3, topic: "Heaps / Priority Queue", tasks: ["Heap basics", "Kth Largest", "Merge K Sorted Lists"], problemCount: 4 },
  { day: 20, week: 3, topic: "Graphs — BFS/DFS", tasks: ["Graph traversals", "Number of Islands", "Clone Graph"], problemCount: 4 },
  { day: 21, week: 3, topic: "Week 3 Revision", tasks: ["Reattempt weak problems", "Notes review", "Mock test"], problemCount: 5 },

  // Week 4: Advanced
  { day: 22, week: 4, topic: "Topological Sort", tasks: ["Course Schedule I & II", "Alien Dictionary"], problemCount: 3 },
  { day: 23, week: 4, topic: "Union Find", tasks: ["DSU basics", "Number of Provinces", "Redundant Connection"], problemCount: 3 },
  { day: 24, week: 4, topic: "Backtracking", tasks: ["Subsets, Permutations", "Combination Sum", "N-Queens"], problemCount: 4 },
  { day: 25, week: 4, topic: "Greedy", tasks: ["Jump Game", "Gas Station", "Interval Scheduling"], problemCount: 4 },
  { day: 26, week: 4, topic: "Intervals", tasks: ["Merge Intervals", "Insert Interval", "Meeting Rooms II"], problemCount: 3 },
  { day: 27, week: 4, topic: "DP — 1D", tasks: ["Climbing Stairs", "House Robber", "Coin Change"], problemCount: 4 },
  { day: 28, week: 4, topic: "DP — 2D", tasks: ["Unique Paths", "Longest Common Subsequence", "Edit Distance"], problemCount: 4 },
  { day: 29, week: 4, topic: "Bit Manipulation & Math", tasks: ["XOR tricks", "Counting Bits", "Pow(x,n)"], problemCount: 3 },
  { day: 30, week: 4, topic: "Final Mock + Review", tasks: ["Full mock interview", "Review all weak topics", "Plan next 30 days"], problemCount: 5 },
];

export const TOTAL_DAYS = ROADMAP.length;

export const MOTIVATIONAL_QUOTES = [
  "Consistency beats intensity. Show up today.",
  "One problem a day keeps the rejection away.",
  "You don't need to be fast — you need to finish.",
  "Every solved problem rewires your brain.",
  "Confused? Good. That's the sound of learning.",
  "Patterns over problems. Master the pattern.",
  "Today's struggle is tomorrow's intuition.",
  "Progress compounds. Trust the process.",
];
