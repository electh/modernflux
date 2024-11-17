class Storage {
  constructor() {
    this.dbName = "minifluxReader";
    this.dbVersion = 1;
    this.db = null;
  }

  async init() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.dbVersion);

      request.onerror = () => {
        reject(new Error("无法打开数据库"));
      };

      request.onsuccess = (event) => {
        this.db = event.target.result;
        resolve(this.db);
      };

      request.onupgradeneeded = (event) => {
        const db = event.target.result;

        // 创建文章存储
        if (!db.objectStoreNames.contains("articles")) {
          const articlesDb = db.createObjectStore("articles", {
            keyPath: "id",
          });
          articlesDb.createIndex("feedId", "feedId", { unique: false });
          articlesDb.createIndex("status", "status", { unique: false });
        }

        // 创建订阅源存储
        if (!db.objectStoreNames.contains("feeds")) {
          const feedsDb = db.createObjectStore("feeds", {
            keyPath: "id",
            autoIncrement: true,
          });
          feedsDb.createIndex("url", "url", { unique: true });
          feedsDb.createIndex("categoryName", "categoryName", {
            unique: false,
          });
        }
      };
    });
  }

  // 添加文章
  async addArticles(articles) {
    const tx = this.db.transaction("articles", "readwrite");
    const store = tx.objectStore("articles");

    for (const article of articles) {
      await store.put(article);
    }

    return new Promise((resolve, reject) => {
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  }

  // 获取文章列表
  async getArticles(feedId = null, status = null) {
    const tx = this.db.transaction("articles", "readonly");
    const store = tx.objectStore("articles");

    return new Promise((resolve, reject) => {
      let request;

      if (feedId) {
        const index = store.index("feedId");
        request = index.getAll(feedId);
      } else if (status) {
        const index = store.index("status");
        request = index.getAll(status);
      } else {
        request = store.getAll();
      }

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  // 添加订阅源
  async addFeed(feed) {
    const tx = this.db.transaction("feeds", "readwrite");
    const store = tx.objectStore("feeds");

    return new Promise((resolve, reject) => {
      const request = store.put(feed);
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  // 获取所有订阅源
  async getFeeds() {
    const tx = this.db.transaction("feeds", "readonly");
    const store = tx.objectStore("feeds");

    return new Promise((resolve, reject) => {
      const request = store.getAll();
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  // 存储上次同步时间
  async setLastSyncTime(time) {
    localStorage.setItem("lastSyncTime", time.toISOString());
  }

  // 获取上次同步时间
  async getLastSyncTime() {
    const time = localStorage.getItem("lastSyncTime");
    return time ? new Date(time) : null;
  }

  // 获取订阅源未读文章数量
  async getUnreadCount(feedId) {
    const tx = this.db.transaction("articles", "readonly");
    const store = tx.objectStore("articles");
    const index = store.index("feedId");

    return new Promise((resolve, reject) => {
      const request = index.getAll(feedId);
      request.onsuccess = () => {
        const articles = request.result;
        const unreadCount = articles.filter(
          (article) => article.status !== "read",
        ).length;
        resolve(unreadCount);
      };
      request.onerror = () => reject(request.error);
    });
  }

  // 删除数据库中的订阅源
  async deleteFeed(feedId) {
    const tx = this.db.transaction("feeds", "readwrite");
    const store = tx.objectStore("feeds");

    return new Promise((resolve, reject) => {
      const request = store.delete(feedId);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  // 删除全部订阅源
  async deleteAllFeeds() {
    const tx = this.db.transaction("feeds", "readwrite");
    const store = tx.objectStore("feeds");
    await store.clear();
  }

  // 删除数据库中指定订阅源的所有文章
  async deleteArticlesByFeedId(feedId) {
    const tx = this.db.transaction("articles", "readwrite");
    const store = tx.objectStore("articles");
    const index = store.index("feedId");

    return new Promise((resolve, reject) => {
      const request = index.getAllKeys(feedId);

      request.onsuccess = async () => {
        const articleIds = request.result;
        for (const articleId of articleIds) {
          await store.delete(articleId);
        }
        resolve();
      };

      request.onerror = () => reject(request.error);
    });
  }

  // 获取订阅源收藏文章数量
  async getStarredCount(feedId) {
    const tx = this.db.transaction("articles", "readonly");
    const store = tx.objectStore("articles");
    const index = store.index("feedId");

    return new Promise((resolve, reject) => {
      const request = index.getAll(feedId);
      request.onsuccess = () => {
        const articles = request.result;
        const starredCount = articles.filter(
          (article) => article.starred,
        ).length;
        resolve(starredCount);
      };
      request.onerror = () => reject(request.error);
    });
  }
}

export default new Storage();
