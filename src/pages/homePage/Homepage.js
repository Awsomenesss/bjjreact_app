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

function HomePage({ message }) {
  const [contentItems, setContentItems] = useState({ results: [] });
  const [hasLoaded, setHasLoaded] = useState(false);
  const [query, setQuery] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axiosReq.get(`/combined-posts-events/?search=${query}`);
        setContentItems(data);
        setHasLoaded(true);
      } catch (err) {
        console.log(err);
      }
    };

    setHasLoaded(false);
    fetchData();
  }, [query]);

  return (
    <Row className="h-100">
      <Col className="py-2 p-0 p-lg-2" lg={8}>
        <PopularProfiles mobile />
        <i className={`fas fa-search ${styles.SearchIcon}`} />
        <Form className={styles.SearchBar} onSubmit={(e) => e.preventDefault()}>
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
                    ? <Event key={item.id} {...item} />
                    : <Post key={item.id} {...item} />
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