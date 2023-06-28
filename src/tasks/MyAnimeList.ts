import axios from "axios";
import type { Anime, AnimeListRaw, KistuAnimeAPIResponse } from "../lib/types.js";
import type { ApiServer } from "../lib/Server.js";
import { Time } from "@sapphire/timestamp";

const fn = (server: ApiServer) => {
	const cronFunction = async () => {
		const exisingData = await server.redis.get("anime");
		const parsedData = JSON.parse(exisingData || "[]") as Anime[];
		const res = await axios.get<AnimeListRaw[]>("https://myanimelist.net/animelist/ijsKoud/load.json?status=7&offset=0");

		const getBannerImage = async (title: string): Promise<string | undefined> => {
			const res = await axios.get<KistuAnimeAPIResponse>(`https://kitsu.io/api/edge/anime?filter%5Btext%5D=${encodeURIComponent(title)}`);
			return res.data.data[0].attributes.coverImage?.tiny;
		};

		const getBanner = async (title: string): Promise<string> => {
			const anime = parsedData.find((an) => an.title === title);
			if (anime) return anime.banner;

			return (await getBannerImage(title)) ?? "";
		};

		const list: Anime[] = await Promise.all(
			res.data.map(async (anime) => ({
				title: anime.anime_title,
				title_english: anime.anime_title_eng,
				genres: anime.genres.map((genre) => genre.name.toLowerCase()),
				rating: anime.score,
				status: anime.status - 1,
				episodes: {
					watched: anime.num_watched_episodes,
					total: anime.anime_num_episodes
				},
				image: anime.anime_image_path,
				url: `https://myanimelist.net${anime.anime_url}`,
				banner: await getBanner(anime.anime_title)
			}))
		);

		await server.redis.set("anime", JSON.stringify(list));
		server.logger.info("[CRON_MAL]: Updated the anime watch status information.");
	};

	setInterval(cronFunction, Time.Minute * 10);
};

export default fn;
