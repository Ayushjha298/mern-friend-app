import React, { useEffect, useState } from "react";
import { getFriendRecommendations, sendFriendRequest } from "../api/friend";
import { Button, Card, Row, Col, Spinner } from "react-bootstrap";

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
    <div className="friend-recommendations-container py-4">
      <h2 className="text-center mb-4" style={{ fontWeight: "600", color: "#4CAF50" }}>
        Friend Recommendations
      </h2>
      {recommendations.length > 0 ? (
        <Row className="g-4">
          {recommendations.map((friend) => (
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
                      variant="success"
                      size="sm"
                      onClick={() => handleSendRequest(friend._id)}
                      style={{
                        marginRight: "10px",
                        borderRadius: "20px",
                        fontWeight: "500",
                      }}
                    >
                      Add Friend
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      ) : (
        <p className="text-center text-muted" style={{ fontSize: "18px" }}>
          No friend recommendations available.
        </p>
      )}
    </div>
  );
}

export default FriendRecommendations;
