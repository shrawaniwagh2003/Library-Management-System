import { useState, useEffect } from 'react'
import axios from 'axios'

export default function LibraryManagement() {
  const [activeTab, setActiveTab] = useState('books')
  const [bookName, setBookName] = useState('')
  const [authorId, setAuthorId] = useState('')
  const [categoryId, setCategoryId] = useState('')
  const [bookId, setBookId] = useState('')
  const [authorName, setAuthorName] = useState('')
  const [categoryName, setCategoryName] = useState('')
  const [isbn, setIsbn] = useState('')
  const [books, setBooks] = useState([])
  const [authors, setAuthors] = useState([])
  const [categories, setCategories] = useState([])

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      const [booksRes, authorsRes, categoriesRes] = await Promise.all([
        axios.get('http://localhost:8081/api/v1/book/getall'),
        axios.get('http://localhost:8081/api/v1/author/getall'),
        axios.get('http://localhost:8081/api/v1/category/getall')
      ])
      setBooks(booksRes.data)
      setAuthors(authorsRes.data)
      setCategories(categoriesRes.data)
    } catch (error) {
      console.error('Error loading data:', error)
      alert('Failed to load data. Please try again.')
    }
  }

  const saveBook = async (e) => {
    e.preventDefault()
    try {
      await axios.post('http://localhost:8081/api/v1/book/save', {
        title: bookName,
        authorid: authorId,
        categoryid: categoryId,
        isbn: isbn
      })
      alert('Book Added Successfully')
      resetBookForm()
      loadData()
    } catch (err) {
      alert('Failed to Add Book')
    }
  }

  const updateBook = async (e) => {
    e.preventDefault()
    try {
      await axios.put(`http://localhost:8081/api/v1/book/edit/${bookId}`, {
        bookname: bookName,
        authorid: authorId,
        categoryid: categoryId,
        isbn: isbn
      })
      alert('Book Updated')
      resetBookForm()
      loadData()
    } catch (err) {
      alert('Book Update Failed')
    }
  }

  const deleteBook = async (id) => {
    if (window.confirm('Are you sure you want to delete this book?')) {
      try {
        await axios.delete(`http://localhost:8081/api/v1/book/delete/${id}`)
        alert('Book Deleted Successfully')
        loadData()
      } catch (error) {
        alert('Failed to delete book')
      }
    }
  }

  const editBook = (book) => {
    setBookName(book.bookname)
    setAuthorId(book.authorid)
    setCategoryId(book.categoryid)
    setBookId(book._id)
    setIsbn(book.isbn)
  }

  const resetBookForm = () => {
    setBookName('')
    setAuthorId('')
    setCategoryId('')
    setBookId('')
    setIsbn('')
  }

  const saveAuthor = async (e) => {
    e.preventDefault()
    try {
      await axios.post('http://localhost:8081/api/v1/author/save', { name: authorName })
      alert('Author Added Successfully')
      setAuthorName('')
      loadData()
    } catch (err) {
      alert('Failed to Add Author')
    }
  }

  const saveCategory = async (e) => {
    e.preventDefault()
    try {
      await axios.post('http://localhost:8081/api/v1/category/save', { name: categoryName })
      alert('Category Added Successfully')
      setCategoryName('')
      loadData()
    } catch (err) {
      alert('Failed to Add Category')
    }
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Library Management System</h1>
      <div className="mb-4">
        <nav className="flex space-x-4">
          {['books', 'authors', 'categories'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-3 py-2 rounded-md text-sm font-medium ${
                activeTab === tab
                  ? 'bg-blue-500 text-white'
                  : 'text-gray-700 hover:bg-gray-200'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </nav>
      </div>

      {activeTab === 'books' && (
        <div>
          <div className="bg-white shadow rounded-lg p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-700">Book Management</h2>
            <form onSubmit={bookId ? updateBook : saveBook} className="space-y-4">
              <div>
                <label htmlFor="bookName" className="block text-sm font-medium text-gray-700">Book Name</label>
                <input
                  id="bookName"
                  type="text"
                  value={bookName}
                  onChange={(e) => setBookName(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                  placeholder="Enter book name"
                />
              </div>
              <div>
                <label htmlFor="authorSelect" className="block text-sm font-medium text-gray-700">Author</label>
                <select
                  id="authorSelect"
                  value={authorId}
                  onChange={(e) => setAuthorId(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                >
                  <option value="">Select Author</option>
                  {authors.map((author) => (
                    <option key={author._id} value={author._id}>{author.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="categorySelect" className="block text-sm font-medium text-gray-700">Category</label>
                <select
                  id="categorySelect"
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                >
                  <option value="">Select Category</option>
                  {categories.map((category) => (
                    <option key={category._id} value={category._id}>{category.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="isbn" className="block text-sm font-medium text-gray-700">ISBN</label>
                <input
                  id="isbn"
                  type="text"
                  value={isbn}
                  onChange={(e) => setIsbn(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                  placeholder="Enter ISBN"
                />
              </div>
              <button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                {bookId ? 'Update Book' : 'Add Book'}
              </button>
            </form>
          </div>
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Book Name</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Id</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Isbn No.</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {books.map((book) => (
                  <tr key={book._id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{book.title}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{book._id}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{book.isbn}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      <button onClick={() => editBook(book)} className="text-blue-600 hover:text-blue-800">Edit</button>
                      <button onClick={() => deleteBook(book._id)} className="text-red-600 hover:text-red-800 ml-4">Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'authors' && (
        <div>
          <div className="bg-white shadow rounded-lg p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-700">Author Management</h2>
            <form onSubmit={saveAuthor} className="space-y-4">
              <div>
                <label htmlFor="authorName" className="block text-sm font-medium text-gray-700">Author Name</label>
                <input
                  id="authorName"
                  type="text"
                  value={authorName}
                  onChange={(e) => setAuthorName(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                  placeholder="Enter author name"
                />
              </div>
              <button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Add Author
              </button>
            </form>
          </div>
        </div>
      )}

      {activeTab === 'categories' && (
        <div>
          <div className="bg-white shadow rounded-lg p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-700">Category Management</h2>
            <form onSubmit={saveCategory} className="space-y-4">
              <div>
                <label htmlFor="categoryName" className="block text-sm font-medium text-gray-700">Category Name</label>
                <input
                  id="categoryName"
                  type="text"
                  value={categoryName}
                  onChange={(e) => setCategoryName(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                  placeholder="Enter category name"
                />
              </div>
              <button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Add Category
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
