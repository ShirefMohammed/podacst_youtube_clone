const handleSearch = () => {
	const searchForm = document.querySelector("#search_form");
	const searchInput = document.querySelector("#search_input");
	const iFrame = document.querySelector("#current_video iframe");
	searchForm.addEventListener('submit', (e) => {
		e.preventDefault();
		iFrame.src = `https://www.youtube.com/embed/${searchInput.value}`;
	});
}
handleSearch();

const options = {
	method: 'GET',
	headers: {
		'X-RapidAPI-Key': '9f5c20e7b8msh3bd134e1f368852p11ebabjsn2ea0552b8a4c',
		'X-RapidAPI-Host': 'youtube-v31.p.rapidapi.com'
	}
};

if (!sessionStorage.getItem('current_video_id')) {
	const iFrame = document.querySelector("#current_video iframe");
	iFrame.src = `https://www.youtube.com/embed/p2zMXSXhZ9M`;
} else {
	const iFrame = document.querySelector("#current_video iframe");
	iFrame.src = `https://www.youtube.com/embed/${sessionStorage.getItem('current_video_id')}`;
}

const fetchPlayListAPI = () => {
	const playlistId = document.querySelector("#playlists_title").value;

	fetch(`https://youtube-v31.p.rapidapi.com/playlistItems?playlistId=${playlistId}&part=snippet&maxResults=50`, options)
		.then((response) => {
			const data = response.json()
			return data;
		})
		.then((response) => {
			return response.items;
		})
		.then((response) => {
			const iFrame = document.querySelector("#current_video iframe");
			const playlist = document.querySelector(".playlists .playlist");
			playlist.innerHTML = '';

			response.map((item) => {
				const div = document.createElement('div');
				div.className = 'video';

				const img = document.createElement('img');
				img.src = item.snippet.thumbnails.high.url;
				img.alt = item.snippet.resourceId.videoId;
				div.appendChild(img);

				const span = document.createElement('span');
				span.innerHTML = item.snippet.title;
				span.setAttribute('id', item.snippet.resourceId.videoId);
				div.appendChild(span);

				playlist.appendChild(div);
			});

			document.querySelectorAll(".playlists .playlist .video span").forEach((span) => {
				span.addEventListener('click', (e) => {
					iFrame.src = `https://www.youtube.com/embed/${e.target.id}`;
					window.scrollTo({
						top: 0,
						left: 0,
						behavior: "smooth",
					});
					sessionStorage.setItem('current_video_id', e.target.id);
				});
			});
		})
		.catch(err => console.error(err));
}
fetchPlayListAPI();

document.querySelector("#playlists_title").addEventListener('change', () => {
	fetchPlayListAPI();
});