import React, { useEffect, useState } from "react";

import { useParams } from "react-router";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";

import Container from "react-bootstrap/Container";
import appStyles from "../../App.module.css";
import { axiosReq } from "../../api/axiosDefaults";
import Event from "./Event";
import EventCommentCreateForm from "../comments/EventCommentCreateForm";
import { useCurrentUser } from "../../contexts/CurrentUserContext";

function EventPage() {
  const { id } = useParams();
  const [event, setEvent] = useState({ results: [] });

  const currentUser = useCurrentUser();
  const profile_image = currentUser?.profile_image;
  const [comments, setComments] = useState({ results: [] })

  useEffect(() => {
    const handleMount = async () => {
      try {
        const [{ data: event }] = await await Promise.all([
          axiosReq.get(`/event/${id}`),
        ]);
        setEvent({ results: [event] });
        console.log(event);
      } catch (err) {
        console.log(err);
      }
    };
    handleMount();
  }, [id]);

  return (
    <Row className="h-100">
      <Col className="py-2 p-0 p-lg-2" lg={8}>
        <p>Popular profiles for mobile</p>
        <Event {...event.results[0]} setEvent={setEvent} eventPage />
        <Container className={appStyles.Content}>
          {currentUser ? (
            <EventCommentCreateForm
              profile_id={currentUser.profile_id}
              profileImage={profile_image}
              event={id}
              setEvent={setEvent} 
              setComments={setComments} 
            />
          ) : comments.results.length ? (
            "Comments"
          ) : null}
        </Container>
      </Col>
      <Col lg={4} className="d-none d-lg-block p-0 p-lg-2">
        Popular profiles for desktop
      </Col>
    </Row>
  );
}

export default EventPage;