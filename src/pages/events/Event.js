import React from "react";
import styles from "../../styles/Post.module.css";
import { useCurrentUser } from "../../contexts/CurrentUserContext";
import { Card, Media, OverlayTrigger, Tooltip } from "react-bootstrap";
import { Link } from "react-router-dom";
import Avatar from "../../components/Avatar";
import { axiosRes } from "../../api/axiosDefaults";
import { MoreDropdown } from "../../components/MoreDropdown";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";

const Event = (props) => {
  const {
    id,
    owner,
    profile_id,
    profile_image,
    comments_count,
    likes_count,
    like_id,
    dislikes_count,
    dislike_id,
    description,
    date,
    time,
    location,
    image,
    updated_at,
    eventPage,
    setEvent,
  } = props;

  const currentUser = useCurrentUser();
  const is_owner = currentUser?.username === owner;
  const history = useHistory();

  const handleEdit = () => {
    history.push(`/event/${id}/edit`);
  };

  const handleDelete = async () => {
    try {
      await axiosRes.delete(`/event/${id}/`);
      history.goBack();
    } catch (err) {
     
    }
  };

  const handleLike = async () => {
    try {
      if (dislike_id) {
        await axiosRes.delete(`/event-dislikes/${dislike_id}/`);
      }
      const { data } = await axiosRes.post("/event-likes/", { event: id });
      setEvent(prevEvents => ({
        ...prevEvents,
        results: prevEvents.results.map(event => (
          event.id === id ? {
            ...event,
            likes_count: event.likes_count + 1,
            like_id: data.id,
            dislikes_count: dislike_id ? event.dislikes_count - 1 : event.dislikes_count,
            dislike_id: null
          } : event
        )),
      }));
    } catch (err) {
   
    }
  };

  const handleDisLike = async () => {
    try {

      if (like_id) {
        await axiosRes.delete(`/event-likes/${like_id}/`);
      }

      const { data } = await axiosRes.post("/event-dislikes/", { event: id });
      setEvent(prevEvents => ({
        ...prevEvents,
        results: prevEvents.results.map(event => (
          event.id === id ? {
            ...event,
            dislikes_count: event.dislikes_count + 1,
            dislike_id: data.id,
            likes_count: like_id ? event.likes_count - 1 : event.likes_count,
            like_id: null
          } : event
        )),
      }));
    } catch (err) {
     
    }
  };

  const handleUnlike = async () => {
    try {
      await axiosRes.delete(`/event-likes/${like_id}/`);
      setEvent(prevEvents => ({
        ...prevEvents,
        results: prevEvents.results.map(event => {
          return event.id === id ?
            { ...event, likes_count: event.likes_count - 1, like_id: null } : event
        }),
      }));
    } catch (err) {
      
    }
  };

  const handleUndislike = async () => {
    try {
      if (dislike_id) {
        await axiosRes.delete(`/event-dislikes/${dislike_id}/`);
        setEvent(prevEvents => ({
          ...prevEvents,
          results: prevEvents.results.map(event => {
            return event.id === id
              ? { ...event, dislikes_count: event.dislikes_count - 1, dislike_id: null }
              : event
          }),
        }));
      }
    } catch (err) {
   
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
            {is_owner && eventPage && <MoreDropdown handleEdit={handleEdit} handleDelete={handleDelete}/>}
          </div>
        </Media>
      </Card.Body>
      <Link to={`/event/${id}`}>
        <Card.Img src={image} alt={description} />
      </Link>
      <Card.Body>
        <Card.Title className="text-center">{date} at {time}</Card.Title>
        <Card.Text>{location}</Card.Text>
        <Card.Text>{description}</Card.Text>
        <div className={styles.EventBar}>
          {is_owner ? (
            <>
              <OverlayTrigger placement="top" overlay={<Tooltip>Alredy showed your interest by posting it!</Tooltip>}>
                <span>
                  <i className={`fa-solid fa-check ${styles.Icon}`}></i> {likes_count}
                </span>
              </OverlayTrigger>
              <OverlayTrigger placement="top" overlay={<Tooltip>Already showed your interest by posting it!</Tooltip>}>
                <span>
                  <i className={`fa-solid fa-xmark ${styles.Icon}`}></i> {dislikes_count}
                </span>
              </OverlayTrigger>
            </>
          ) : currentUser ? (
            <>
              <span onClick={like_id ? handleUnlike : handleLike}>
                <i className={`fa-solid fa-check ${like_id ? styles.IconClicked : styles.Icon}`}></i> {likes_count}
              </span>
              <span onClick={dislike_id ? handleUndislike : handleDisLike}>
                <i className={`fa-solid fa-xmark ${dislike_id ? styles.IconClicked : styles.Icon}`}></i> {dislikes_count}
              </span>
            </>
          ) : (
            <>
              <OverlayTrigger placement="top" overlay={<Tooltip>Log in to show interest to this event !</Tooltip>}>
                <span>
                  <i className={`fa-solid fa-check ${styles.Icon}`}></i> {likes_count}
                </span>
              </OverlayTrigger>
              <OverlayTrigger placement="top" overlay={<Tooltip>Log in to show interest in to this event !</Tooltip>}>
                <span>
                  <i className={`fa-solid fa-xmark ${styles.Icon}`}></i> {dislikes_count}
                </span>
              </OverlayTrigger>
            </>
          )}
          <Link to={`/event/${id}`}>
            <i className="far fa-comments" /> {comments_count}
          </Link>
        </div>
      </Card.Body>
    </Card>
  );
};

export default Event;