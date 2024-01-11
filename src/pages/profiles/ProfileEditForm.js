import React, { useState, useEffect, useRef } from "react";
import { useHistory, useParams } from "react-router-dom";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Image from "react-bootstrap/Image";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Alert from "react-bootstrap/Alert";
import { axiosReq } from "../../api/axiosDefaults";
import { useCurrentUser, useSetCurrentUser } from "../../contexts/CurrentUserContext";
import btnStyles from "../../styles/Button.module.css";
import appStyles from "../../App.module.css";


const beltChoices = [
    { label: "White", value: "white" },
    { label: "Blue", value: "blue" },
    { label: "Purple", value: "purple" },
    { label: "Brown", value: "brown" },
    { label: "Black", value: "black" },
];

const giOrNoGiChoices = [
    { label: "Gi", value: "gi" },
    { label: "No Gi", value: "no_gi" },
];

const ProfileEditForm = () => {
    const currentUser = useCurrentUser();
    const setCurrentUser = useSetCurrentUser();
    const { id } = useParams();
    const history = useHistory();
    const imageFile = useRef();

    const [profileData, setProfileData] = useState({
        name: "",
        introduction: "",
        belt_color: "",
        gi_or_no_gi: "",
        years_trained: "",
        image: "",
    });
    const { name, introduction, belt_color, gi_or_no_gi, years_trained, image } = profileData;

    const [errors, setErrors] = useState({});

    useEffect(() => {
        const handleMount = async () => {
            if (currentUser?.profile_id?.toString() === id) {
                try {
                    const { data } = await axiosReq.get(`/profiles/${id}/`);
                    const { name, introduction, belt_color, gi_or_no_gi, years_trained, image } = data;
                    setProfileData({ name, introduction, belt_color, gi_or_no_gi, years_trained, image });
                } catch (err) {
                    console.log(err);
                    history.push("/");
                }
            } else {
                history.push("/");
            }
        };

        handleMount();
    }, [currentUser, history, id]);

    const handleChange = (event) => {
        setProfileData({
            ...profileData,
            [event.target.name]: event.target.value,
        });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        const formData = new FormData();
        formData.append("name", name);
        formData.append("introduction", introduction);
        formData.append("belt_color", belt_color);
        formData.append("gi_or_no_gi", gi_or_no_gi);
        formData.append("years_trained", years_trained);

        if (imageFile?.current?.files[0]) {
            formData.append("image", imageFile?.current?.files[0]);
        }

        try {
            const { data } = await axiosReq.put(`/profiles/${id}/`, formData);
            setCurrentUser((currentUser) => ({
                ...currentUser,
                profile_image: data.image,
            }));
            history.goBack();
        } catch (err) {
            console.log(err);
            setErrors(err.response?.data);
        }
    };

    const additionalFields = (
        <>
            <Form.Group>
            <i className="fas fa-user-circle" /> <Form.Label>club-Name</Form.Label>
                <Form.Control
                    type="text"
                    name="name"
                    value={name}
                    onChange={handleChange}
                />
            </Form.Group>

            <Form.Group>
            <i className="fas fa-info-circle" /> <Form.Label>Introduction</Form.Label>
                <Form.Control
                    as="textarea"
                    value={introduction}
                    onChange={handleChange}
                    name="introduction"
                    rows={7}
                />
            </Form.Group>

            <Form.Group>
            <i className="fas fa-tint" /> <Form.Label>Belt Color</Form.Label>
                <Form.Control
                    as="select"
                    name="belt_color"
                    value={belt_color}
                    onChange={handleChange}
                >
                    {beltChoices.map((choice) => (
                        <option key={choice.value} value={choice.value}>
                            {choice.label}
                        </option>
                    ))}
                </Form.Control>
            </Form.Group>

            <Form.Group>
            <i className="fas fa-tshirt" /> <Form.Label>Gi / No-Gi</Form.Label>
                <Form.Control
                    as="select"
                    name="gi_or_no_gi"
                    value={gi_or_no_gi}
                    onChange={handleChange}
                >
                    {giOrNoGiChoices.map((choice) => (
                        <option key={choice.value} value={choice.value}>
                            {choice.label}
                        </option>
                    ))}
                </Form.Control>
            </Form.Group>

            <Form.Group>
            <i className="fas fa-clock" /> <Form.Label>Years of Trained</Form.Label>
                <Form.Control
                    type="number"
                    name="years_trained"
                    value={years_trained}
                    onChange={handleChange}
                />
            </Form.Group>

            {errors?.content?.map((message, idx) => (
                <Alert variant="warning" key={idx}>
                    {message}
                </Alert>
            ))}
            <Button
                className={`${btnStyles.Button} ${btnStyles.Blue}`}
                onClick={() => history.goBack()}
            >
                cancel
            </Button>
            <Button className={`${btnStyles.Button} ${btnStyles.Blue}`} type="submit">
                save
            </Button>
        </>
    );

    return (
        <Form onSubmit={handleSubmit}>
            <Row>
                <Col className="py-2 p-0 p-md-2 text-center" md={7} lg={6}>
                    <Container className={appStyles.Content}>
                        <Form.Group>
                            {image && (
                                <figure>
                                    <Image src={image} fluid />
                                </figure>
                            )}
                            {errors?.image?.map((message, idx) => (
                                <Alert variant="warning" key={idx}>
                                    {message}
                                </Alert>
                            ))}
                            <div>
                                <Form.Label
                                    className={`${btnStyles.Button} ${btnStyles.Blue} btn my-auto`}
                                    htmlFor="image-upload"
                                >
                                    Change the image
                                </Form.Label>
                            </div>
                            <Form.File
                                id="image-upload"
                                ref={imageFile}
                                accept="image/*"
                                onChange={(e) => {
                                    if (e.target.files.length) {
                                        setProfileData({
                                            ...profileData,
                                            image: URL.createObjectURL(e.target.files[0]),
                                        });
                                    }
                                }}
                            />
                        </Form.Group>
                        <div className="d-md-none">{additionalFields}</div>
                    </Container>
                </Col>
                <Col md={5} lg={6} className="d-none d-md-block p-0 p-md-2 text-center">
                    <Container className={appStyles.Content}>{additionalFields}</Container>
                </Col>
            </Row>
        </Form>
    );
};

export default ProfileEditForm;