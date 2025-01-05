import React, { useEffect, useState } from "react";
import { getFriendRecommendations, sendFriendRequest } from "../api/friend";
import { Button, Spinner, ListGroup, Container } from "react-bootstrap";

function FriendRecommendations() {
    const [recommendations, setRecommendations] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchRecommendations = async () => {
            try {
                const response = await getFriendRecommendations();
                setRecommendations(response.data);
            } catch (error) {
                console.error("Error fetching recommendations:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchRecommendations();
    }, []);

    const handleSendRequest = async (friendId) => {
        try {
            await sendFriendRequest(friendId);
            setRecommendations((prev) =>
                prev.filter((recommendation) => recommendation._id !== friendId)
            );
        } catch (error) {
            console.error("Error sending friend request:", error);
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
                Friend Recommendations
            </h2>
            {recommendations.length > 0 ? (
                <ListGroup>
                    {recommendations.map((friend) => (
                        <ListGroup.Item
                            key={friend._id}
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
                                        backgroundImage: `url(${friend.avatar || "https://via.placeholder.com/50"})`,
                                        backgroundSize: "cover",
                                        backgroundPosition: "center",
                                        marginRight: "15px",
                                        border: "2px solid #007bff",
                                    }}
                                ></div>
                                <span style={{ fontWeight: "500", fontSize: "16px", color: "#333" }}>
                                    {friend.username}
                                </span>
                            </div>
                            <Button
                                variant="primary"
                                size="sm"
                                onClick={() => handleSendRequest(friend._id)}
                            >
                                Add Friend
                            </Button>
                        </ListGroup.Item>
                    ))}
                </ListGroup>
            ) : (
                <div className="text-center">
                    <p className="text-muted" style={{ fontSize: "16px" }}>
                        No friend recommendations available.
                    </p>
                </div>
            )}
        </Container>
    );
}

export default FriendRecommendations;
