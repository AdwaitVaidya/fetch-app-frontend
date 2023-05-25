import axios, { AxiosResponse } from 'axios';
import { Dog, Match, SearchParams, SearchResponse } from '../types';





export const getDogBreeds = async () => {
  try {
    const response = await axios.get<string[]>(
      "https://frontend-take-home-service.fetch.com/dogs/breeds",
      { withCredentials: true }
    );
    return response.data;
  } catch (error) {
    throw new Error("Failed to fetch dog breeds");
  }
};

export const searchDogsPage = async (dogs: SearchParams) => {
  try {
    const response = await axios.get(
      "https://frontend-take-home-service.fetch.com"+dogs.from,
      { withCredentials: true }
    );
    return response.data;
  } catch (error) {
    throw new Error("Search failed");
  }
};

export const searchDogs = async (dogs: SearchParams) => {
  try {
    if (Object.keys(dogs).length === 0) {
      const response = await axios.get<SearchResponse>(
        "https://frontend-take-home-service.fetch.com/dogs/search",
        { withCredentials: true }
      );
      return response.data;
    }

    const response = await axios.get<SearchResponse>(
      "https://frontend-take-home-service.fetch.com/dogs/search",
      { params: dogs, withCredentials: true }
    );
    return response.data;
  } catch (error) {
    throw new Error("Search failed");
  }
};

export const getDogsList = async (dogIds: string[]) => {
  try {
    const response: AxiosResponse<Dog[]> = await axios.post(
      "https://frontend-take-home-service.fetch.com/dogs",
      dogIds,
      { withCredentials: true }
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching dogs:", error);
    throw error;
  }
};

export const matchDog = async (dogIds: string[]) => {
  try {
    const response: AxiosResponse<Match> = await axios.post(
      "https://frontend-take-home-service.fetch.com/dogs/match",
      dogIds,
      { withCredentials: true }
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching dogs:", error);
    throw error;
  }
};