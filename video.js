const API_KEY = "AIzaSyDZTQW9azQgJzyp-Q4ALmFl0-QYYEF2JSE";
const BASE_URL = "https://www.googleapis.com/youtube/v3";

window.addEventListener("load", () => {
    const urlParams = new URLSearchParams(window.location.search);
    const videoId = urlParams.get('videoId');

    if (videoId) {
        loadVideo(videoId);
        loadComments(videoId);
        loadVideoDetails(videoId);
    } else {
        console.error("No video ID found in URL");
    }
});

function loadVideo(videoId) {
    if (YT) {
        new YT.Player('video-container', {
            height: "500",
            width: "1000",
            videoId: videoId
        });
    }
}

async function loadVideoDetails(videoId) {
    try {
        const response = await fetch(`${BASE_URL}/videos?key=${API_KEY}&part=snippet&id=${videoId}`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        if (data.items && data.items.length > 0) {
            const channelId = data.items[0].snippet.channelId;
            loadChannelInfo(channelId);
        }
    } catch (error) {
        console.error('Error fetching video details: ', error);
    }
}

async function loadChannelInfo(channelId) {
    try {
        const response = await fetch(`${BASE_URL}/channels?key=${API_KEY}&part=snippet&id=${channelId}`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        if (data.items) {
            displayChannelInfo(data.items[0]);
            loadRecommendedVideos(data.items[0].snippet.title);
        }
    } catch (error) {
        console.error('Error fetching channel info: ', error);
    }
}

function displayChannelInfo(channelData) {
    const channelInfoSection = document.getElementById('channel-info');
    channelInfoSection.innerHTML = `
        <h3>${channelData.snippet.title}</h3>
        <img src="${channelData.snippet.thumbnails.default.url}" alt="${channelData.snippet.title}">
        <p>${channelData.snippet.description}</p>
    `;
}


async function loadComments(videoId) {
    try {
        const response = await fetch(`${BASE_URL}/commentThreads?key=${API_KEY}&videoId=${videoId}&maxResults=25&part=snippet`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log("comments", data)
        if (data.items) {
            displayComments(data.items);
        } else {
            console.log("No comments available or data is undefined.");
        }
    } catch (error) {
        console.error('Error fetching comments: ', error);
    }
}

function displayComments(comments) {
    const commentSection = document.getElementById('comment-section');
    commentSection.innerHTML = '';

    comments.forEach(comment => {
        const commentText = comment.snippet.topLevelComment.snippet.textDisplay;
        const commentElement = document.createElement('p');
        commentElement.innerHTML = commentText;
        commentSection.appendChild(commentElement);
    });
}

async function loadRecommendedVideos(channelName) {
    try {
        const response = await fetch(`${BASE_URL}/search?key=${API_KEY}&maxResults=10&part=snippet&q=${channelName}`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log("Recommended videos", data)
        if (data.items) {
            displayRecommendedVideos(data.items);
        } else {
            console.log("No recommended videos available or data is undefined.");
        }
    } catch (error) {
        console.error('Error fetching recommended videos: ', error);
    }
}

function displayRecommendedVideos(videos) {
    const recommendedSection = document.getElementById('recommended-videos');
    recommendedSection.innerHTML = '';

    videos.forEach(video => {
        const videoId = video.id.videoId;
        const title = video.snippet.title;
        const thumbnail = video.snippet.thumbnails.default.url;
        const videoCard = document.createElement('div');
        videoCard.innerHTML = `
            <a href="video.html?videoId=${videoId}">
                <img src="${thumbnail}" alt="${title}">
                <p>${title}</p>
            </a>
        `;
        recommendedSection.appendChild(videoCard);
    });
}






