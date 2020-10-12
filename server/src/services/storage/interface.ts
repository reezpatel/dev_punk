interface StorageService {
  getFeedImage: (id: string) => string;
  getWebsiteImage: (id: string) => string;
  saveFeedImage: (id: string, url: string) => Promise<string>;
  saveWebsiteImage: (id: string, data: string) => Promise<string>;
}

export default StorageService;
