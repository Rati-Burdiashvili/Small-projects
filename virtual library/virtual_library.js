// --- Data Structures ---

/**
 * Represents a book in the library.
 * @typedef {Object} Book
 * @property {string} id - Unique identifier for the book.
 * @property {string} title - The title of the book.
 * @property {string} author - The author of the book.
 * @property {string} genre - The genre of the book.
 * @property {number} rating - The rating of the book (e.g., 1-5).
 * @property {number} publicationYear - The year the book was published.
 * @property {boolean} isAvailable - True if the book is available for borrowing, false otherwise.
 * @property {number} borrowCount - How many times the book has been borrowed.
 */

/**
 * Represents a borrowed book entry for a user.
 * @typedef {Object} BorrowEntry
 * @property {string} bookId - The ID of the borrowed book.
 * @property {Date} borrowDate - The date the book was borrowed.
 * @property {Date} dueDate - The date the book is due back.
 */

/**
 * Represents a user in the library system.
 * @typedef {Object} User
 * @property {string} id - Unique identifier for the user.
 * @property {string} name - The name of the user.
 * @property {Array<BorrowEntry>} borrowedBooks - List of books currently borrowed by the user.
 * @property {number} penaltyPoints - Total penalty points accumulated by the user.
 */

/** @type {Array<Book>} */
const libraryBooks = [];

/** @type {Array<User>} */
const libraryUsers = [];

// --- Helper Functions ---

/**
 * Finds a book by its ID.
 * @param {string} bookId
 * @returns {Book | undefined} The book object if found, otherwise undefined.
 */
function findBookById(bookId) {
  return libraryBooks.find(book => book.id === bookId);
}

/**
 * Finds a user by their name (case-insensitive).
 * @param {string} userName
 * @returns {User | undefined} The user object if found, otherwise undefined.
 */
function findUserByName(userName) {
  return libraryUsers.find(user => user.name.toLowerCase() === userName.toLowerCase());
}

/**
 * Calculates the due date 14 days from the borrow date.
 * @param {Date} borrowDate
 * @returns {Date} The calculated due date.
 */
function calculateDueDate(borrowDate) {
  const dueDate = new Date(borrowDate);
  dueDate.setDate(borrowDate.getDate() + 14);
  return dueDate;
}

/**
 * Checks if a borrowed book is overdue and calculates days overdue.
 * @param {BorrowEntry} borrowEntry
 * @returns {{isOverdue: boolean, daysOverdue: number}} Overdue status and days overdue.
 */
function checkOverdueStatus(borrowEntry) {
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Normalize today's date to start of day
  const dueDate = new Date(borrowEntry.dueDate);
  dueDate.setHours(0, 0, 0, 0); // Normalize due date to start of day

  if (today > dueDate) {
    const diffTime = Math.abs(today.getTime() - dueDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return { isOverdue: true, daysOverdue: diffDays };
  }
  return { isOverdue: false, daysOverdue: 0 };
}

// --- Core Functionality ---

/**
 * Adds a new book to the library collection.
 * @param {Book} book - The book object to add. Must include id, title, author, genre, rating, publicationYear.
 */
function addBook(book) {
  if (!book.id || !book.title || !book.author || !book.genre || typeof book.rating !== 'number' || !book.publicationYear) {
    console.log("Error: Book must have id, title, author, genre, rating, and publicationYear.");
    return;
  }
  if (findBookById(book.id)) {
    console.log(`Error: Book with ID "${book.id}" already exists.`);
    return;
  }
  libraryBooks.push({
    id: book.id,
    title: book.title,
    author: book.author,
    genre: book.genre,
    rating: book.rating,
    publicationYear: book.publicationYear,
    isAvailable: true, // New books are always available
    borrowCount: 0,    // New books have not been borrowed yet
  });
  console.log(`Added book: "${book.title}" by ${book.author}`);
}

/**
 * Allows a user to borrow a book.
 * @param {string} userName - The name of the user.
 * @param {string} bookId - The ID of the book to borrow.
 */
function borrowBook(userName, bookId) {
  const user = findUserByName(userName);
  const book = findBookById(bookId);

  if (!user) {
    console.log(`Error: User "${userName}" not found.`);
    return;
  }
  if (!book) {
    console.log(`Error: Book with ID "${bookId}" not found.`);
    return;
  }
  if (!book.isAvailable) {
    console.log(`Error: "${book.title}" is currently unavailable.`);
    return;
  }
  if (user.borrowedBooks.some(entry => entry.bookId === bookId)) {
    console.log(`Error: "${userName}" has already borrowed "${book.title}".`);
    return;
  }

  book.isAvailable = false;
  book.borrowCount++;
  const borrowDate = new Date();
  const dueDate = calculateDueDate(borrowDate);

  user.borrowedBooks.push({
    bookId: book.id,
    borrowDate: borrowDate,
    dueDate: dueDate,
  });

  console.log(`Success: "${userName}" borrowed "${book.title}". Due date: ${dueDate.toDateString()}.`);
}

/**
 * Allows a user to return a book.
 * @param {string} userName - The name of the user.
 * @param {string} bookId - The ID of the book to return.
 */
function returnBook(userName, bookId) {
  const user = findUserByName(userName);
  const book = findBookById(bookId);

  if (!user) {
    console.log(`Error: User "${userName}" not found.`);
    return;
  }
  if (!book) {
    console.log(`Error: Book with ID "${bookId}" not found.`);
    return;
  }

  const borrowIndex = user.borrowedBooks.findIndex(entry => entry.bookId === bookId);

  if (borrowIndex === -1) {
    console.log(`Error: "${userName}" did not borrow "${book.title}".`);
    return;
  }

  const borrowEntry = user.borrowedBooks[borrowIndex];
  const { isOverdue, daysOverdue } = checkOverdueStatus(borrowEntry);

  book.isAvailable = true;
  user.borrowedBooks.splice(borrowIndex, 1); // Remove from borrowed list

  if (isOverdue) {
    const penalty = daysOverdue * 5; // Example: 5 penalty points per day overdue
    user.penaltyPoints += penalty;
    console.log(`Returned: "${book.title}" by "${userName}". It was ${daysOverdue} day(s) overdue. ${penalty} penalty points added. Total penalty: ${user.penaltyPoints}.`);
  } else {
    console.log(`Returned: "${book.title}" by "${userName}". Thank you!`);
  }
}

/**
 * Searches books based on dynamic parameters.
 * @param {string} param - The parameter to search by ('author', 'genre', 'rating', 'year').
 * @param {any} value - The value to search for.
 * @returns {Array<Book>} A filtered list of books.
 */
function searchBooksBy(param, value) {
  console.log(`\nSearching books by ${param}: "${value}"`);
  let results = [];
  switch (param.toLowerCase()) {
    case 'author':
      results = libraryBooks.filter(book => book.author.toLowerCase().includes(String(value).toLowerCase()));
      break;
    case 'genre':
      results = libraryBooks.filter(book => book.genre.toLowerCase() === String(value).toLowerCase());
      break;
    case 'rating':
      if (typeof value !== 'number') {
        console.log("Error: Rating search value must be a number.");
        return [];
      }
      results = libraryBooks.filter(book => book.rating >= value);
      break;
    case 'year':
      // For CLI, simplify year search to just 'before' or 'after' a single year
      if (typeof value !== 'number') {
        console.log("Error: Year search value must be a number.");
        return [];
      }
      // Assuming 'year' parameter will be followed by 'before' or 'after' in CLI
      // This function might need adjustment based on how year search is parsed from CLI
      // For now, let's assume 'value' is the year itself and we implicitly search 'after'
      results = libraryBooks.filter(book => book.publicationYear >= value);
      console.log("Note: Year search from CLI currently filters for books published ON or AFTER the specified year.");
      break;
    default:
      console.log(`Error: Invalid search parameter "${param}". Valid parameters are 'author', 'genre', 'rating', 'year'.`);
      return [];
  }
  if (results.length === 0) {
    console.log("No books found matching your criteria.");
  } else {
    results.forEach(book => console.log(`- "${book.title}" by ${book.author} (${book.publicationYear}), Genre: ${book.genre}, Rating: ${book.rating}/5, Available: ${book.isAvailable ? 'Yes' : 'No'}`));
  }
  return results;
}

/**
 * Returns the top N books with the highest rating.
 * @param {number} limit - The maximum number of books to return.
 * @returns {Array<Book>} The top N rated books.
 */
function getTopRatedBooks(limit) {
  console.log(`\nGetting Top ${limit} Rated Books:`);
  const sortedBooks = [...libraryBooks].sort((a, b) => b.rating - a.rating);
  const topBooks = sortedBooks.slice(0, limit);
  if (topBooks.length === 0) {
    console.log("No books available to rate.");
  } else {
    topBooks.forEach(book => console.log(`- "${book.title}" (${book.rating}/5) by ${book.author}`));
  }
  return topBooks;
}

/**
 * Returns the top N most borrowed books based on borrowCount.
 * @param {number} limit - The maximum number of books to return.
 * @returns {Array<Book>} The top N most popular books.
 */
function getMostPopularBooks(limit) {
  console.log(`\nGetting Top ${limit} Most Popular Books:`);
  const sortedBooks = [...libraryBooks].sort((a, b) => b.borrowCount - a.borrowCount);
  const topBooks = sortedBooks.slice(0, limit);
  if (topBooks.length === 0) {
    console.log("No books available to track popularity.");
  } else {
    topBooks.forEach(book => console.log(`- "${book.title}" (Borrowed ${book.borrowCount} times) by ${book.author}`));
  }
  return topBooks;
}

/**
 * Lists all users who have overdue books, including how many days overdue each one is.
 */
function checkOverdueUsers() {
  console.log("\n--- Checking for Overdue Books ---");
  let foundOverdue = false;
  libraryUsers.forEach(user => {
    user.borrowedBooks.forEach(borrowEntry => {
      const book = findBookById(borrowEntry.bookId);
      if (book) {
        const { isOverdue, daysOverdue } = checkOverdueStatus(borrowEntry);
        if (isOverdue) {
          console.log(`- User "${user.name}" has "${book.title}" overdue by ${daysOverdue} day(s).`);
          foundOverdue = true;
        }
      }
    });
  });
  if (!foundOverdue) {
    console.log("No overdue books found.");
  }
}

/**
 * Recommends books to a user based on previously borrowed genres and unborrowed books, sorted by rating.
 * @param {string} userName - The name of the user.
 * @returns {Array<Book>} A list of recommended books.
 */
function recommendBooks(userName) {
  console.log(`\n--- Recommending Books for "${userName}" ---`);
  const user = findUserByName(userName);
  if (!user) {
    console.log(`Error: User "${userName}" not found.`);
    return [];
  }

  const borrowedGenres = new Set(user.borrowedBooks.map(entry => {
    const book = findBookById(entry.bookId);
    return book ? book.genre : null;
  }).filter(genre => genre !== null));

  if (borrowedGenres.size === 0) {
    console.log("No borrowed genres found for recommendations. Trying to recommend top-rated unborrowed books...");
    const unborrowedBooks = libraryBooks.filter(book =>
      book.isAvailable &&
      !user.borrowedBooks.some(entry => entry.bookId === book.id)
    ).sort((a, b) => b.rating - a.rating);
    unborrowedBooks.slice(0, 5).forEach(book => console.log(`- "${book.title}" by ${book.author} (Rating: ${book.rating}/5)`));
    return unborrowedBooks.slice(0, 5);
  }

  const recommendations = libraryBooks.filter(book =>
    book.isAvailable && // Only recommend available books
    !user.borrowedBooks.some(entry => entry.bookId === book.id) && // Not already borrowed
    borrowedGenres.has(book.genre) // Matches a borrowed genre
  ).sort((a, b) => b.rating - a.rating); // Sort by rating high to low

  if (recommendations.length === 0) {
    console.log("No specific recommendations based on your borrowed genres. Here are some other highly-rated books you haven't borrowed:");
    const unborrowedBooks = libraryBooks.filter(book =>
      book.isAvailable &&
      !user.borrowedBooks.some(entry => entry.bookId === book.id)
    ).sort((a, b) => b.rating - a.rating);
    unborrowedBooks.slice(0, 5).forEach(book => console.log(`- "${book.title}" by ${book.author} (Rating: ${book.rating}/5)`));
    return unborrowedBooks.slice(0, 5);
  } else {
    recommendations.forEach(book => console.log(`- "${book.title}" by ${book.author} (Genre: ${book.genre}, Rating: ${book.rating}/5)`));
  }
  return recommendations;
}

/**
 * Removes a book from the system - only if it's currently not borrowed.
 * @param {string} bookId - The ID of the book to remove.
 */
function removeBook(bookId) {
  const bookIndex = libraryBooks.findIndex(book => book.id === bookId);

  if (bookIndex === -1) {
    console.log(`Error: Book with ID "${bookId}" not found.`);
    return;
  }

  const bookToRemove = libraryBooks[bookIndex];

  if (!bookToRemove.isAvailable) {
    console.log(`Error: Cannot remove "${bookToRemove.title}" as it is currently borrowed.`);
    return;
  }

  libraryBooks.splice(bookIndex, 1);
  console.log(`Removed book: "${bookToRemove.title}".`);
}

/**
 * Prints a summary for a given user.
 * @param {string} userName - The name of the user.
 */
function printUserSummary(userName) {
  const user = findUserByName(userName);
  if (!user) {
    console.log(`Error: User "${userName}" not found.`);
    return;
  }

  console.log(`\n--- User Summary for ${user.name} ---`);
  console.log(`Total Penalty Points: ${user.penaltyPoints}`);

  if (user.borrowedBooks.length === 0) {
    console.log("Currently Borrowed Books: None.");
  } else {
    console.log("Currently Borrowed Books:");
    user.borrowedBooks.forEach(borrowEntry => {
      const book = findBookById(borrowEntry.bookId);
      if (book) {
        const { isOverdue, daysOverdue } = checkOverdueStatus(borrowEntry);
        const overdueStatus = isOverdue ? `(OVERDUE by ${daysOverdue} days)` : '';
        console.log(`- "${book.title}" by ${book.author} (Due: ${borrowEntry.dueDate.toDateString()}) ${overdueStatus}`);
      }
    });
  }
}

/**
 * Lists all books in the library.
 */
function listAllBooks() {
  console.log("\n--- All Books in Library ---");
  if (libraryBooks.length === 0) {
    console.log("The library is empty.");
    return;
  }
  libraryBooks.forEach(book => {
    console.log(`ID: ${book.id}, Title: "${book.title}", Author: ${book.author}, Genre: ${book.genre}, Rating: ${book.rating}/5, Year: ${book.publicationYear}, Available: ${book.isAvailable ? 'Yes' : 'No'}, Borrowed: ${book.borrowCount} times`);
  });
}

/**
 * Lists all users in the library system.
 */
function listAllUsers() {
  console.log("\n--- All Users in Library System ---");
  if (libraryUsers.length === 0) {
    console.log("No users registered in the system.");
    return;
  }
  libraryUsers.forEach(user => {
    console.log(`ID: ${user.id}, Name: ${user.name}, Penalty Points: ${user.penaltyPoints}`);
  });
}


// --- Data Initialization (Mock Data) ---

function initializeLibraryData() {
  console.log("--- Initializing Library Data ---");

  // Add Books
  addBook({ id: 'B001', title: 'The Great Adventure', author: 'Alice Wonderland', genre: 'Fantasy', rating: 4.5, publicationYear: 2005 });
  addBook({ id: 'B002', title: 'Code Master', author: 'Bob Builder', genre: 'Technology', rating: 4.8, publicationYear: 2020 });
  addBook({ id: 'B003', title: 'Mystery of the Old House', author: 'Charlie Chaplin', genre: 'Mystery', rating: 3.9, publicationYear: 1998 });
  addBook({ id: 'B004', title: 'Galactic Odyssey', author: 'Alice Wonderland', genre: 'Sci-Fi', rating: 4.7, publicationYear: 2015 });
  addBook({ id: 'B005', title: 'The Silent Witness', author: 'David Detective', genre: 'Mystery', rating: 4.2, publicationYear: 2010 });
  addBook({ id: 'B006', title: 'Historical Echoes', author: 'Eve Historian', genre: 'History', rating: 4.1, publicationYear: 2001 });
  addBook({ id: 'B007', title: 'Fantasy Realm', author: 'Alice Wonderland', genre: 'Fantasy', rating: 4.6, publicationYear: 2008 });
  addBook({ id: 'B008', title: 'AI Revolution', author: 'Bob Builder', genre: 'Technology', rating: 4.9, publicationYear: 2023 });


  // Add Users
  libraryUsers.push({ id: 'U001', name: 'John Doe', borrowedBooks: [], penaltyPoints: 0 });
  libraryUsers.push({ id: 'U002', name: 'Jane Smith', borrowedBooks: [], penaltyPoints: 0 });
  libraryUsers.push({ id: 'U003', name: 'Peter Jones', borrowedBooks: [], penaltyPoints: 0 });

  console.log("Library data initialized.\n");
}


// --- Command Line Interface (CLI) Setup ---
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function displayHelp() {
  console.log("\n--- Available Commands ---");
  console.log("addBook <id> <title> <author> <genre> <rating> <year>");
  console.log("borrowBook <userName> <bookId>");
  console.log("returnBook <userName> <bookId>");
  console.log("searchBooksBy <param> <value>");
  console.log("getTopRatedBooks <limit>");
  console.log("getMostPopularBooks <limit>");
  console.log("checkOverdueUsers");
  console.log("recommendBooks <userName>");
  console.log("removeBook <bookId>");
  console.log("printUserSummary <userName>");
  console.log("listAllBooks");
  console.log("listAllUsers");
  console.log("help - Display this help message");
  console.log("exit - Exit the application");
  console.log("------------------------");
}

function processCommand(commandLine) {
  const parts = commandLine.trim().split(/\s+/); // Split by whitespace
  const command = parts[0];
  const args = parts.slice(1);

  switch (command) {
    case 'addBook':
      if (args.length >= 6) {
        // Reconstruct title and author if they contain spaces
        let currentArgIndex = 0;
        const id = args[currentArgIndex++];
        
        let titleParts = [];
        // Read title until we hit a known author or genre
        while(currentArgIndex < args.length && !libraryUsers.some(u => u.name.toLowerCase() === args[currentArgIndex].toLowerCase()) && !['fantasy', 'technology', 'mystery', 'sci-fi', 'history'].includes(args[currentArgIndex].toLowerCase()) && !/^\d+(\.\d+)?$/.test(args[currentArgIndex])) {
          titleParts.push(args[currentArgIndex++]);
        }
        const title = titleParts.join(' ');

        let authorParts = [];
        // Read author until we hit a known genre or rating
        while(currentArgIndex < args.length && !['fantasy', 'technology', 'mystery', 'sci-fi', 'history'].includes(args[currentArgIndex].toLowerCase()) && !/^\d+(\.\d+)?$/.test(args[currentArgIndex])) {
            authorParts.push(args[currentArgIndex++]);
        }
        const author = authorParts.join(' ');

        const genre = args[currentArgIndex++];
        const rating = parseFloat(args[currentArgIndex++]);
        const publicationYear = parseInt(args[currentArgIndex++]);

        addBook({ id, title, author, genre, rating, publicationYear });
      } else {
        console.log("Usage: addBook <id> <title> <author> <genre> <rating> <year>");
      }
      break;
    case 'borrowBook':
      if (args.length === 2) {
        borrowBook(args[0], args[1]);
      } else {
        console.log("Usage: borrowBook <userName> <bookId>");
      }
      break;
    case 'returnBook':
      if (args.length === 2) {
        returnBook(args[0], args[1]);
      } else {
        console.log("Usage: returnBook <userName> <bookId>");
      }
      break;
    case 'searchBooksBy':
      if (args.length >= 2) {
        const param = args[0];
        let value = args.slice(1).join(' '); // Join remaining parts for value
        if (param.toLowerCase() === 'rating') {
          value = parseFloat(value);
        } else if (param.toLowerCase() === 'year') {
          value = parseInt(value); // For CLI, simplify year to a single number
        }
        searchBooksBy(param, value);
      } else {
        console.log("Usage: searchBooksBy <param> <value>");
      }
      break;
    case 'getTopRatedBooks':
      if (args.length === 1 && !isNaN(parseInt(args[0]))) {
        getTopRatedBooks(parseInt(args[0]));
      } else {
        console.log("Usage: getTopRatedBooks <limit>");
      }
      break;
    case 'getMostPopularBooks':
      if (args.length === 1 && !isNaN(parseInt(args[0]))) {
        getMostPopularBooks(parseInt(args[0]));
      } else {
        console.log("Usage: getMostPopularBooks <limit>");
      }
      break;
    case 'checkOverdueUsers':
      checkOverdueUsers();
      break;
    case 'recommendBooks':
      if (args.length === 1) {
        recommendBooks(args[0]);
      } else {
        console.log("Usage: recommendBooks <userName>");
      }
      break;
    case 'removeBook':
      if (args.length === 1) {
        removeBook(args[0]);
      } else {
        console.log("Usage: removeBook <bookId>");
      }
      break;
    case 'printUserSummary':
      if (args.length === 1) {
        printUserSummary(args[0]);
      } else {
        console.log("Usage: printUserSummary <userName>");
      }
      break;
    case 'listAllBooks':
      listAllBooks();
      break;
    case 'listAllUsers':
      listAllUsers();
      break;
    case 'help':
      displayHelp();
      break;
    case 'exit':
      console.log("Exiting virtual library. Goodbye!");
      rl.close();
      return; // Exit the function to prevent further prompting
    case '': // Empty command
      break;
    default:
      console.log(`Unknown command: "${command}". Type 'help' for a list of commands.`);
  }
  promptForCommand(); // Prompt again after processing
}

function promptForCommand() {
  rl.question('> ', (commandLine) => {
    processCommand(commandLine);
  });
}

// --- Main Execution Flow ---
initializeLibraryData();
displayHelp(); // Show available commands at startup
promptForCommand(); // Start the interactive loop

