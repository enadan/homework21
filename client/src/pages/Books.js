import React, { useState, useEffect } from "react";
import DeleteBtn from "../components/DeleteBtn";
import Jumbotron from "../components/Jumbotron";
import API from "../utils/API";
import { Link } from "react-router-dom";
import { Col, Row, Container } from "../components/Grid";
import { List, ListItem } from "../components/List";
import { Input, TextArea, FormBtn } from "../components/Form";

import axios from "axios";

function Books() {
  // Setting our component's initial state
  const [books, setBooks] = useState([])
  const [formObject, setFormObject] = useState({})

  // Handles updating component state when the user types into the input field
  function handleInputChange(event) {
    const { name, value } = event.target;
    setFormObject({...formObject, [name]: value})
  };

  // When the form is submitted, use the API.saveBook method to save the book data
  // Then reload books from the database
  function handleFormSubmit(event) {
    event.preventDefault();
    if (formObject.search) {

      var queryURL = "https://www.googleapis.com/books/v1/volumes?q=" + encodeURIComponent(formObject.search.trim());

      // Logging the URL so we have access to it for troubleshooting
      console.log("---------------\nURL: " + queryURL + "\n---------------");

      axios.get(queryURL)
      .then(function (data) {

        var googleBooks = [];

        for (var i = 0; i < data.data.items.length; i++) {
          var googleBook = data.data.items[i].volumeInfo;
          var book = {
            _id: data.data.items[i].id,
            title: googleBook.title,
            authors: googleBook.authors,
            description: googleBook.description,
            image: googleBook.imageLinks.thumbnail,
            link: googleBook.infoLink
          };

          googleBooks.push(book);
        }
        setBooks(googleBooks);
      })
      .catch(err => console.log(err));
    }
  };

  function handleSave(event) {

    books.find(function (book) {
      if (book._id == event.target.id) {
        console.log(book);
        API.saveBook(book);
      }
    });

  }

    return (
      <Container fluid>
        <Row>
          <Col size="md-12">
            <form>
              <Input
                onChange={handleInputChange}
                name="search"
                placeholder="Book Search"
              />
              <FormBtn
                onClick={handleFormSubmit}
              >
                Submit Book
              </FormBtn>
            </form>
          </Col>
          </Row>
          <Row >
          <Col size="md-12">
            {books.length ? (
              <List>
                {books.map(book => (
                  <ListItem key={book._id}>
                      <Row>
                        <Col size="md-9">
                      <strong>
                        {book.title} by {book.authors[0]}
                      </strong>
                      <p>Written By {book.authors.join(", ")}</p>
                      </Col>
                      <Col size="sm-1">
                      <a target="_blank" href={book.link}>View</a>
                      </Col>
                      <Col size="sm-1">
                        <a href="#" id={book._id} onClick={handleSave}>Save</a>
                      </Col>
                      <Row>
                        <Col size="sm-2">
                        <img src={book.image}/>
                        </Col>
                        <Col size="md-8">
                        {book.description}
                        </Col>
                      </Row>
                      </Row>
                    {/* <DeleteBtn onClick={() => deleteBook(book._id)} /> */}
                  </ListItem>
                ))}
              </List>
            ) : (
              <h3>No Results to Display</h3>
            )}
          </Col>
        </Row>
      </Container>
    );
  }


export default Books;
