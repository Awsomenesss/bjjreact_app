import React from "react";
import styles from "../../styles/Post.module.css";
import { useCurrentUser } from "../../contexts/CurrentUserContext";
import { Card, Media} from "react-bootstrap";
import { Link } from "react-router-dom"; 
import Avatar from "../../components/Avatar";
import { axiosRes } from "../../api/axiosDefaults";
import { MoreDropdown } from "../../components/MoreDropdown";

const Event = (props) => {
  const {
    id,
    owner,
    profile_id,
    profile_image,
    likes_count,
    like_id,
    description,
    date,
    time,
    location,
    image,
    updated_at,
    eventPage,
    setEvents,
  } = props;

  const currentUser = useCurrentUser();
  const is_owner = currentUser?.username === owner;

  const handleInterest = async () => {
    try {
      const { data } = await axiosRes.post("/event-likes/", { event: id });
      setEvents((prevEvents) => ({
        ...prevEvents,
        results: prevEvents.results.map((event) => {
          return event.id === id
            ? { ...event, likes_count: event.likes_count + 1, like_id: data.id }
            : event;
        }),
      }));
    } catch (err) {
      console.log(err);
    }
  };

  const handleUninterest = async () => {
    try {
      await axiosRes.delete(`/event-likes/${like_id}/`);
      setEvents((prevEvents) => ({
        ...prevEvents,
        results: prevEvents.results.map((event) => {
          return event.id === id
            ? { ...event, likes_count: event.likes_count - 1, like_id: null }
            : event;
        }),
      }));
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <Card className={styles.Event}>
      <Card.Body>
        <Media className="align-items-center justify-content-between">
          <Link to={`/profiles/${profile_id}`}>
            <Avatar src={profile_image} height={55} />
            {owner}
          </Link>
          <div className="d-flex align-items-center">
            <span>{updated_at}</span>
            {is_owner && eventPage && <MoreDropdown />}
          </div>
        </Media>
      </Card.Body>
      <Link to={`/events/${id}`}>
        <Card.Img src={image} alt={description} />
      </Link>
      <Card.Body>
        <Card.Title className="text-center">{date} at {time}</Card.Title>
        <Card.Text>{location}</Card.Text>
        <Card.Text>{description}</Card.Text>
        <div className={styles.EventBar}>
          {like_id ? (
            <span onClick={handleUninterest}>
              <i className={`fas fa-star ${styles.Interested}`} /> Not Interested
            </span>
          ) : (
            <span onClick={handleInterest}>
              <i className={`far fa-star ${styles.NotInterested}`} /> Interested?
            </span>
          )}
          {likes_count} Interested
        </div>
      </Card.Body>
    </Card>
  );
};

export default Event;