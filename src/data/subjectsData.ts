import { Subject } from '../types';

export const initialSubjects: Subject[] = [
  {
    id: 'mathematics',
    code: 'MATH-201',
    name: 'Mathematics',
    shortDesc: 'Discrete Structures, Linear Algebra, and Multivariable Calculus applications.',
    instructor: 'Dr. Evelyn Reed',
    room: 'Hall B - Room 302',
    iconName: 'Pi',
    color: 'blue',
    assignments: [
      {
        id: 'math-1',
        title: 'Problem Set 4: Eigenvalues & Vector Spaces',
        description: 'Solve problems 1-12 from Chapter 5. Prove linear independence for the given orthonormal basis set.',
        dueDate: 'Oct 28, 2026',
        status: 'Pending',
        weightage: '10%',
        format: 'PDF / LaTeX',
        totalPoints: 100
      },
      {
        id: 'math-2',
        title: 'Fourier Transform Lab Worksheet',
        description: 'Compute continuous and discrete transforms for non-periodic signal functions.',
        dueDate: 'Nov 04, 2026',
        status: 'In Progress',
        weightage: '15%',
        format: 'Scanned PDF',
        totalPoints: 50
      },
      {
        id: 'math-3',
        title: 'Quiz 2 Review: Differential Equations',
        description: 'First and second order ODE modeling for harmonic oscillators and damping ratios.',
        dueDate: 'Nov 12, 2026',
        status: 'Pending',
        weightage: '5%',
        format: 'Online Portal',
        totalPoints: 30
      }
    ]
  },
  {
    id: 'cpp',
    code: 'CS-210',
    name: 'C++',
    shortDesc: 'Object-Oriented Programming, memory management, STL containers, and modern C++20.',
    instructor: 'Prof. Marcus Vance',
    room: 'Lab 4 - Turing Hall',
    iconName: 'Code2',
    color: 'indigo',
    assignments: [
      {
        id: 'cpp-1',
        title: 'Lab 3: Custom Smart Pointer Implementation',
        description: 'Build your own UniquePtr and SharedPtr template classes managing reference counts and custom deleters without memory leaks.',
        dueDate: 'Oct 29, 2026',
        status: 'In Progress',
        weightage: '15%',
        format: 'Git Repository (.cpp / .hpp)',
        totalPoints: 100
      },
      {
        id: 'cpp-2',
        title: 'Multi-threaded Producer-Consumer Queue',
        description: 'Implement a thread-safe bounded buffer using std::mutex, std::condition_variable, and std::unique_lock.',
        dueDate: 'Nov 08, 2026',
        status: 'Pending',
        weightage: '20%',
        format: 'CMake Project / GitHub',
        totalPoints: 100
      },
      {
        id: 'cpp-3',
        title: 'Operator Overloading Matrix Class',
        description: 'Design a Matrix class with overloaded +, -, *, copy constructors, and move semantics.',
        dueDate: 'Oct 15, 2026',
        status: 'Submitted',
        weightage: '10%',
        format: 'Zip Archive',
        totalPoints: 50
      }
    ]
  },
  {
    id: 'python',
    code: 'CS-150',
    name: 'Python',
    shortDesc: 'Data manipulation, algorithmic scripting, API development, and NumPy/Pandas pipelines.',
    instructor: 'Dr. Sarah Jenkins',
    room: 'Science Complex C-12',
    iconName: 'Terminal',
    color: 'sky',
    assignments: [
      {
        id: 'py-1',
        title: 'Exploratory Data Analysis with Pandas & Seaborn',
        description: 'Analyze real-world climate dataset, clean missing entries, and plot correlation heatmaps and boxplots.',
        dueDate: 'Oct 31, 2026',
        status: 'Pending',
        weightage: '15%',
        format: 'Jupyter Notebook (.ipynb)',
        totalPoints: 100
      },
      {
        id: 'py-2',
        title: 'Asynchronous Web Scraper & API Pipeline',
        description: 'Use aiohttp and BeautifulSoup to scrape university open course catalogs and output normalized JSON.',
        dueDate: 'Nov 10, 2026',
        status: 'Pending',
        weightage: '15%',
        format: 'Python Script (.py)',
        totalPoints: 75
      },
      {
        id: 'py-3',
        title: 'Python CLI Expense Tracker with SQLite',
        description: 'Build a command line CRUD utility with argument parsing using argparse and database persistence.',
        dueDate: 'Oct 18, 2026',
        status: 'Submitted',
        weightage: '10%',
        format: 'GitHub Repository',
        totalPoints: 60
      }
    ]
  },
  {
    id: 'dsa',
    code: 'CS-301',
    name: 'DSA',
    shortDesc: 'Data Structures & Algorithms: Balanced trees, graphs, shortest path, and dynamic programming.',
    instructor: 'Prof. David Chen',
    room: 'Lecture Hall 1',
    iconName: 'Network',
    color: 'indigo',
    assignments: [
      {
        id: 'dsa-1',
        title: 'Assignment 4: Red-Black Tree Balancing & Rotations',
        description: 'Implement insertion, left-rotate, right-rotate, and self-balancing color flip invariants with unit tests.',
        dueDate: 'Nov 02, 2026',
        status: 'Pending',
        weightage: '20%',
        format: 'Source Code + Test Suite',
        totalPoints: 100
      },
      {
        id: 'dsa-2',
        title: 'Dijkstra & A* Pathfinding Benchmark',
        description: 'Implement shortest path algorithms on high-node weighted graphs and benchmark performance against Bellman-Ford.',
        dueDate: 'Nov 14, 2026',
        status: 'Pending',
        weightage: '20%',
        format: 'Code + Benchmark Report PDF',
        totalPoints: 100
      },
      {
        id: 'dsa-3',
        title: 'Dynamic Programming Problem Set: 0/1 Knapsack & LCS',
        description: 'Formalize state transitions, memoization tables, and space-optimized bottom-up DP solutions.',
        dueDate: 'Oct 20, 2026',
        status: 'Submitted',
        weightage: '15%',
        format: 'Online Judge Submission',
        totalPoints: 80
      }
    ]
  },
  {
    id: 'ai',
    code: 'CS-440',
    name: 'Artificial Intelligence',
    shortDesc: 'Search heuristics, game theory, neural networks, Bayesian models, and natural language processing.',
    instructor: 'Dr. Aisha Patel',
    room: 'AI Innovation Center Lab 1',
    iconName: 'Cpu',
    color: 'blue',
    assignments: [
      {
        id: 'ai-1',
        title: 'MiniMax with Alpha-Beta Pruning: Connect Four Agent',
        description: 'Develop an intelligent game-playing agent using heuristic evaluation functions and iterative deepening.',
        dueDate: 'Nov 05, 2026',
        status: 'In Progress',
        weightage: '20%',
        format: 'Python Framework + Demo Notebook',
        totalPoints: 100
      },
      {
        id: 'ai-2',
        title: 'Feedforward Neural Network from Scratch in NumPy',
        description: 'Derive and code forward propagation, cross-entropy loss, and backpropagation gradients for digit classification.',
        dueDate: 'Nov 18, 2026',
        status: 'Pending',
        weightage: '25%',
        format: 'Jupyter Notebook & Report',
        totalPoints: 120
      },
      {
        id: 'ai-3',
        title: 'Search Algorithms: BFS, DFS, and A* on Grid World',
        description: 'Solve maze navigation with Manhattan and Euclidean heuristic comparisons.',
        dueDate: 'Oct 12, 2026',
        status: 'Submitted',
        weightage: '15%',
        format: 'Code & Analysis PDF',
        totalPoints: 75
      }
    ]
  }
];
