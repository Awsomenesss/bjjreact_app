import React, { useEffect, useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import { axiosReq } from "../api/axiosDefaults";
import Post from "../pages/Posts/Post";
import CommentCreateForm from "../pages/comments/CommentCreateForm";
import Comment from "../pages/comments/Comment";
import { useCurrentUser } from "./CurrentUserContext";
import PopularProfiles from "../pages/profiles/PopularProfiles";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Container from "react-bootstrap/Container";
import appStyles from "../App.module.css";


function DisplayContentPage() {
  const { id } = useParams();
  const location = useLocation();
  const isEventPage = location.pathname.includes("/events/");
  const contentEndpoint = isEventPage ? `/events/${id}` : `/posts/${id}`;
  const commentsEndpoint = `/comments/?post=${id}`;

  const [contentData, setContentData] = useState(null);
  const [comments, setComments] = useState([]);
  const currentUser = useCurrentUser();
  const profileImage = currentUser?.profile_image;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [{ data: contentRes }, commentsRes] = await Promise.all([
          axiosReq.get(contentEndpoint),
          isEventPage ? Promise.resolve({ data: { results: [] } }) : axiosReq.get(commentsEndpoint)
        ]);
        setContentData(contentRes);
        setComments(commentsRes.data.results);
      } catch (err) {
        console.log(err);
      }
    };

    fetchData();
  }, [id, contentEndpoint, commentsEndpoint, isEventPage]);

  return (
    <Row className="h-100">
      <Col className="py-2 p-0 p-lg-2" lg={8}>
        <PopularProfiles mobile />
        {contentData && <Post {...contentData} setPosts={setContentData} postPage={!isEventPage} />}
        <Container className={appStyles.Content}>
          {!isEventPage && currentUser && (
            <CommentCreateForm
              profileId={currentUser.profile_id}
              profileImage={profileImage}
              postId={id}
              setPost={setContentData}
              setComments={setComments}
            />
          )}
          {!isEventPage && comments.length > 0 &&
            comments.map((comment) => (
              <Comment key={comment.id} {...comment}
                setPost={setContentData}
                setComments={setComments}
              />
            ))
          }
        </Container>
      </Col>
      <Col lg={4} className="d-none d-lg-block p-0 p-lg-2">
        <PopularProfiles />
      </Col>
    </Row>
  );
}

export default DisplayContentPage;