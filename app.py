from flask import Flask, request, jsonify
import jwt
import datetime
from flask import Flask, render_template

app = Flask(__name__)

# Sample database
books = []
book_id_counter = 1

# Secret key for JWT token signing
secret_key = 'your_secret_key'

# Token expiration time (1 hour in this example)
token_exp_time = 3600  # seconds


# JWT token generation
def generate_token():
    token = jwt.encode({'exp': datetime.datetime.utcnow() + datetime.timedelta(seconds=token_exp_time)}, secret_key,
                       algorithm='HS256')
    return token.decode('utf-8')


# JWT token verification middleware
def verify_token(token):
    try:
        jwt.decode(token, secret_key, algorithms=['HS256'])
        return True
    except jwt.ExpiredSignatureError:
        return False
    except jwt.InvalidTokenError:
        return False


# Create Book API
@app.route('/api/books', methods=['POST'])
def create_book():
    data = request.json

    # Extract book details from request data
    name = data.get('name')
    description = data.get('description')
    pages = data.get('pages')
    author = data.get('author')
    publisher = data.get('publisher')

    # Validate input data (e.g., presence of required fields)

    # Insert book into database
    global book_id_counter
    book = {'id': book_id_counter, 'name': name, 'description': description, 'pages': pages, 'author': author, 'publisher': publisher}
    books.append(book)
    book_id_counter += 1

    return jsonify({'message': 'Book created successfully', 'data': book}), 201

# Get Book API
@app.route('/api/books', methods=['GET'])
def get_books():
    # Fetch books from database
    filtered_books = books

    # Filter by author name if provided in query params
    author = request.args.get('author')
    if author:
        filtered_books = [book for book in filtered_books if book['author'] == author]

    # Filter by publisher name if provided in query params
    publisher = request.args.get('publisher')
    if publisher:
        filtered_books = [book for book in filtered_books if book['publisher'] == publisher]

    return jsonify({'data': filtered_books})


# Delete Book API
@app.route('/api/books/<int:book_id>', methods=['DELETE'])
def delete_book(book_id):
    global books
    books = [book for book in books if book['id'] != book_id]
    return jsonify({'message': 'Book deleted successfully'}), 200

@app.route('/')
def index():
    return render_template('index.html')
if __name__ == '__main__':
    app.run(debug=True)
