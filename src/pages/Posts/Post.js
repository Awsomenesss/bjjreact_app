import React from "react";
import styles from "../../styles/Post.module.css";
import { useCurrentUser } from "../../contexts/CurrentUserContext";
import { Card, Media, OverlayTrigger, Tooltip } from "react-bootstrap";
import { Link } from "react-router-dom";
import Avatar from "../../components/Avatar";
import { axiosRes } from "../../api/axiosDefaults";
import { MoreDropdown } from "../../components/MoreDropdown";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";


const Post = (props) => {
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
    title,
    content,
    image,
    updated_at,
    postPage,
    setPosts,
  } = props;

  const currentUser = useCurrentUser();
  const is_owner = currentUser?.username === owner;
  const history = useHistory();

  const handleEdit = () => {
    history.push(`/posts/${id}/edit`);
  };

  const handleDelete = async () => {
    try {
      await axiosRes.delete(`/posts/${id}/`);
      history.goBack();
    } catch (err) {
     
    }
  };

  const handleLike = async () => {
    try {
      if (dislike_id) {
        await axiosRes.delete(`/post-dislikes/${dislike_id}/`);
      }
      const { data } = await axiosRes.post("/post-likes/", { post: id });
      setPosts(prevPosts => ({
        ...prevPosts,
        results: prevPosts.results.map(post => (
          post.id === id ? {
            ...post,
            likes_count: post.likes_count + 1,
            like_id: data.id,
            dislikes_count: dislike_id ? post.dislikes_count - 1 : post.dislikes_count,
            dislike_id: null
          } : post
        )),
      }));
    } catch (err) {
      
    }
  };

  const handleDisLike = async () => {
    try {
      if (like_id) {
        await axiosRes.delete(`/post-likes/${like_id}/`);
      }
      const { data } = await axiosRes.post("/post-dislikes/", { post: id });
      setPosts(prevPosts => ({
        ...prevPosts,
        results: prevPosts.results.map(post => (
          post.id === id ? {
            ...post,
            dislikes_count: post.dislikes_count + 1,
            dislike_id: data.id,
            likes_count: like_id ? post.likes_count - 1 : post.likes_count,
            like_id: null
          } : post
        )),
      }));
    } catch (err) {
     
    }
  };

  const handleUnlike = async () => {
    try {
      await axiosRes.delete(`/post-likes/${like_id}/`);
      setPosts((prevPosts) => ({
        ...prevPosts,
        results: prevPosts.results.map((post) => {
          return post.id === id
            ? { ...post, likes_count: post.likes_count - 1, like_id: null }
            : post;
        }),
      }));
    } catch (err) {
    
    }
  };

  const handleUnDislikelike = async () => {
    try {
      if (dislike_id) {
        await axiosRes.delete(`/post-dislikes/${dislike_id}/`);
        setPosts((prevPosts) => ({
          ...prevPosts,
          results: prevPosts.results.map((post) => {
            return post.id === id
              ? { ...post, dislikes_count: post.dislikes_count - 1, dislike_id: null }
              : post;
          }),
        }));
      }
    } catch (err) {
    
    }
  };


  return (
    <Card className={styles.Post}>
      <Card.Body>
        <Media className="align-items-center justify-content-between">
          <Link to={`/profiles/${profile_id}`}>
            <Avatar src={profile_image} height={55} />
            {owner}
          </Link>
          <div className="d-flex align-items-center">
            <span>{updated_at}</span>
            {is_owner && postPage && <MoreDropdown handleEdit={handleEdit} handleDelete={handleDelete} />}
          </div>
        </Media>
      </Card.Body>
      <Link to={`/posts/${id}`}>
        <Card.Img src={image} alt={title} />
      </Link>
      <Card.Body>
        {title && <Card.Title className="text-center">{title}</Card.Title>}
        {content && <Card.Text>{content}</Card.Text>}
        <div className={styles.PostBar}>
          {is_owner ? (
            <>
              <OverlayTrigger placement="top" overlay={<Tooltip>You can't like your own post!</Tooltip>}>
                <span>
                  <i className={`fa-solid fa-thumbs-up ${styles.Icon}`}></i> {likes_count}
                </span>
              </OverlayTrigger>
              <OverlayTrigger placement="top" overlay={<Tooltip>You can't dislike your own post!</Tooltip>}>
                <span>
                  <i className={`fa-solid fa-thumbs-down ${styles.Icon}`}></i> {dislikes_count}
                </span>
              </OverlayTrigger>
            </>
          ) : currentUser ? (
            <>
              <span onClick={like_id ? handleUnlike : handleLike}>
                <i className={`fa-solid fa-thumbs-up ${like_id ? styles.IconClicked : styles.Icon}`}></i> {likes_count}
              </span>
              <span onClick={dislike_id ? handleUnDislikelike : handleDisLike}>
                <i className={`fa-solid fa-thumbs-down ${dislike_id ? styles.IconClicked : styles.Icon}`}></i> {dislikes_count}
              </span>
            </>
          ) : (
            <>
              <OverlayTrigger placement="top" overlay={<Tooltip>Log in to like posts!</Tooltip>}>
                <span>
                  <i className={`fa-solid fa-thumbs-up ${styles.Icon}`}></i> {likes_count}
                </span>
              </OverlayTrigger>
              <OverlayTrigger placement="top" overlay={<Tooltip>Log in to like posts!</Tooltip>}>
                <span>
                  <i className={`fa-solid fa-thumbs-down ${styles.Icon}`}></i> {dislikes_count}
                </span>
              </OverlayTrigger>
            </>
          )}
          <Link to={`/posts/${id}`}>
            <i className="far fa-comments" /> {comments_count}
          </Link>
        </div>
      </Card.Body>
    </Card>
  );
};

export default Post;