import React, { useEffect, useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import { axiosReq } from "../api/axiosDefaults";
import Post from "../pages/Posts/Post";
import Event from "../pages/events/Event";
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
  const isEventPage = location.pathname.includes("/event/");
  const contentEndpoint = isEventPage ? `/event/${id}/` : `/posts/${id}/`; 
  const commentsEndpoint = isEventPage ? `/event-comments/?event=${id}` : `/comments/?post=${id}`;

  const [contentData, setContentData] = useState(null);
  const [comments, setComments] = useState([]);
  const currentUser = useCurrentUser();
  const profileImage = currentUser?.profile_image;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [{ data: content }, { data: commentsData }] = await Promise.all([
          axiosReq.get(contentEndpoint),
          axiosReq.get(commentsEndpoint)
        ]);
        setContentData(content);
        setComments(commentsData.results);
        console.log("Fetched content data:", content);
        console.log("Fetched comments data:", commentsData.results);
      } catch (err) {
        console.log(err);
      }
    };

    fetchData();
  }, [id, contentEndpoint, commentsEndpoint]);

  return (
    <Row className="h-100">
      <Col className="py-2 p-0 p-lg-2" lg={8}>
        <PopularProfiles mobile />
        {contentData && (isEventPage ? 
          <Event {...contentData} /> : 
          <Post {...contentData} />
        )}
        <Container className={appStyles.Content}>
          {!isEventPage && currentUser && (
            <CommentCreateForm
              profileId={currentUser.profile_id}
              profileImage={profileImage}
              contentId={id}
              setContent={setContentData}
              setComments={setComments}
            />
          )}
          {comments.length > 0 &&
            comments.map((comment) => (
              <Comment key={comment.id} {...comment}
                setContent={setContentData}
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