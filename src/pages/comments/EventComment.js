import React from "react";
import styles from "../../styles/Comment.module.css"
import { Media } from "react-bootstrap";
import { Link } from "react-router-dom";
import Avatar from "../../components/Avatar";



const EventComment = (props) => {
    const{profile_id,profile_image,owner, updated_at,content}=props
 
  return (
    <div>
        <hr/>
        <Media>
        <Link to={`/profiles/${profile_id}`}>
          <Avatar src={profile_image} />
        </Link>
        <Media.Body className="alligin-self-center ml-2">
            <span className={styles.Owner}>{owner}</span>
            <span className={styles.Data}>{updated_at}</span>
            <p>{content}</p>
        </Media.Body>
        </Media>

    </div>
  )
};

export default EventComment;