import React, { useState, useEffect } from "react";
import {
    Container,
    Row,
    Col,
    Card,
    Button,
    Form,
    Spinner,
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
} from "../api/friend";

function Home() {
    const [query, setQuery] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [sentRequests, setSentRequests] = useState({});
    const [userName, setUserName] = useState("");
    const [friendsCount, setFriendsCount] = useState(0);
    const [friendRequestsCount, setFriendRequestsCount] = useState(0);
    const [friendRecommendationCount, setRecommendationCount] = useState(0);

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
            setRecommendationCount(recommendationResponse.data.length);
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
            <Navbar bg="white" className="shadow-sm mb-4">
                <Container>
                    <Navbar.Brand href="/" className="fw-bold">
                        {userName ? `Welcome ${userName}` : "Dashboard"}
                    </Navbar.Brand>
                    <Nav className="ms-auto">
                        <Link to="/friends-list" className="me-3">
                            <Button variant="success">
                                Friends ({friendsCount})
                            </Button>
                        </Link>
                        <Link to="/friend-requests" className="me-3">
                            <Button variant="warning">
                                Requests ({friendRequestsCount})
                            </Button>
                        </Link>
                        <Link to="/recommendations">
                            <Button variant="primary">
                                Recommendations ({friendRecommendationCount})
                            </Button>
                        </Link>
                    </Nav>
                </Container>
            </Navbar>

            <Container>
                <Row className="justify-content-center mb-5">
                    <Col md={8}>
                        <Card className="p-4">
                            <h3 className="text-center mb-4">
                                Search for Friends
                            </h3>
                            <Form className="d-flex">
                                <Form.Control
                                    type="text"
                                    value={query}
                                    onChange={(e) => setQuery(e.target.value)}
                                    placeholder="Enter username..."
                                    className="me-2"
                                />
                                <Button
                                    variant="success"
                                    onClick={handleSearch}
                                    disabled={loading}
                                >
                                    {loading ? "Searching..." : "Search"}
                                </Button>
                            </Form>
                        </Card>
                    </Col>
                </Row>

                <Row>
                    {loading ? (
                        <div className="text-center">
                            <Spinner animation="border" variant="primary" />
                        </div>
                    ) : (
                        searchResults.map((user) => (
                            <Col md={6} lg={4} key={user._id} className="mb-4">
                                <Card className="shadow-sm">
                                    <Card.Body className="d-flex justify-content-between align-items-center">
                                        <span className="fw-bold">
                                            {user.username}
                                        </span>
                                        {sentRequests[user._id] ? (
                                            <Button
                                                variant="secondary"
                                                disabled
                                            >
                                                Sent
                                            </Button>
                                        ) : (
                                            <Button
                                                variant="success"
                                                onClick={() =>
                                                    handleSendRequest(user._id)
                                                }
                                            >
                                                Add Friend
                                            </Button>
                                        )}
                                    </Card.Body>
                                </Card>
                            </Col>
                        ))
                    )}
                </Row>
            </Container>
        </>
    );
}

export default Home;
