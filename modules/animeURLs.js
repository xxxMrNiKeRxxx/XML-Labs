class AnimeUrls {
    constructor(baseUrl = 'http://localhost:3000') {
        this.baseUrl = baseUrl;
    }

    getAnimes() {
        return `${this.baseUrl}/animes`;
    }

    getFilteredAnimes(filter) {
        return `${this.baseUrl}/animes?filter=${encodeURIComponent(filter)}`;
    }

    getAnimeById(id) {
        return `${this.baseUrl}/animes/${id}`;
    }

    createAnime() {
        return `${this.baseUrl}/animes`;
    }

    deleteAnime(id) {
        return `${this.baseUrl}/animes/${id}`;
    }

    updateAnime(id) {
        return `${this.baseUrl}/animes/${id}`;
    }
}


export const animeURLs = new AnimeUrls();