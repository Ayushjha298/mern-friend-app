import React, { useEffect, useState } from "react";
import { getFriendRequests, manageFriendRequest } from "../api/friend";
import { Button, Card, Spinner, Row, Col } from "react-bootstrap";

function FriendRequests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
          const response = await getFriendRequests();

          const {requests } = response.data;
  
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
    <div className="friend-requests-container py-4">
      <h2 className="text-center mb-4" style={{ fontWeight: "600", color: "#4CAF50" }}>
        Friend Requests
      </h2>
      {requests.length > 0 ? (
        <Row className="g-4">
          {requests.map((req) => (
            <Col key={req._id} xs={12} sm={6} md={4}>
              <Card className="shadow-sm border-0 rounded-3">
                <Card.Body className="text-center">
                  <div className="mb-3">
                    <div
                      className="rounded-circle bg-light mx-auto"
                      style={{
                        width: "70px",
                        height: "70px",
                        backgroundImage: `url(${req.from.avatar || "https://via.placeholder.com/70"})`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                        border: "2px solid #4CAF50",
                      }}
                    ></div>
                  </div>
                  <h5 style={{ fontWeight: "500", color: "#333" }}>
                    {req.from.username}
                  </h5>
                  <div className="d-flex justify-content-center mt-3">
                    <Button
                      variant="success"
                      size="sm"
                      onClick={() => handleAction(req._id, "accept")}
                      style={{
                        marginRight: "10px",
                        borderRadius: "20px",
                        fontWeight: "500",
                      }}
                    >
                      Accept
                    </Button>
                    <Button
                      variant="outline-danger"
                      size="sm"
                      onClick={() => handleAction(req._id, "reject")}
                      style={{ borderRadius: "20px", fontWeight: "500" }}
                    >
                      Reject
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      ) : (
        <p className="text-center text-muted" style={{ fontSize: "18px" }}>
          No pending friend requests.
        </p>
      )}
    </div>
  );
}

export default FriendRequests;
