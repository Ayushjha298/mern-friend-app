import React, { useEffect, useState } from "react";
import { getFriendsList, removeFriend } from "../api/friend";
import { Button, Card, Row, Col, Spinner } from "react-bootstrap";

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
      setFriends(friends.filter((friend) => friend._id !== friendId));
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
    <div className="friend-list-container py-4">
      <h2 className="text-center mb-4" style={{ fontWeight: "600", color: "#4CAF50" }}>
        Your Friends
      </h2>
      {friends.length > 0 ? (
        <Row className="g-4">
          {friends.map((friend) => (
            <Col key={friend._id} xs={12} sm={6} md={4}>
              <Card className="shadow-sm border-0 rounded-3">
                <Card.Body className="text-center">
                  <div className="mb-3">
                    <div
                      className="rounded-circle bg-light mx-auto"
                      style={{
                        width: "70px",
                        height: "70px",
                        backgroundImage: `url(${friend.avatar || "https://via.placeholder.com/70"})`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                        border: "2px solid #4CAF50",
                      }}
                    ></div>
                  </div>
                  <h5 style={{ fontWeight: "500", color: "#333" }}>{friend.username}</h5>
                  <div className="d-flex justify-content-center mt-3">
                    <Button
                      variant="outline-danger"
                      size="sm"
                      onClick={() => handleRemoveFriend(friend._id)}
                      style={{ borderRadius: "20px", fontWeight: "500" }}
                    >
                      Remove
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      ) : (
        <p className="text-center text-muted" style={{ fontSize: "18px" }}>
          You have no friends.
        </p>
      )}
    </div>
  );
}

export default FriendList;
