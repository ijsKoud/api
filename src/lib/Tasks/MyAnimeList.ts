import { schedule } from "node-cron";
import type Server from "../Server.js";
import axios from "axios";
import type { Anime, AnimeListRaw, AnimeDatabaseResults, KistuAnimeAPIResponse } from "../types.js";

const fn = (server: Server) => {
	const cron = schedule("0 0/10 0 * * * *", async () => {
		const existingData = (await server.redis.json.get("anime")) as AnimeDatabaseResults;
		const res = await axios.get<AnimeListRaw[]>("https://myanimelist.net/animelist/ijsKoud/load.json?status=7&offset=0");

		const getBannerImage = async (title: string): Promise<string | undefined> => {
			const res = await axios.get<KistuAnimeAPIResponse>(`https://kitsu.io/api/edge/anime?filter%5Btext%5D=${encodeURIComponent(title)}`);
			return res.data.data[0].attributes.coverImage?.tiny;
		};

		const getBanner = async (title: string): Promise<string> => {
			const anime = existingData?.data.find((an) => an.title === title);
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

		await server.redis.json.set("anime", "$", { data: list as any });
		server.logger.info("[CRON_MAL]: Updated the anime watch status information.");
	});

	cron.start();
};

export default fn;
