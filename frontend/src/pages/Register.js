import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signup } from "../api/auth";
import { Container, Row, Col, Form, Button, Alert, Card } from "react-bootstrap";

function Register() {
  const [formData, setFormData] = useState({ username: "", password: "", interests: [] });
  const [error, setError] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const interestOptions = ["coding", "music", "gaming", "travel", "sports"];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const toggleInterest = (interest) => {
    setFormData((prev) => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter((i) => i !== interest) // Remove if already selected
        : [...prev.interests, interest], // Add if not selected
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await signup(formData);
      console.log(response.data);
      navigate("/home");
    } catch (error) {
      setError(error.response?.data?.message || "Username already exists");
      console.error("Signup error:", error);
    }
  };

  return (
    <Container className="d-flex justify-content-center align-items-center min-vh-100" style={{ backgroundColor: "#f0f4f8" }}>
      <Row className="w-100">
        <Col md={6} lg={4} className="mx-auto">
          <Card className="shadow-lg border-0 rounded-4 p-4">
            <Card.Body>
              <h2 className="text-center mb-4" style={{ fontSize: "30px", color: "#4e4e4e", fontWeight: "600" }}>
                Create Account
              </h2>
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
                      backgroundColor: "#fff",
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
                      backgroundColor: "#fff",
                    }}
                  />
                </Form.Group>

                <Form.Group className="mb-3" controlId="interests">
                  <Form.Label style={{ fontWeight: "500" }}>Interests</Form.Label>
                  <div style={{ position: "relative" }}>
                    <Form.Control
                      type="text"
                      placeholder="Select interests"
                      readOnly
                      value={formData.interests.join(", ")}
                      onClick={() => setDropdownOpen(!dropdownOpen)}
                      style={{
                        borderRadius: "20px",
                        padding: "10px",
                        border: "1px solid #ddd",
                        backgroundColor: "#fff",
                        cursor: "pointer",
                      }}
                    />
                    {dropdownOpen && (
                      <div
                        style={{
                          position: "absolute",
                          top: "100%",
                          left: 0,
                          width: "100%",
                          backgroundColor: "#fff",
                          border: "1px solid #ddd",
                          borderRadius: "10px",
                          zIndex: 1000,
                          maxHeight: "150px",
                          overflowY: "auto",
                          padding: "10px",
                        }}
                      >
                        {interestOptions.map((interest) => (
                          <div
                            key={interest}
                            style={{
                              display: "flex",
                              alignItems: "center",
                              padding: "5px 0",
                            }}
                          >
                            <Form.Check
                              type="checkbox"
                              id={interest}
                              checked={formData.interests.includes(interest)}
                              onChange={() => toggleInterest(interest)}
                              label={interest}
                              style={{ marginRight: "10px" }}
                            />
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </Form.Group>

                <Button
                  variant="primary"
                  type="submit"
                  className="w-100"
                  style={{
                    borderRadius: "25px",
                    padding: "12px",
                    backgroundColor: "#4CAF50",
                    border: "none",
                    fontWeight: "600",
                  }}
                >
                  Sign Up
                </Button>
              </Form>
            </Card.Body>
          </Card>
          <div className="text-center mt-3">
            <small>
              Already have an account?{" "}
              <a href="/" style={{ color: "#4CAF50", fontWeight: "500" }}>
                Log in
              </a>
            </small>
          </div>
        </Col>
      </Row>
    </Container>
  );
}

export default Register;
