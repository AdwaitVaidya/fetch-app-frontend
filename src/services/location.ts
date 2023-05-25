import axios, { AxiosResponse } from "axios"
import { LocationSearchRequestBody, LocationSearchResponse, Location } from "../types";


export const getAllLocations = async () => {
    try {
      const response = await axios.get<Location[]>('https://frontend-take-home-service.fetch.com/locations');
      return response.data;
    } catch (error) {
      throw new Error('Failed to fetch dog breeds');
    }
  };
  
  export const getLocSearch = async (searchParams: {
    city?: string;
    states?: string[];
    geoBoundingBox?: {
      top?: number;
      left?: number;
      bottom?: number;
      right?: number;
      bottom_left?: {
        lat: number;
        lon: number;
      };
      top_right?: {
        lat: number;
        lon: number;
      };
      bottom_right?: {
        lat: number;
        lon: number;
      };
      top_left?: {
        lat: number;
        lon: number;
      };
    };
    size?: number;
    from?: string;
  }) => {
    try {
        const response = await axios.post('/locations/search', searchParams);
        return response.data;
      } catch (error) {
        // Handle error
        console.error('Error searching locations:', error);
        throw error;
      }
  };
  


  export const getLocations = async (zipCodes: string[]) => {
    try {
      const response: AxiosResponse<Location[]> = await axios.post(
        "https://frontend-take-home-service.fetch.com/locations",
        zipCodes,
        { withCredentials: true }
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching dogs:", error);
      throw error;
    }
  };
  
  export const getLocationSearch = async (loc: LocationSearchRequestBody) => {
    try {
      if (Object.keys(loc).length === 0) {
        const response: AxiosResponse<LocationSearchResponse> = await axios.post(
          "https://frontend-take-home-service.fetch.com/locations/search",
          { withCredentials: true }
        );
        return response.data;
      }
  
      const response: AxiosResponse<LocationSearchResponse> = await axios.post(
        "https://frontend-take-home-service.fetch.com/locations/search",
        loc,
        { withCredentials: true }
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching dogs:", error);
      throw error;
    }
  };
  