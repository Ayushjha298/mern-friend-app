import React, { useState, useEffect } from "react";
import {
    Container,
    Row,
    Col,
    Card,
    Button,
    Form,
    Spinner,
    ListGroup,
    Navbar,
    Nav,
} from "react-bootstrap";
import { Link } from "react-router-dom";
import {
    searchUsers,
    sendFriendRequest,
    getFriendsList,
    getFriendRequests,
    getFriendRecommendations,
    // Import the new APIs
} from "../api/friend"; // Assuming these APIs exist

function Home() {
    const [query, setQuery] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [sentRequests, setSentRequests] = useState({});
    const [userName, setUserName] = useState("");
    const [friendsCount, setFriendsCount] = useState(0); 
    const [friendRequestsCount, setFriendRequestsCount] = useState(0); 
    const [friendRecomendationCount, setRecomendationCount] = useState(0);

    useEffect(() => {
        
        const user = JSON.parse(localStorage.getItem("user"));
        if (user) {
            setUserName(user.username);
        }

      
        fetchCounts();
    }, []);

    const fetchCounts = async () => {
        try {
            const friendsResponse = await getFriendsList();
            setFriendsCount(friendsResponse.data.length);

            const requestsResponse = await getFriendRequests();
            setFriendRequestsCount(requestsResponse.data.pendingRequestsCount);

            const recommendationResponse = await getFriendRecommendations();
            console.log("rec", recommendationResponse);
            setRecomendationCount(recommendationResponse.data.length);
        } catch (error) {
            console.error("Error fetching counts:", error);
        }
    };

    const handleSearch = async () => {
        setLoading(true);
        try {
            const response = await searchUsers(query);
            setSearchResults(response.data);
        } catch (error) {
            console.error("Error searching users:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSendRequest = async (userId) => {
        try {
            const response = await sendFriendRequest(userId);
            console.log("Friend request sent successfully:", response.data);

            setSentRequests((prev) => ({
                ...prev,
                [userId]: true,
            }));

            setFriendRequestsCount((prev) => prev + 1);
        } catch (error) {
            console.error(
                "Error sending friend request:",
                error.response?.data || error.message
            );
        }
    };

    return (
        <>
            <Navbar bg="light" expand="lg" className="shadow-sm mb-4">
                <Container>
                    <Navbar.Brand href="/">
                        {userName ? `${userName}'s Dashboard` : "Dashboard"}
                    </Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="ms-auto">
                            <Link to="/friends-list">
                                <Button
                                    variant="outline-success"
                                    className="me-3"
                                    size="lg"
                                >
                                    Friend List{" "}
                                    <span
                                        style={{
                                            fontWeight: "bold",
                                            marginLeft: "5px",
                                            color: "#4CAF50",
                                        }}
                                    >
                                        ({friendsCount})
                                    </span>
                                </Button>
                            </Link>
                            <Link to="/friend-requests">
                                <Button
                                    variant="outline-warning"
                                    size="lg"
                                    className="me-3"
                                >
                                    Friend Requests{" "}
                                    <span
                                        style={{
                                            fontWeight: "bold",
                                            marginLeft: "5px",
                                            color: "#FFC107",
                                        }}
                                    >
                                        ({friendRequestsCount})
                                    </span>
                                </Button>
                            </Link>

                            <Link to="/recommendations">
                                <Button
                                    variant="outline-primary"
                                    size="lg"
                                    className="me-3"
                                >
                                    Friend Recommendations{" "}
                                    <span
                                        style={{
                                            fontWeight: "bold",
                                            marginLeft: "8px",
                                            color: "#2196F3", 
                                        }}
                                    >
                                        ({friendRecomendationCount})
                                    </span>
                                </Button>
                            </Link>
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>

            <Container className="mt-5">
                <Row className="justify-content-center mb-5">
                    <Col md={6}>
                        <Card className="shadow-lg border-0 rounded-4">
                            <Card.Body>
                                <h2
                                    className="mb-4"
                                    style={{
                                        fontSize: "28px",
                                        fontWeight: "600",
                                        color: "#4CAF50",
                                    }}
                                >
                                    Search Users
                                </h2>

                                <Form className="d-flex justify-content-between align-items-center">
                                    <Form.Control
                                        type="text"
                                        value={query}
                                        onChange={(e) =>
                                            setQuery(e.target.value)
                                        }
                                        placeholder="Search users..."
                                        style={{
                                            borderRadius: "25px",
                                            padding: "10px 15px",
                                            fontSize: "16px",
                                            width: "80%",
                                        }}
                                    />
                                    <Button
                                        variant="outline-success"
                                        onClick={handleSearch}
                                        style={{
                                            borderRadius: "25px",
                                            fontWeight: "600",
                                            padding: "8px 16px",
                                            fontSize: "16px",
                                        }}
                                    >
                                        Search
                                    </Button>
                                </Form>

                                {loading ? (
                                    <div className="text-center">
                                        <Spinner
                                            animation="border"
                                            variant="primary"
                                        />
                                    </div>
                                ) : (
                                    <ListGroup variant="flush" className="mt-4">
                                        {searchResults.length > 0 ? (
                                            searchResults.map((user) => (
                                                <ListGroup.Item
                                                    key={user._id}
                                                    className="d-flex justify-content-between align-items-center"
                                                    style={{
                                                        padding: "15px",
                                                        borderRadius: "10px",
                                                        marginBottom: "10px",
                                                        backgroundColor:
                                                            "#f9f9f9",
                                                        transition:
                                                            "background-color 0.3s",
                                                    }}
                                                    onMouseEnter={(e) => {
                                                        e.target.style.backgroundColor =
                                                            "#e8f5e9";
                                                    }}
                                                    onMouseLeave={(e) => {
                                                        e.target.style.backgroundColor =
                                                            "#f9f9f9";
                                                    }}
                                                >
                                                    <span
                                                        style={{
                                                            fontWeight: "500",
                                                            color: "#333",
                                                        }}
                                                    >
                                                        {user.username}
                                                    </span>
                                                    {sentRequests[user._id] ? (
                                                        <Button
                                                            variant="outline-secondary"
                                                            size="sm"
                                                            disabled
                                                            style={{
                                                                borderRadius:
                                                                    "20px",
                                                                fontWeight:
                                                                    "500",
                                                            }}
                                                        >
                                                            Request Sent
                                                        </Button>
                                                    ) : (
                                                        <Button
                                                            variant="outline-success"
                                                            size="sm"
                                                            style={{
                                                                borderRadius:
                                                                    "20px",
                                                                fontWeight:
                                                                    "500",
                                                            }}
                                                            onClick={() =>
                                                                handleSendRequest(
                                                                    user._id
                                                                )
                                                            }
                                                        >
                                                            Send Request
                                                        </Button>
                                                    )}
                                                </ListGroup.Item>
                                            ))
                                        ) : (
                                            <p
                                                className="text-center text-muted"
                                                style={{ fontSize: "16px" }}
                                            >
                                                No users found for "{query}"
                                            </p>
                                        )}
                                    </ListGroup>
                                )}
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </>
    );
}

export default Home;
