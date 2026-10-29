const mangayomiSources = [
  {
    name: "Hanime.tv",
    id: 1938274611,
    baseUrl: "https://hanime.tv",
    lang: "en",
    typeSource: "single",
    iconUrl: "https://www.google.com/s2/favicons?sz=256&domain=hanime.tv",
    dateFormat: "",
    dateFormatLocale: "",
    isNsfw: true,
    hasCloudflare: false,
    sourceCodeUrl: "https://raw.githubusercontent.com/KungKing12/Mangayomi-extensions-/main/javascript/anime/src/en/hanime.js",
    apiUrl: "",
    version: "0.1.0",
    isManga: false,
    itemType: 1,
    isFullData: false,
    appMinVerReq: "0.5.0",
    additionalParams: "",
    sourceCodeLanguage: 1,
    notes: "Adult source (18+). Catalog/search uses Hanime.tv's public API. Video playback may require a signed-in Hanime account; this extension does not bypass authentication.",
    pkgPath: "anime/src/en/hanime.js"
  }
];

class DefaultExtension extends MProvider {
  constructor() {
    super();
    this.client = new Client();
    this.base = "https://hanime.tv";
    this.searchApi = "https://search.htv-services.com/";
    this.videoApi = "https://hanime.tv/api/v8/video?id=";
  }

  getHeaders(url) {
    return {
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
      "Referer": url || this.base + "/",
      "Origin": this.base,
      "Accept": "application/json, text/plain, */*"
    };
  }

  _stripHtml(value) {
    return String(value || "")
      .replace(/<script[\s\S]*?<\/script>/gi, " ")
      .replace(/<style[\s\S]*?<\/style>/gi, " ")
      .replace(/<[^>]*>/g, " ")
      .replace(/&nbsp;/gi, " ")
      .replace(/&amp;/gi, "&")
      .replace(/&quot;/gi, '"')
      .replace(/&#39;/gi, "'")
      .replace(/\s+/g, " ")
      .trim();
  }

  _videoPageUrl(value) {
    const input = String(value || "").trim();
    if (/^https?:\/\//i.test(input)) return input;
    const slug = input.replace(/^\/+|\/+$/g, "");
    return this.base + "/videos/hentai/" + slug;
  }

  _slugFromUrl(value) {
    const clean = String(value || "").split("?")[0].replace(/\/+$/g, "");
    return clean.substring(clean.lastIndexOf("/") + 1);
  }

  async _requestJson(url, headers) {
    const response = await this.client.get(url, headers || this.getHeaders(url));
    return JSON.parse(response.body || "{}");
  }

  async _searchPage(query, page, orderBy, ordering) {
    const currentPage = Math.max((Number(page) || 1) - 1, 0);
    const payload = {
      blacklist: [],
      brands: [],
      order_by: orderBy || "views",
      ordering: ordering || "desc",
      page: currentPage,
      search_text: String(query || "").trim(),
      tags: [],
      tags_mode: "AND"
    };

    try {
      const headers = Object.assign({}, this.getHeaders(this.searchApi), {
        "Content-Type": "application/json;charset=UTF-8"
      });
      const response = await this.client.post(
  this.searchApi,
  headers,
  payload
      );
      const result = JSON.parse(response.body || "{}");
      let hits = result.hits || [];
      if (typeof hits === "string") hits = JSON.parse(hits || "[]");
      if (!Array.isArray(hits)) hits = [];

      
const list = hits.map((item) => {
  const slug = item.slug || item.id || "";
  const name = item.name || item.title || slug;
  const videoUrl = this._videoPageUrl(slug);

  return {
    name: name,
    url: videoUrl,
    link: videoUrl,
    imageUrl:
      item.poster_url ||
      item.cover_url ||
      item.thumbnail_url ||
      item.thumbnail ||
      ""
  };
}).filter((item) => item.name && item.link);


      const totalPages = Number(result.nbPages || result.nb_pages || 0);
      const hasNextPage = totalPages > 0 ? currentPage + 1 < totalPages : list.length > 0;
      return { list: list, hasNextPage: hasNextPage };
    } catch (error) {
      console.log("Hanime.tv search error: " + String(error));
      return { list: [], hasNextPage: false };
    }
  }

  async getPopular(page) {
    return await this._searchPage("", page, "views", "desc");
  }

  async getLatestUpdates(page) {
    return await this._searchPage("", page, "created_at_unix", "desc");
  }

  async search(query, page, filters) {
    return await this._searchPage(query, page, "views", "desc");
  }

  async getDetail(url) {
    const pageUrl = this._videoPageUrl(url);
    const slug = this._slugFromUrl(pageUrl);
    const emptyDetail = {
      name: slug || "Hanime.tv video",
      link: pageUrl,
      imageUrl: "",
      description: "Open this title on Hanime.tv for current information.",
      author: "",
      genre: [],
      status: 1,
      episodes: [{ name: "Open on Hanime.tv", url: pageUrl, scanlator: "Hanime.tv", dateUpload: String(Date.now()) }]
    };

    try {
      const data = await this._requestJson(this.videoApi + encodeURIComponent(slug), this.getHeaders(pageUrl));
      const video = data.hentai_video || data.video || data;
      if (!video || !(video.slug || video.name)) return emptyDetail;

      const tags = Array.isArray(video.hentai_tags) ? video.hentai_tags : (Array.isArray(video.tags) ? video.tags : []);
      const genres = tags.map((tag) => typeof tag === "string" ? tag : (tag.text || tag.name || "")).filter(Boolean);
      const franchiseVideos = Array.isArray(data.hentai_franchise_hentai_videos) ? data.hentai_franchise_hentai_videos : [];
      const episodes = [];
      const seen = {};
      for (const entry of franchiseVideos) {
        const epSlug = entry.slug || entry.id;
        if (!epSlug || seen[epSlug]) continue;
        seen[epSlug] = true;
        episodes.push({
          name: entry.name || entry.title || epSlug,
          url: this._videoPageUrl(epSlug),
          scanlator: "Hanime.tv",
          dateUpload: String(Date.now())
        });
      }
      if (episodes.length === 0) {
        episodes.push({
          name: video.name || slug,
          url: pageUrl,
          scanlator: "Hanime.tv",
          dateUpload: String(Date.now())
        });
      }

      return {
        name: video.name || slug,
        link: pageUrl,
        imageUrl: video.poster_url || video.cover_url || "",
        description: this._stripHtml(video.description || ""),
        author: (video.brand && (video.brand.name || video.brand.title || video.brand)) || "",
        genre: genres,
        status: 1,
        episodes: episodes
      };
    } catch (error) {
      console.log("Hanime.tv detail error: " + String(error));
      return emptyDetail;
    }
  }

  async getVideoList(url) {
    const pageUrl = this._videoPageUrl(url);
    const slug = this._slugFromUrl(pageUrl);
    try {
      const data = await this._requestJson(this.videoApi + encodeURIComponent(slug), this.getHeaders(pageUrl));
      const manifest = data.videos_manifest || {};
      const servers = Array.isArray(manifest.servers) ? manifest.servers : [];
      const videos = [];
      const seen = {};

      for (const server of servers) {
        const streams = Array.isArray(server.streams) ? server.streams : [];
        for (const stream of streams) {
          const streamUrl = String(stream.url || "").trim();
          if (!/^https?:\/\//i.test(streamUrl) || seen[streamUrl]) continue;
          seen[streamUrl] = true;
          const height = Number(stream.height || stream.resolution || 0);
          videos.push({
            url: streamUrl,
            originalUrl: pageUrl,
            quality: height > 0 ? String(height) + "p" : (server.name || "Hanime.tv")
          });
        }
      }

      // Hanime.tv may omit public stream URLs and require an authenticated session.
      // Do not attempt to bypass authentication; an empty array lets the app report no playable stream.
      return videos;
    } catch (error) {
      console.log("Hanime.tv video error: " + String(error));
      return [];
    }
  }
}
