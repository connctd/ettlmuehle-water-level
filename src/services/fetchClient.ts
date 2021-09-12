import axios from 'axios';

import { API_BASE_URL } from '../config';

const fetchClient = axios.create({
  baseURL: API_BASE_URL
});

export default fetchClient;
