import React, { useEffect, useState } from "react";
import { getFriendRequests, manageFriendRequest } from "../api/friend";
import { Button, Spinner, ListGroup, Container } from "react-bootstrap";

function FriendRequests() {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchRequests = async () => {
            try {
                const response = await getFriendRequests();
                const { requests } = response.data;
                const pendingRequests = requests.filter((req) => req.status === "pending");
                setRequests(pendingRequests);
            } catch (error) {
                console.error(error.response?.data?.message || "Failed to fetch requests");
            } finally {
                setLoading(false);
            }
        };

        fetchRequests();
    }, []);

    const handleAction = async (requestId, action) => {
        try {
            await manageFriendRequest(requestId, action);
            setRequests(requests.filter((req) => req._id !== requestId));
        } catch (error) {
            console.error(error.response?.data?.message || "Failed to manage request");
        }
    };

    if (loading) {
        return (
            <div className="text-center mt-4">
                <Spinner animation="border" variant="primary" />
            </div>
        );
    }

    return (
        <Container className="py-4">
            <h2 className="text-center mb-4" style={{ fontWeight: "600", color: "#007bff" }}>
                Friend Requests
            </h2>
            {requests.length > 0 ? (
                <ListGroup>
                    {requests.map((req) => (
                        <ListGroup.Item
                            key={req._id}
                            className="d-flex align-items-center justify-content-between p-3 rounded"
                            style={{
                                marginBottom: "10px",
                                backgroundColor: "#f9f9f9",
                                border: "1px solid #ddd",
                                transition: "background-color 0.2s ease",
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.backgroundColor = "#f1f8ff";
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.backgroundColor = "#f9f9f9";
                            }}
                        >
                            <div className="d-flex align-items-center">
                                <div
                                    className="rounded-circle"
                                    style={{
                                        width: "50px",
                                        height: "50px",
                                        backgroundImage: `url(${req.from.avatar || "https://via.placeholder.com/50"})`,
                                        backgroundSize: "cover",
                                        backgroundPosition: "center",
                                        marginRight: "15px",
                                        border: "2px solid #007bff",
                                    }}
                                ></div>
                                <span style={{ fontWeight: "500", fontSize: "16px", color: "#333" }}>
                                    {req.from.username}
                                </span>
                            </div>
                            <div className="d-flex">
                                <Button
                                    variant="primary"
                                    size="sm"
                                    onClick={() => handleAction(req._id, "accept")}
                                    className="me-2"
                                >
                                    Accept
                                </Button>
                                <Button
                                    variant="outline-danger"
                                    size="sm"
                                    onClick={() => handleAction(req._id, "reject")}
                                >
                                    Reject
                                </Button>
                            </div>
                        </ListGroup.Item>
                    ))}
                </ListGroup>
            ) : (
                <div className="text-center">
                    <p className="text-muted" style={{ fontSize: "16px" }}>
                        You have no pending friend requests.
                    </p>
                </div>
            )}
        </Container>
    );
}

export default FriendRequests;
