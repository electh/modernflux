import axios from 'axios';

class miniFluxAPI {
  constructor() {
    this.client = axios.create({
      baseURL: 'https://rss.electh.top',
      headers: {
        'X-Auth-Token': 'kfSa5PN4vNG1i3ZZBF05ZvdHUmNBV10lSpThRTS4VAU='
      }
    });
  }

  // 获取所有订阅源
  async getFeeds() {
    try {
      const response = await this.client.get('/v1/feeds');
      return response.data;
    } catch (error) {
      console.error('获取订阅源失败:', error);
      throw error;
    }
  }

  // 获取指定订阅源的文章
  async getFeedEntries(feedId) {
    try {
      const response = await this.client.get('/v1/feeds/' + feedId + '/entries', {
        params: { direction: 'desc', limit: 50 }
      });
      return response.data.entries;
    } catch (error) {
      console.error('获取文章失败:', error);
      throw error;
    }
  }

  // 添加新的订阅源
  async addFeed(feedUrl, categoryId = null) {
    try {
      const response = await this.client.post('/v1/feeds', {
        feed_url: feedUrl,
        category_id: categoryId
      });
      return response.data;
    } catch (error) {
      console.error('添加订阅源失败:', error);
      throw error;
    }
  }

  // 更新文章阅读状态
  async updateEntryStatus(entry) {
    try {
      const status = entry.status === 'read' ? 'unread' : 'read';
      await this.client.put('/v1/entries', {
        entry_ids: [entry.id],
        status
      });
    } catch (error) {
      console.error(`标记文章${entry.status === 'read' ? '已读' : '未读'}失败:`, error);
      throw error;
    }
  }
}

export default new miniFluxAPI();