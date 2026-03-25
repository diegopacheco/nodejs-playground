import { createPlayer } from "@videojs/react";
import { videoFeatures, VideoSkin, Video } from "@videojs/react/video";
import "@videojs/react/video/skin.css";

const Player = createPlayer({ features: videoFeatures });

function App() {
  return (
    <div style={{ maxWidth: 800, margin: "40px auto", fontFamily: "sans-serif" }}>
      <h1>Video.js v10 Beta + React 19</h1>
      <Player.Provider>
        <VideoSkin>
          <Video src="https://vjs.zencdn.net/v/oceans.mp4" />
        </VideoSkin>
      </Player.Provider>
      <p style={{ marginTop: 16, color: "#666" }}>
        Using @videojs/react 10.0.0-beta.11 with React 19 and TypeScript
      </p>
    </div>
  );
}

export default App;
