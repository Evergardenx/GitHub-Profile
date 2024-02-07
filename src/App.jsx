import { useState, useEffect } from "react";

import heroImg from "./assets/hero-image-github-profile.png";
import iconSearch from "./assets/Search.svg";
import iconStar from "./assets/Star.svg";
import iconNesting from "./assets/Nesting.svg";
import iconShield from "./assets/Chield_alt.svg";

function App() {
  const [username, setUsername] = useState("github");

  const [bio, setBio] = useState("How people build software");
  const [displayName, setDisplayName] = useState("GitHub");
  const [profileImg, setProfileImg] = useState(heroImg);
  const [followers, setFollowers] = useState(0);
  const [following, setFollowing] = useState(0);
  const [location, setLocation] = useState("San Fransisco, CA");

  const [apiLink, setApiLink] = useState(
    `https://api.github.com/users/${username}`
  );

  const [apiData, setApidData] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const [repoApi, setRepoApi] = useState("");
  const [repoData, setRepoData] = useState([]);
  const [repoError, setRepoError] = useState(null);
  const [isRepoLoading, setIsRepoLoading] = useState(true);
  const [showAll, setShowAll] = useState(false);
  const reposToShow = showAll ? repoData : repoData.slice(0, 4);
  const buttonText = showAll ? "Show less" : "Show all";

  const fetchData = async () => {
    try {
      const response = await fetch(apiLink);

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error(`${username} not found`);
        } else if (response.status === 403) {
          throw new Error(`timeout`);
        } else {
          throw new Error(
            `Request failed with status ${response.status} (${response.statusText})`
          );
        }
      }

      const data = await response.json();
      //console.log(data);

      setApidData(data);

      setRepoApi(data.repos_url);
      setDisplayName(data.name);
      setProfileImg(data.avatar_url);
      setBio(data.bio);
      setFollowers(data.followers);
      setFollowing(data.following);
      setLocation(data.location);
    } catch (err) {
      setError(err);
      alert(err);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchRepo = async () => {
    try {
      const response = await fetch(repoApi);

      if (!response.ok) {
        throw new Error("Repo API encountered an issue");
      }

      const repository = await response.json();
      console.log(repository);
      setRepoData(repository);
    } catch (err) {
      setRepoError(err);
    } finally {
      setIsRepoLoading(false);
    }
  };

  //FETCH DATA ON INITIAL PAGE LOAD
  useEffect(() => {
    fetchData();
  }, []);

  //FETCH REPO DATA WHEN REPO API IS SET OR CHANGES
  useEffect(() => {
    fetchRepo();
  }, [repoApi]);

  return (
    <div className="App">
      <header className="bg-[url('./assets/hero-image-github-profile.png')]">
        <form
          className="searchGrp"
          onSubmit={(e) => {
            e.preventDefault();

            fetchData();
            setShowAll(false);
            setUsername("");
          }}
        >
          <img
            src={iconSearch}
            alt="iconSearch"
            className="cursor-pointer"
            onClick={() => {
              fetchData();
              setShowAll(false);
              setUsername("");
            }}
          />

          <input
            type="text"
            placeholder="username"
            value={username}
            onChange={(e) => {
              setUsername(e.target.value);
              setApiLink(`https://api.github.com/users/${e.target.value}`);
            }}
          />
        </form>
      </header>

      {isLoading && (
        <main className="loadingScreen">
          <h1 className="w-fit mx-auto pt-20 text-6xl font-bold">LOADING</h1>
        </main>
      )}

      {!isLoading && (
        <main>
          <div className="profileDetails">
            <img src={profileImg} alt="profile image" className="profileImg" />

            <div className="detailsGrp">
              <div className="detail">
                <p className="label">followers</p>
                <p className="result">{followers}</p>
              </div>

              <div className="detail">
                <p className="label">following</p>
                <p className="result">{following}</p>
              </div>

              <div className="detail">
                <p className="label">location</p>
                <p className="result">{location}</p>
              </div>
            </div>
          </div>

          <div className="pt-60 md:pt-20">
            <h1 className="text-4xl">{displayName}</h1>
            <p className="text-sm pt-2">{bio}.</p>
          </div>

          <div className="repositoryGrp">
            {repoData !== null &&
              reposToShow.map((element, index) => (
                <a href={element.clone_url} className="repository" key={index}>
                  <h1 className="repoName">{element.name}</h1>

                  <p className="note">{element.description}</p>

                  <div className="iconGrp">
                    <div className="icon">
                      <img src={iconNesting} alt="iconNesting" />

                      <p> {element.forks}</p>
                    </div>

                    <div className="icon">
                      <img src={iconStar} alt="iconStar" />

                      <p> {element.stargazers_count}</p>
                    </div>

                    <p>
                      last updated at
                      <span> {element.pushed_at.slice(0, 10)}</span>
                    </p>
                  </div>
                </a>
              ))}
          </div>

          <button
            className="w-fit mx-auto block font-semibold mt-7 py-3 cursor-pointer"
            onClick={() => setShowAll(!showAll)}
          >
            {buttonText}
          </button>
        </main>
      )}
    </div>
  );
}

export default App;
