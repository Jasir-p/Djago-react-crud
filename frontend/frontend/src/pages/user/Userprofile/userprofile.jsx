import React, { useCallback, useEffect, useState } from 'react'
import "./userprofile.css"
import { Container, Row, Col, Card, Button, Image } from 'react-bootstrap'
import defaultProfile from './default-profile.png'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import Navbar from '../navbar/Navbar'
import api from '../../../api'
import { setEmail,setError,setName } from '../../../store/authslice'


const UserProfile = () => {
  const username = useSelector((state) => state.auth.username)
  const name = useSelector((state) => state.auth.name)
  const email = useSelector((state) => state.auth.email)
  const [loading, setLoading] = useState(true)
  const [profileImage, setProfileImage] = useState(defaultProfile)
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const fetchUserProfile = useCallback(async () => {
    try {
        console.log("Sending request to:", `${api.defaults.baseURL}profile/`);
        const response = await api.get('/profile/');
        console.log("Response data:", response.data);
        const { username, email, profile_picture } = response.data;
        setProfileImage(profile_picture || defaultProfile);
        dispatch(setName(username));
        dispatch(setEmail(email));
    } catch (error) {
        console.error('Error fetching user profile:', error.response ? error.response.data : error.message);
        dispatch(setError('Failed to fetch user profile. Please try again.'));
    } finally {
        setLoading(false);
    }
}, [dispatch]);



  useEffect(() => {
    console.log("render")
    fetchUserProfile()
  }, [fetchUserProfile])

  if (loading) return <p>Loading...</p>

  return (
    <div className="user-profile-page">
      <Navbar />
      <Container>
        <Row className="justify-content-center">
          <Col md={8} lg={6}>
            <Card className="profile-card">
              <div className="profile-image-container">
                <Image src={profileImage} roundedCircle className="profile-image" />
              </div>
              <Card.Body>
                <h1 className="profile-title mb-4">{username}</h1>
                <div className="profile-info">
                  <p><strong>Name: </strong>{name}</p>
                  <p><strong>Email: </strong>{email}</p>
                </div>
                <Button variant="primary" onClick={() => navigate('/editprofile')} className="edit-profile-button">Edit Profile</Button>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  )
}

export default UserProfile