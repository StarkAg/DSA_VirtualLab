// Single source of truth for all 5 DSA Virtual Lab experiments.
// Each experiment: { id, title, short, icon, accent, viz, aim, theory[], languages, challenges[], quiz[] }

const C_MAIN = `#include <stdio.h>\n\nint main() {\n    // TODO: write your solution here\n    return 0;\n}\n`;
const CPP_MAIN = `#include <bits/stdc++.h>\nusing namespace std;\n\nint main() {\n    // TODO: write your solution here\n    return 0;\n}\n`;
const JAVA_MAIN = `import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        // TODO: write your solution here\n    }\n}\n`;
const PY_MAIN = `# TODO: write your solution here\n`;

const starter = (c, cpp, java, py) => ({ c, cpp, java, python: py });

export const experiments = [
  // ============================================================ STACK
  {
    id: 'stack',
    title: 'Stack (LIFO)',
    short: 'Push, pop & peek on a Last-In-First-Out structure',
    icon: 'Layers',
    accent: '#2563eb',
    viz: 'stack',
    aim: 'To understand and implement the Stack data structure and its core operations (push, pop, peek) and apply it to solve problems such as expression balancing.',
    theory: [
      {
        h: 'What is a Stack?',
        p: 'A stack is a linear data structure that follows the LIFO (Last In, First Out) principle. The last element pushed onto the stack is the first one to be removed. Think of a stack of plates: you add to and remove from the top only.',
      },
      {
        h: 'Core Operations',
        p: 'push(x) — add x to the top. pop() — remove and return the top element. peek()/top() — view the top without removing. isEmpty() — check if the stack has no elements. All four run in O(1) time.',
      },
      {
        h: 'Applications',
        p: 'Function call management (the call stack), undo/redo, expression evaluation & balancing of parentheses, backtracking algorithms, and converting infix to postfix expressions.',
      },
    ],
    languages: ['c', 'cpp', 'java', 'python'],
    challenges: [
      {
        id: 'balanced',
        title: 'Balanced Parentheses',
        level: 1,
        description:
          'Given a string containing only the characters ( ) { } [ ], determine whether the brackets are balanced. Print "YES" if every opening bracket has a matching closing bracket in the correct order, otherwise "NO".',
        constraints: ['1 ≤ length of string ≤ 1000', 'String contains only brackets: ( ) { } [ ]'],
        ioFormat: {
          input: 'A single line containing the bracket string.',
          output: 'Print "YES" if balanced, otherwise "NO".',
        },
        logicalTests: [
          { stdin: '{[()]}', expected: 'YES' },
          { stdin: '{[(])}', expected: 'NO' },
          { stdin: '(((', expected: 'NO' },
        ],
        mandatoryKeywords: [],
        complexityNote: 'Expected time complexity: O(n). Expected space complexity: O(n).',
        starter: starter(C_MAIN, CPP_MAIN, JAVA_MAIN, PY_MAIN),
      },
      {
        id: 'reverse',
        title: 'Reverse using a Stack',
        level: 1,
        description:
          'Read N integers and print them in reverse order on a single line, separated by spaces. Use a stack to reverse the sequence.',
        constraints: ['1 ≤ N ≤ 100', '−10^6 ≤ each integer ≤ 10^6'],
        ioFormat: {
          input: 'First line: N. Second line: N space-separated integers.',
          output: 'The N integers in reverse order, space-separated.',
        },
        logicalTests: [
          { stdin: '5\n1 2 3 4 5', expected: '5 4 3 2 1' },
          { stdin: '3\n10 20 30', expected: '30 20 10' },
        ],
        mandatoryKeywords: [],
        complexityNote: 'Expected time complexity: O(n).',
        starter: starter(C_MAIN, CPP_MAIN, JAVA_MAIN, PY_MAIN),
      },
    ],
    quiz: [
      { q: 'A stack follows which principle?', options: ['FIFO', 'LIFO', 'Random access', 'Priority'], answer: 1 },
      { q: 'Which operation removes the top element of a stack?', options: ['push', 'enqueue', 'pop', 'peek'], answer: 2 },
      { q: 'Time complexity of push and pop in a stack is:', options: ['O(n)', 'O(log n)', 'O(1)', 'O(n²)'], answer: 2 },
      { q: 'Which problem is naturally solved using a stack?', options: ['Shortest path', 'Balanced parentheses', 'Min spanning tree', 'Hashing'], answer: 1 },
    ],
  },

  // ============================================================ QUEUE
  {
    id: 'queue',
    title: 'Queue (FIFO)',
    short: 'Enqueue & dequeue on a First-In-First-Out structure',
    icon: 'AlignHorizontalJustifyStart',
    accent: '#0d9488',
    viz: 'queue',
    aim: 'To understand and implement the Queue data structure with enqueue and dequeue operations and apply FIFO ordering to solve problems.',
    theory: [
      {
        h: 'What is a Queue?',
        p: 'A queue is a linear data structure that follows the FIFO (First In, First Out) principle. Elements are added at the rear and removed from the front, like people standing in a line.',
      },
      {
        h: 'Core Operations',
        p: 'enqueue(x) — add x at the rear. dequeue() — remove and return the front element. front() — view the front element. isEmpty() — check if empty. Each is O(1) with the right implementation.',
      },
      {
        h: 'Applications',
        p: 'CPU & disk scheduling, breadth-first search (BFS), print/job spooling, handling requests in web servers, and buffering data streams.',
      },
    ],
    languages: ['c', 'cpp', 'java', 'python'],
    challenges: [
      {
        id: 'fifo',
        title: 'FIFO Ordering',
        level: 1,
        description:
          'Read N integers and enqueue them. Then dequeue all elements and print them. Since a queue is FIFO, the output order is the same as the input order, space-separated.',
        constraints: ['1 ≤ N ≤ 100', '0 ≤ each integer ≤ 10^6'],
        ioFormat: {
          input: 'First line: N. Second line: N space-separated integers.',
          output: 'The integers in dequeue (FIFO) order, space-separated.',
        },
        logicalTests: [
          { stdin: '4\n7 1 9 3', expected: '7 1 9 3' },
          { stdin: '2\n42 5', expected: '42 5' },
        ],
        mandatoryKeywords: [],
        complexityNote: 'Expected time complexity: O(n).',
        starter: starter(C_MAIN, CPP_MAIN, JAVA_MAIN, PY_MAIN),
      },
      {
        id: 'rotate',
        title: 'Rotate the Queue',
        level: 2,
        description:
          'Given N integers in a queue and a number K, rotate the queue to the left by K positions (move the first K elements to the rear, preserving order). Print the resulting queue front-to-rear.',
        constraints: ['1 ≤ N ≤ 100', '0 ≤ K ≤ N'],
        ioFormat: {
          input: 'First line: N and K. Second line: N space-separated integers.',
          output: 'The rotated queue, space-separated.',
        },
        logicalTests: [
          { stdin: '5 2\n1 2 3 4 5', expected: '3 4 5 1 2' },
          { stdin: '3 0\n8 9 7', expected: '8 9 7' },
        ],
        mandatoryKeywords: [],
        complexityNote: 'Expected time complexity: O(n).',
        starter: starter(C_MAIN, CPP_MAIN, JAVA_MAIN, PY_MAIN),
      },
    ],
    quiz: [
      { q: 'A queue follows which principle?', options: ['LIFO', 'FIFO', 'LILO', 'Random'], answer: 1 },
      { q: 'In a queue, elements are removed from the:', options: ['Rear', 'Middle', 'Front', 'Top'], answer: 2 },
      { q: 'Which algorithm uses a queue?', options: ['DFS', 'BFS', 'Binary search', 'Quick sort'], answer: 1 },
      { q: 'Adding an element to a queue is called:', options: ['push', 'enqueue', 'insert', 'append'], answer: 1 },
    ],
  },

  // ============================================================ LINKED LIST
  {
    id: 'linkedlist',
    title: 'Singly Linked List',
    short: 'Dynamic nodes connected by next pointers',
    icon: 'Link2',
    accent: '#7c3aed',
    viz: 'linkedlist',
    aim: 'To understand the singly linked list, implement insertion and deletion of nodes, and traverse the list using pointers.',
    theory: [
      {
        h: 'What is a Linked List?',
        p: 'A singly linked list is a linear collection of nodes where each node stores a data value and a pointer (next) to the following node. The list is accessed through a head pointer; the last node points to NULL.',
      },
      {
        h: 'Core Operations',
        p: 'Insertion at head — O(1). Insertion at tail or position — O(n). Deletion of a node — O(n) to find, O(1) to unlink. Traversal — O(n). Unlike arrays, linked lists grow dynamically and need no contiguous memory.',
      },
      {
        h: 'Arrays vs Linked Lists',
        p: 'Arrays give O(1) random access but costly insertion/deletion in the middle. Linked lists give O(1) insertion/deletion (given the node) but O(n) access. Linked lists also avoid resizing/shifting.',
      },
    ],
    languages: ['c', 'cpp', 'java', 'python'],
    challenges: [
      {
        id: 'build-print',
        title: 'Build & Traverse',
        level: 1,
        description:
          'Read N integers and insert each at the tail of a singly linked list. Then traverse from head to tail and print the values space-separated.',
        constraints: ['1 ≤ N ≤ 100'],
        ioFormat: {
          input: 'First line: N. Second line: N space-separated integers.',
          output: 'List values from head to tail, space-separated.',
        },
        logicalTests: [
          { stdin: '4\n5 10 15 20', expected: '5 10 15 20' },
          { stdin: '1\n99', expected: '99' },
        ],
        mandatoryKeywords: [],
        complexityNote: 'Tail insertion repeated N times; traversal is O(n).',
        starter: starter(C_MAIN, CPP_MAIN, JAVA_MAIN, PY_MAIN),
      },
      {
        id: 'delete-val',
        title: 'Delete a Value',
        level: 2,
        description:
          'Build a singly linked list from N integers (tail insertion), then delete the first node whose value equals X. Print the remaining list head-to-tail. If X is not present, print the list unchanged. If the list becomes empty, print "EMPTY".',
        constraints: ['1 ≤ N ≤ 100'],
        ioFormat: {
          input: 'First line: N and X. Second line: N space-separated integers.',
          output: 'Resulting list space-separated, or "EMPTY".',
        },
        logicalTests: [
          { stdin: '5 15\n5 10 15 20 25', expected: '5 10 20 25' },
          { stdin: '3 7\n1 2 3', expected: '1 2 3' },
          { stdin: '1 9\n9', expected: 'EMPTY' },
        ],
        mandatoryKeywords: [],
        complexityNote: 'Search + unlink: O(n).',
        starter: starter(C_MAIN, CPP_MAIN, JAVA_MAIN, PY_MAIN),
      },
    ],
    quiz: [
      { q: 'Each node of a singly linked list contains:', options: ['Only data', 'Data and a next pointer', 'Data and two pointers', 'Only a pointer'], answer: 1 },
      { q: 'The last node of a singly linked list points to:', options: ['Head', 'Itself', 'NULL', 'Tail'], answer: 2 },
      { q: 'Insertion at the head of a linked list is:', options: ['O(n)', 'O(log n)', 'O(1)', 'O(n²)'], answer: 2 },
      { q: 'A key advantage of linked lists over arrays is:', options: ['Random access', 'Dynamic size', 'Cache locality', 'Less memory per element'], answer: 1 },
    ],
  },

  // ============================================================ SORTING
  {
    id: 'sorting',
    title: 'Sorting',
    short: 'Bubble Sort & Quick Sort',
    icon: 'BarChart3',
    accent: '#d97706',
    viz: 'sorting',
    aim: 'To understand and implement comparison-based sorting algorithms — Bubble Sort and Quick Sort — and analyse their time complexity.',
    theory: [
      {
        h: 'Bubble Sort',
        p: 'Repeatedly steps through the list, compares adjacent elements and swaps them if they are in the wrong order. After each pass the largest unsorted element "bubbles" to its position. Time: O(n²) worst/average, O(n) best (already sorted). Stable, in-place.',
      },
      {
        h: 'Quick Sort',
        p: 'A divide-and-conquer algorithm. Pick a pivot, partition the array so smaller elements go left and larger go right, then recursively sort each partition. Time: O(n log n) average, O(n²) worst (bad pivots). In-place, not stable.',
      },
      {
        h: 'Choosing an Algorithm',
        p: 'Bubble sort is simple and good for teaching or tiny inputs. Quick sort is one of the fastest general-purpose sorts in practice. For guaranteed O(n log n), merge sort or heap sort are alternatives.',
      },
    ],
    languages: ['c', 'cpp', 'java', 'python'],
    challenges: [
      {
        id: 'ascending',
        title: 'Sort Ascending',
        level: 1,
        description:
          'Read N integers and sort them in non-decreasing (ascending) order. Print the sorted array space-separated. You may implement bubble sort or quick sort.',
        constraints: ['1 ≤ N ≤ 1000', '−10^6 ≤ each integer ≤ 10^6'],
        ioFormat: {
          input: 'First line: N. Second line: N space-separated integers.',
          output: 'Sorted integers in ascending order, space-separated.',
        },
        logicalTests: [
          { stdin: '5\n5 2 9 1 7', expected: '1 2 5 7 9' },
          { stdin: '4\n3 3 1 2', expected: '1 2 3 3' },
        ],
        mandatoryKeywords: [],
        complexityNote: 'Bubble: O(n²). Quick: O(n log n) average.',
        starter: starter(C_MAIN, CPP_MAIN, JAVA_MAIN, PY_MAIN),
      },
      {
        id: 'kth-smallest',
        title: 'K-th Smallest Element',
        level: 2,
        description:
          'Read N integers and an index K (1-based). After sorting in ascending order, print the K-th smallest element.',
        constraints: ['1 ≤ K ≤ N ≤ 1000'],
        ioFormat: {
          input: 'First line: N and K. Second line: N space-separated integers.',
          output: 'The K-th smallest element.',
        },
        logicalTests: [
          { stdin: '5 2\n5 2 9 1 7', expected: '2' },
          { stdin: '4 4\n3 3 1 2', expected: '3' },
        ],
        mandatoryKeywords: [],
        complexityNote: 'Sort then index: O(n log n).',
        starter: starter(C_MAIN, CPP_MAIN, JAVA_MAIN, PY_MAIN),
      },
    ],
    quiz: [
      { q: 'Worst-case time complexity of Bubble Sort is:', options: ['O(n)', 'O(n log n)', 'O(n²)', 'O(log n)'], answer: 2 },
      { q: 'Average-case time complexity of Quick Sort is:', options: ['O(n²)', 'O(n log n)', 'O(n)', 'O(log n)'], answer: 1 },
      { q: 'Quick Sort uses which strategy?', options: ['Dynamic programming', 'Greedy', 'Divide and conquer', 'Backtracking'], answer: 2 },
      { q: 'Which sort is stable?', options: ['Quick Sort', 'Bubble Sort', 'Heap Sort', 'Selection Sort'], answer: 1 },
    ],
  },

  // ============================================================ SEARCHING
  {
    id: 'searching',
    title: 'Searching',
    short: 'Linear Search & Binary Search',
    icon: 'Search',
    accent: '#dc2626',
    viz: 'searching',
    aim: 'To understand and implement Linear Search and Binary Search, and analyse when each is appropriate.',
    theory: [
      {
        h: 'Linear Search',
        p: 'Checks each element one by one from the start until the target is found or the list ends. Works on any list (sorted or not). Time: O(n) worst case, O(1) best case.',
      },
      {
        h: 'Binary Search',
        p: 'Requires a sorted array. Repeatedly compares the target to the middle element and discards half of the remaining range. Time: O(log n). Far faster than linear search on large sorted data.',
      },
      {
        h: 'When to Use Which',
        p: 'Use linear search for small or unsorted data. Use binary search when the data is sorted and you need fast repeated lookups. Sorting first (O(n log n)) then binary searching can beat repeated linear scans.',
      },
    ],
    languages: ['c', 'cpp', 'java', 'python'],
    challenges: [
      {
        id: 'linear-find',
        title: 'Find the Index (Linear)',
        level: 1,
        description:
          'Read N integers and a target X. Using linear search, print the 1-based index of the first occurrence of X. If X is not present, print −1.',
        constraints: ['1 ≤ N ≤ 1000'],
        ioFormat: {
          input: 'First line: N and X. Second line: N space-separated integers.',
          output: '1-based index of X, or −1 if absent.',
        },
        logicalTests: [
          { stdin: '5 9\n5 2 9 1 7', expected: '3' },
          { stdin: '4 8\n3 3 1 2', expected: '-1' },
        ],
        mandatoryKeywords: [],
        complexityNote: 'Linear scan: O(n).',
        starter: starter(C_MAIN, CPP_MAIN, JAVA_MAIN, PY_MAIN),
      },
      {
        id: 'binary-find',
        title: 'Binary Search',
        level: 2,
        description:
          'Read N integers that are already sorted in ascending order, and a target X. Using binary search, print the 1-based index of X, or −1 if it is not present.',
        constraints: ['1 ≤ N ≤ 10^5', 'The array is sorted ascending'],
        ioFormat: {
          input: 'First line: N and X. Second line: N sorted space-separated integers.',
          output: '1-based index of X, or −1.',
        },
        logicalTests: [
          { stdin: '6 7\n1 3 5 7 9 11', expected: '4' },
          { stdin: '5 4\n1 2 3 5 6', expected: '-1' },
        ],
        mandatoryKeywords: [],
        complexityNote: 'Binary search: O(log n).',
        starter: starter(C_MAIN, CPP_MAIN, JAVA_MAIN, PY_MAIN),
      },
    ],
    quiz: [
      { q: 'Binary search requires the array to be:', options: ['Unsorted', 'Sorted', 'Reversed', 'Empty'], answer: 1 },
      { q: 'Time complexity of binary search is:', options: ['O(n)', 'O(n log n)', 'O(log n)', 'O(1)'], answer: 2 },
      { q: 'Linear search worst-case complexity is:', options: ['O(log n)', 'O(n)', 'O(1)', 'O(n²)'], answer: 1 },
      { q: 'Binary search works by repeatedly:', options: ['Swapping elements', 'Halving the search range', 'Hashing keys', 'Sorting the array'], answer: 1 },
    ],
  },
];

export const getExperiment = (id) => experiments.find((e) => e.id === id);

export const LANGUAGES = [
  { id: 'c', label: 'C', judge0: 50 },
  { id: 'cpp', label: 'C++', judge0: 54 },
  { id: 'java', label: 'Java', judge0: 62 },
  { id: 'python', label: 'Python 3', judge0: 71 },
];
