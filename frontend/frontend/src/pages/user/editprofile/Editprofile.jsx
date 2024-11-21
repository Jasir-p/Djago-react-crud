import React, { useEffect, useState } from 'react';
import "./Editprofile.css";
import { Container, Row, Col, Card, Button, Form, Image } from 'react-bootstrap';
import { FaCamera } from 'react-icons/fa';
import defaultProfile from './default-profile.png'
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Navbar from '../navbar/Navbar';
import { setEmail,setError,setName } from '../../../store/authslice';
import api from '../../../api';


const EditProfile = () => {
  const name = useSelector((state) => state.auth.name);
  const email = useSelector((state) => state.auth.email);
  const [profileImage, setProfileImage] = useState(defaultProfile);
  const [newName, setNewName] = useState(name);
  const [newEmail, setNewEmail] = useState(email);
  const [newProfileImage, setNewProfileImage] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await api.get('/profile/');
        const { username, email, profile_picture  } = response.data;
        setProfileImage(profile_picture || defaultProfile);
        setNewName(username);
        setNewEmail(email);
      } catch (error) {
        console.error('Error fetching user profile:', error.response ? error.response.data : error.message);
        dispatch(setError('Failed to fetch user profile. Please try again.'));
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [dispatch]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewProfileImage(file);
      setProfileImage(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append('username', newName);
    formData.append('email', newEmail);
    if (newProfileImage) {
      formData.append('profile_picture', newProfileImage);
    }

    try {
      await api.put('/useredit/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      dispatch(setName(newName));
      dispatch(setEmail(newEmail));
      navigate('/profile');
    } catch (error) {
      console.error('Error updating user profile:', error.response ? error.response.data : error.message);
      dispatch(setError('Failed to update profile. Please try again.'));
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="edit-profile-page">
      <Navbar />
      <Container>
        <Row className="justify-content-center">
          <Col md={8} lg={6}>
            <Card className="profile-card">
              <div className="profile-image-container">
                <Image src={profileImage} roundedCircle className="profile-image" />
                <label htmlFor="upload-image" className="change-image-button">
                  <FaCamera />
                  <input
                    type="file"
                    id="upload-image"
                    accept="image/*"
                    onChange={handleImageChange}
                    style={{ display: 'none' }}
                  />
                </label>
              </div>
              <Card.Body>
                <h1 className="profile-title mb-4">Edit Profile</h1>
                <Form onSubmit={handleSubmit}>
                  <Form.Group controlId="formName">
                    <Form.Label className='form-labels'>Name</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Enter your name"
                      value={newName}
                      onChange={(e) => setNewName(e.target.value)}
                    />
                  </Form.Group>
                  <Form.Group controlId="formEmail">
                    <Form.Label className='form-labels'>Email address</Form.Label>
                    <Form.Control
                      type="email"
                      placeholder="Enter your email"
                      value={newEmail}
                      onChange={(e) => setNewEmail(e.target.value)}
                    />
                  </Form.Group>
                  <Button variant="primary" type="submit">
                    Save Changes
                  </Button>
                </Form>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default EditProfile;