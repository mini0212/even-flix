export enum MediaType {
  MOVIE = "movie",
  TV = "tv",
}

export interface Media {
	type: MediaType;
	id: number;
	title: string; // 제목
	backdropPath: string; // 모달 상단 이미지
	overview: string; // 간단 설명
	genres: Genre[]; // 장르
	releaseDate: string; // 개봉일
	posterPath: string; // 포스터 이미지
	originCountry: string[];
	tagline: string; // ?
	adult: boolean; // ?
}

export interface Movie extends Media {
	runtime: number; // 상영시간
	imdbID: string;
}

export interface Series extends Media {
	createdBy: CreatedBy[];
	numberOfEpisodes: number; // 에피소드 갯수
	numberOfSeasons: number; // 시즌 갯수
	seasons: Season[]; // sort해서 마지막 회차의 season 가져오기?
}

export interface Genre {
	id: number;
	name: string;
}
export interface CreatedBy {
	id: number;
	creditID: string;
	name: string;
}

export interface Season {
	id: number;
	name: string;
	seasonNumber: number;
	airDate: Date;
	episodeCount: number;
	overview: string;
	posterPath: string;
}

// type이 없는 경우가 있음.
// 에피소드 키가 있으면 TV로 판단
export const mapMedia = (json: any): Media => ({
	type: json.type
		? json.type === "movie"
			? MediaType.MOVIE
			: MediaType.TV
		: json.release_date
		? MediaType.TV
		: MediaType.MOVIE,
	id: json.id,
	title: json.title ? json.title : json.name,
	backdropPath: json.backdrop_path,
	overview: json.overview,
	genres: json.genres.map((genre: any) => ({
		id: genre.id,
		name: genre.name,
	})),
	releaseDate: json.release_date,
	posterPath: json.poster_path,
	tagline: json.tagline,
	adult: json.adult,
	originCountry: json.origin_country,
});

export const mapMovie = (json: any): Movie => ({
	type: MediaType.MOVIE,
	id: json.id,
	title: json.title,
	backdropPath: json.backdrop_path,
	overview: json.overview,
	genres: json.genres.map((genre: any) => ({
		id: genre.id,
		name: genre.name,
	})),
	releaseDate: json.release_date,
	runtime: json.runtime,
	imdbID: json.imdb_id,
	posterPath: json.poster_path,
	tagline: json.tagline,
	adult: json.adult,
	originCountry: json.origin_country,
});

export const mapTV = (json: any): Series => ({
	type: MediaType.TV,
	id: json.id,
	title: json.name,
	backdropPath: json.backdrop_path,
	overview: json.overview,
	posterPath: json.poster_path,
	genres: json.genres.map((genre: any) => ({
		id: genre.id,
		name: genre.name,
	})),
	releaseDate: json.last_air_date,
	createdBy: json.created_by.map((credit: any) => ({
		id: credit.id,
		creditID: credit.credit_id,
		name: credit.name,
	})),
	numberOfEpisodes: json.number_of_episodes,
	numberOfSeasons: json.number_of_seasons,
	seasons: json.seasons.map((season: any) => ({
		id: season.id,
		name: season.name,
		seasonNumber: season.season_number,
		airDate: season.air_date,
		episodeCount: season.episode_count,
		overview: season.overview,
		posterPath: season.poster_path,
	})),
	originCountry: json.origin_country,
	tagline: json.tagline,
	adult: json.adult,
});

export const mapMediaList = (json: any): Media[] => {
	return json.results.map((result: any) => ({
		type: result.type
			? result.type === "movie"
				? MediaType.MOVIE
				: MediaType.TV
			: result.release_date
			? MediaType.MOVIE
			: MediaType.TV,
		id: result.id,
		title: result.title ? result.title : result.name,
		backdropPath: result.backdrop_path,
		overview: result.overview,
		genres: [],
		releaseDate: result.release_date
			? result.release_date
			: result.last_air_date,
		posterPath: result.poster_path,
		tagline: result.tagline,
		adult: result.adult,
		originCountry: result.origin_country,
	}));
};
