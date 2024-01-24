import React, { useEffect, useState } from "react";
import { Col, Row, Form, Container } from "react-bootstrap";
import Post from "../Posts/Post";
import Event from "../events/Event";
import Asset from "../../components/Asset";
import appStyles from "../../App.module.css";
import styles from "../../styles/PostsPage.module.css";
import { axiosReq } from "../../api/axiosDefaults";
import NoResults from "../../assets/no-results.png";
import InfiniteScroll from "react-infinite-scroll-component";
import { fetchMoreData } from "../../utils/utils";
import PopularProfiles from "../profiles/PopularProfiles";

function HomePage({ message,  filter = "" }) {
  const [contentItems, setContentItems] = useState({ results: [] });
  const [hasLoaded, setHasLoaded] = useState(false);
  const [query, setQuery] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const queryString = filter ? `${filter}&search=${query}` : `search=${query}`;
        const { data } = await axiosReq.get(`/combined-posts-events/?${queryString}`);
        console.log("Fetched Data:", data);
        setContentItems(data);
        setHasLoaded(true);
      } catch (err) {
        console.log("Error fetching data:", err);;
      }
    };

    setHasLoaded(false);
    const timer = setTimeout(() => {
      fetchData();
    }, 1000);
    return () => {
      clearTimeout(timer);
    };

  }, [query, filter]); 

  return (
    <Row className="h-100">
      <Col className="py-2 p-0 p-lg-2" lg={8}>
        <PopularProfiles mobile />
        <i className={`fas fa-search ${styles.SearchIcon}`} />
        <Form className={styles.SearchBar} 
        onSubmit={(event) => event.preventDefault()}>
          <Form.Control
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            type="text"
            className="mr-sm-2"
            placeholder="Search posts and events"
          />
        </Form>

        {hasLoaded ? (
          <>
          {contentItems.results.length ? (
            <InfiniteScroll
              dataLength={contentItems.results.length}
              next={() => fetchMoreData(contentItems, setContentItems)}
              hasMore={!!contentItems.next}
              loader={<Asset spinner />}
              children={contentItems.results.map((item) => (
                item.hasOwnProperty('date') 
                  ? <Event 
                  key={item.id} 
                  {...item} 
                  setEvent={setContentItems} 
                  likes_count={item.likes_count}
                  dislikes_count={item.dislikes_count}
                  comments_count={item.comments_count} 
                />
                  : <Post key={item.id} {...item} setPosts={setContentItems} 
                  likes_count={item.likes_count}
                  dislikes_count={item.dislikes_count}
                  comments_count={item.comments_count} />
              ))}
            />
            ) : (
              <Container className={appStyles.Content}>
                <Asset src={NoResults} message={message} />
              </Container>
            )}
          </>
        ) : (
          <Container className={appStyles.Content}>
            <Asset spinner />
          </Container>
        )}
      </Col>
      <Col md={4} className="d-none d-lg-block p-0 p-lg-2">
        <PopularProfiles />
      </Col>
    </Row>
  );
}

export default HomePage;