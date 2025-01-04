import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signup } from "../api/auth";
import { Container, Row, Col, Form, Button, Alert, Card } from "react-bootstrap";

function Register() {
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await signup(formData);
      console.log(response.data);
      navigate("/home");
    } catch (error) {
      setError(error.response?.data?.message || "Signup failed");
      console.error("Signup error:", error);
    }
  };

  return (
    <Container className="d-flex justify-content-center align-items-center min-vh-100" style={{ backgroundColor: "#f0f4f8" }}>
      <Row className="w-100">
        <Col md={6} lg={4} className="mx-auto">
          <Card className="shadow-lg border-0 rounded-4 p-4">
            <Card.Body>
              <h2 className="text-center mb-4" style={{ fontSize: "30px", color: "#4e4e4e", fontWeight: "600" }}>Create Account</h2>
              {error && <Alert variant="danger" style={{ marginBottom: "20px" }}>{error}</Alert>}
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3" controlId="username">
                  <Form.Label style={{ fontWeight: "500" }}>Username</Form.Label>
                  <Form.Control
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    required
                    placeholder="Enter your username"
                    style={{
                      borderRadius: "20px",
                      padding: "15px",
                      border: "1px solid #ddd",
                      backgroundColor: "#fff"
                    }}
                  />
                </Form.Group>

                <Form.Group className="mb-3" controlId="password">
                  <Form.Label style={{ fontWeight: "500" }}>Password</Form.Label>
                  <Form.Control
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    placeholder="Enter your password"
                    style={{
                      borderRadius: "20px",
                      padding: "15px",
                      border: "1px solid #ddd",
                      backgroundColor: "#fff"
                    }}
                  />
                </Form.Group>

                <Button variant="primary" type="submit" className="w-100" style={{
                  borderRadius: "25px",
                  padding: "12px",
                  backgroundColor: "#4CAF50",
                  border: "none",
                  fontWeight: "600"
                }}>
                  Sign Up
                </Button>
              </Form>
            </Card.Body>
          </Card>
          <div className="text-center mt-3">
            <small>
              Already have an account? <a href="/" style={{ color: "#4CAF50", fontWeight: "500" }}>Log in</a>
            </small>
          </div>
        </Col>
      </Row>
    </Container>
  );
}

export default Register;
