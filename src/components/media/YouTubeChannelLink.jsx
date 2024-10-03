import React, { useEffect, useState } from 'react';
import axios from 'axios';

const YouTubeChannelVideos = () => {
  const [videos, setVideos] = useState([]);
  const API_KEY = 'AIzaSyCYTlwmDFTTzWlVkeHij4HE5PKYqtrkbBI'; // Replace with your API key
  const CHANNEL_ID = 'UCRSB-vQIT-1s5qX9DoBxi0A'; // Sprintly Exchange's Channel ID

  useEffect(() => {
    // Fetch videos from the YouTube Data API
    const fetchVideos = async () => {
      try {
        const response = await axios.get(
          `https://www.googleapis.com/youtube/v3/search?key=${API_KEY}&channelId=${CHANNEL_ID}&part=snippet,id&order=date&maxResults=10`
        );
        setVideos(response.data.items);
      } catch (error) {
        console.error('Error fetching videos:', error);
      }
    };

    fetchVideos();
  }, []);

  return (
    <div>
      <center><h2>Sprintly Exchange Channel Videos</h2></center>
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-around' }}>
        {videos.map((video) => (
          <div key={video.id.videoId} style={{ margin: '20px' }}>
            <iframe
              width="360"
              height="215"
              src={`https://www.youtube.com/embed/${video.id.videoId}`}
              frameBorder="0"
              allowFullScreen
              title={video.snippet.title}
            ></iframe>
            <h4>{video.snippet.title}</h4>
          </div>
        ))}
      </div>
    </div>
  );
};

export default YouTubeChannelVideos;
