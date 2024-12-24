import { notification } from 'antd';

class ApiService {
  static baseUrl = 'https://blog-platform.kata.academy';

  static getToken() {
    return localStorage.getItem('jwt');
  }

  static async handleResponse(response) {
    if (!response.ok) {
      throw await response.json();
    }
    return response.json();
  }

  static getHeaders(auth = false) {
    const headers = { 'Content-Type': 'application/json' };
    if (auth) {
      const token = this.getToken();
      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }
    }
    return headers;
  }

  static async registration(user) {
    const { username, email, password } = user;
    const url = new URL('/api/users', this.baseUrl);

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify({ user: { username, email, password } }),
      });

      const newUser = await this.handleResponse(response);
      localStorage.setItem('jwt', newUser.user.token);
      return newUser;
    } catch (error) {
      if (error.errors) {
        if (error.errors.username) {
          notification.error({
            message: 'Registration Error',
            description: `Username: ${error.errors.username}`,
          });
        }
        if (error.errors.email) {
          notification.error({
            message: 'Registration Error',
            description: `Email: ${error.errors.email}`,
          });
        }
      } else {
        notification.error({
          message: 'Registration Error',
          description: 'An unknown error occurred during registration.',
        });
      }
      throw error;
    }
  }

  static async login(user) {
    const { email, password } = user;
    const url = new URL('/api/users/login', this.baseUrl);
    const response = await fetch(url, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({ user: { email, password } }),
    });

    const authUser = await this.handleResponse(response);
    localStorage.setItem('jwt', authUser.user.token);
    return authUser;
  }

  static async getUserInfo() {
    const url = new URL('/api/user', this.baseUrl);
    const response = await fetch(url, {
      method: 'GET',
      headers: this.getHeaders(true),
    });

    const info = await this.handleResponse(response);
    localStorage.setItem('jwt', info.user.token);
    return info;
  }

  static async getArticles(page) {
    const url = new URL('/api/articles', this.baseUrl);
    url.searchParams.set('limit', '5');
    url.searchParams.set('offset', (page - 1) * 5);

    const response = await fetch(url, {
      method: 'GET',
      headers: this.getHeaders(true),
    });

    return this.handleResponse(response);
  }

  static async updateUserInfo(user) {
    const { username, email, image, password } = user;
    const newUser = { username, email };
    if (image) newUser.image = image;
    if (password) newUser.password = password;

    const url = new URL('/api/user', this.baseUrl);
    const response = await fetch(url, {
      method: 'PUT',
      headers: this.getHeaders(true),
      body: JSON.stringify({ user: newUser }),
    });

    const updatedUser = await this.handleResponse(response);
    localStorage.setItem('jwt', updatedUser.user.token);
    return updatedUser;
  }

  static async newArticle(article) {
    const url = new URL('/api/articles', this.baseUrl);
    const response = await fetch(url, {
      method: 'POST',
      headers: this.getHeaders(true),
      body: JSON.stringify({ article }),
    });

    return this.handleResponse(response);
  }

  static async getArticle(slug) {
    const url = new URL(`/api/articles/${slug}`, this.baseUrl);
    const response = await fetch(url, {
      method: 'GET',
      headers: this.getHeaders(true),
    });

    return this.handleResponse(response);
  }

  static async deleteArticle(slug) {
    const url = new URL(`/api/articles/${slug}`, this.baseUrl);
    const response = await fetch(url, {
      method: 'DELETE',
      headers: this.getHeaders(true),
    });

    return response.ok;
  }

  static async editArticle(slug, article) {
    const url = new URL(`/api/articles/${slug}`, this.baseUrl);
    const response = await fetch(url, {
      method: 'PUT',
      headers: this.getHeaders(true),
      body: JSON.stringify({ article }),
    });

    return this.handleResponse(response);
  }

  static async likeCard(slug) {
    const url = new URL(`/api/articles/${slug}/favorite`, this.baseUrl);
    const response = await fetch(url, {
      method: 'POST',
      headers: this.getHeaders(true),
    });

    return response.ok;
  }

  static async deleteLikeCard(slug) {
    const url = new URL(`/api/articles/${slug}/favorite`, this.baseUrl);
    const response = await fetch(url, {
      method: 'DELETE',
      headers: this.getHeaders(true),
    });

    return response.ok;
  }
}

export default ApiService;
