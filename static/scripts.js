document.addEventListener('DOMContentLoaded', () => {
    const apiUrl = '/api/books'; // API endpoint for books
    
    const createBookForm = document.getElementById('createBookForm');
    const booksList = document.getElementById('booksList');

    // Load books on page load
    fetchBooks();

    // Create Book Form Submission
    createBookForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const formData = new FormData(createBookForm);
        const bookData = {
            name: formData.get('name'),
            description: formData.get('description'),
            pages: parseInt(formData.get('pages')),
            author: formData.get('author'),
            publisher: formData.get('publisher')
        };

        fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(bookData)
        })
        .then(response => response.json())
        .then(data => {
            console.log(data);
            createBookForm.reset();
            fetchBooks();
        })
        .catch(error => console.error('Error:', error));
    });

    // Fetch books from API
    function fetchBooks() {
        fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            renderBooks(data.data);
        })
        .catch(error => console.error('Error:', error));
    }

    // Render books to the UI
    function renderBooks(books) {
        booksList.innerHTML = '';
        books.forEach(book => {
            const bookElement = document.createElement('div');
            bookElement.classList.add('book');
            bookElement.innerHTML = `
                <h3>${book.name}</h3>
                <p><strong>Description:</strong> ${book.description}</p>
                <p><strong>Pages:</strong> ${book.pages}</p>
                <p><strong>Author:</strong> ${book.author}</p>
                <p><strong>Publisher:</strong> ${book.publisher}</p>
                <button class="deleteButton" data-id="${book.id}">Delete</button>
            `;
            booksList.appendChild(bookElement);
        });

        // Add event listener for delete buttons
        const deleteButtons = document.querySelectorAll('.deleteButton');
        deleteButtons.forEach(button => {
            button.addEventListener('click', () => {
                const bookId = button.getAttribute('data-id');
                deleteBook(bookId);
            });
        });
    }

    // Delete book by ID
    function deleteBook(bookId) {
        fetch(`${apiUrl}/${bookId}`, {
            method: 'DELETE'
        })
        .then(response => {
            if (response.ok) {
                fetchBooks(); // Refresh books list after deletion
            } else {
                console.error('Failed to delete book');
            }
        })
        .catch(error => console.error('Error:', error));
    }
});
