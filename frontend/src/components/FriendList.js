import React, { useEffect, useState } from "react";
import { getFriendsList, removeFriend } from "../api/friend";
import { Button, Spinner, ListGroup, Container } from "react-bootstrap";

function FriendList() {
    const [friends, setFriends] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchFriends = async () => {
            try {
                const response = await getFriendsList();
                setFriends(response.data);
            } catch (error) {
                console.error("Error fetching friends list:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchFriends();
    }, []);

    const handleRemoveFriend = async (friendId) => {
        try {
            await removeFriend(friendId);
            setFriends((prev) => prev.filter((friend) => friend._id !== friendId));
        } catch (error) {
            console.error("Error removing friend:", error);
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
                Your Friends
            </h2>
            {friends.length > 0 ? (
                <ListGroup>
                    {friends.map((friend) => (
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
                                variant="outline-danger"
                                size="sm"
                                onClick={() => handleRemoveFriend(friend._id)}
                            >
                                Remove
                            </Button>
                        </ListGroup.Item>
                    ))}
                </ListGroup>
            ) : (
                <div className="text-center">
                    <p className="text-muted" style={{ fontSize: "16px" }}>
                        You have no friends.
                    </p>
                </div>
            )}
        </Container>
    );
}

export default FriendList;
