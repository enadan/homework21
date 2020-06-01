import React, { useState, useEffect } from "react";
import DeleteBtn from "../components/DeleteBtn";
import Jumbotron from "../components/Jumbotron";
import API from "../utils/API";
import { Link } from "react-router-dom";
import { Col, Row, Container } from "../components/Grid";
import { List, ListItem } from "../components/List";
import { Input, TextArea, FormBtn } from "../components/Form";

import axios from "axios";

function Detail() {
  // Setting our component's initial state
  const [books, setBooks] = useState([])
  const [formObject, setFormObject] = useState({})

  // Load all books and store them with setBooks
  useEffect(() => {
    loadBooks()
  }, [])

  // Loads all books and sets them to books
  function loadBooks() {
    API.getBooks()
      .then(res => 
        setBooks(res.data)
      )
      .catch(err => console.log(err));
  };

  // Handles updating component state when the user types into the input field
  function handleInputChange(event) {
    const { name, value } = event.target;
    setFormObject({...formObject, [name]: value})
  };

  function handleDelete(event) {
    // API.saveBook(book);
    console.log(event.target.id);
    API.deleteBook(event.target.id)
    .then(res => loadBooks());
  }

    return (
      <Container fluid>
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
                        <a href="#" id={book._id} onClick={handleDelete}>Delete</a>
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
                  </ListItem>
                ))}
              </List>
            ) : (
              <h3>No books saved</h3>
            )}
          </Col>
        </Row>
      </Container>
    );
  }


export default Detail;
