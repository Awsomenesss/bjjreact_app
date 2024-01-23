import React, { useState }from "react";
import styles from "../../styles/Comment.module.css"
import { Media } from "react-bootstrap";
import { Link } from "react-router-dom";
import Avatar from "../../components/Avatar";
import { useCurrentUser } from "../../contexts/CurrentUserContext";
import { MoreDropdown } from "../../components/MoreDropdown";
import EventCommentEditForm from "./EventCommentEditForm";
import { axiosRes } from "../../api/axiosDefaults";



const EventComment = (props) => {
    const { profile_id, profile_image, owner, updated_at, content, id, setEvent, setComments } = props
 
    const [showEditForm, setShowEditForm] = useState(false);
    const currentUser = useCurrentUser();
    const is_owner = currentUser?.username === owner;

    const handleDelete = async () => {
        try {
            await axiosRes.delete(`/event-comments/${id}/`);
            setEvent(prevEvent => ({
                ...prevEvent,
                results: [{
                    ...prevEvent.results[0],
                    comments_count: prevEvent.results[0].comments_count - 1,
                }],
            }));

            setComments(prevComments => ({
                ...prevComments,
                results: prevComments.results.filter((comment) => comment.id !== id),
            }));
        } catch (err) {
            console.error("Error in deleting event comment:", err);
        }
    };

    return (
        <>
            <hr />
            <Media>
                <Link to={`/profiles/${profile_id}`}>
                    <Avatar src={profile_image} />
                </Link>
                <Media.Body className="alligin-self-center ml-2">
                    <span className={styles.Owner}>{owner}</span>
                    <span className={styles.Data}>{updated_at}</span>
                    {showEditForm ? (
                        <EventCommentEditForm
                            id={id}
                            profile_id={profile_id}
                            content={content}
                            profileImage={profile_image}
                            setComments={setComments}
                            setShowEditForm={setShowEditForm}
                           
                        />
                    ) : (
                        <p>{content}</p>
                    )}
                    
                </Media.Body>
                {is_owner && (
                    <MoreDropdown 
                    handleEdit={() => setShowEditForm(true)}
                    handleDelete={handleDelete}
                    />
                )}
            </Media>

        </>
    )
};

export default EventComment;