import axios from "axios";

class miniFluxAPI {
  constructor() {
    this.client = axios.create({
      baseURL: "https://rss.electh.top",
      headers: {
        "X-Auth-Token": "kfSa5PN4vNG1i3ZZBF05ZvdHUmNBV10lSpThRTS4VAU=",
      },
    });
  }

  // 获取所有订阅源
  async getFeeds() {
    try {
      const response = await this.client.get("/v1/feeds");
      return response.data;
    } catch (error) {
      console.error("获取订阅源失败:", error);
      throw error;
    }
  }

  // 获取指定订阅源的文章
  async getFeedEntries(feedId) {
    try {
      const response = await this.client.get(
        "/v1/feeds/" + feedId + "/entries",
        {
          params: { direction: "desc", limit: 50 },
        },
      );
      return response.data.entries;
    } catch (error) {
      console.error("获取文章失败:", error);
      throw error;
    }
  }

  // 更新文章阅读状态
  async updateEntryStatus(entry) {
    try {
      const status = entry.status === "read" ? "unread" : "read";
      await this.client.put("/v1/entries", {
        entry_ids: [entry.id],
        status,
      });
    } catch (error) {
      console.error(
        `标记文章${entry.status === "read" ? "已读" : "未读"}失败:`,
        error,
      );
      throw error;
    }
  }

  // 更新文章星标状态
  async updateEntryStarred(entry) {
    try {
      await this.client.put(`/v1/entries/${entry.id}/bookmark`);
    } catch (error) {
      console.error("更新文章星标状态失败:", error);
      throw error;
    }
  }

  // 获取变更文章
  async getChangedEntries(lastSyncTime) {
    try {
      const timestamp = Math.floor(new Date(lastSyncTime).getTime() / 1000);
      const response = await this.client.get("/v1/entries", {
        params: {
          changed_after: timestamp,
          direction: "desc",
          limit: 0,
        },
      });
      return response.data.entries;
    } catch (error) {
      console.error("获取变更文章失败:", error);
      throw error;
    }
  }

  // 获取新文章
  async getNewEntries(lastSyncTime) {
    try {
      const timestamp = Math.floor(new Date(lastSyncTime).getTime() / 1000);
      const response = await this.client.get("/v1/entries", {
        params: {
          after: timestamp,
          direction: "desc",
          limit: 0,
        },
      });
      return response.data.entries;
    } catch (error) {
      console.error("获取新文章失败:", error);
      throw error;
    }
  }

  // 标记全部已读
  async markAllAsRead(type, id = null) {
    try {
      let endpoint = "/v1/entries";

      // 如果是用户级别的标记已读，先获取用户信息
      if (type === "all") {
        const response = await this.client.get("/v1/me");
        const userId = response.data.id;
        endpoint = `/v1/users/${userId}/mark-all-as-read`;
      } else if (type === "feed" && id) {
        endpoint = `/v1/feeds/${id}/mark-all-as-read`;
      } else if (type === "category" && id) {
        endpoint = `/v1/categories/${id}/mark-all-as-read`;
      }

      await this.client.put(endpoint);
    } catch (error) {
      console.error("标记全部已读失败:", error);
      throw error;
    }
  }
}

export default new miniFluxAPI();
