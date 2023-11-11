import axios from 'axios';

export const ApiKey = 'SCbSQa7GWBzJsZxrS4QkISmwOms1qqrR4Z6lZvkQphs';
const mapsApi = axios.create({
  baseURL: 'https://discover.search.hereapi.com/v1'
});

type Item = {
  title: string,
  id: string,
  address: {
    label: string,
    countryCode: string,
    countryName: string,
    stateCode: string,
    state: string,
    county: string,
    city: string,
    district: string,
    street: string,
    postalCode: string,
    houseNumber: number
  },
  position: { lat: number, lng: number },
  categories: [
    {
      id: string,
      name: string,
      primary: boolean
    }
  ],
  contacts: [
    {
      phone: [{ value: string }],
      www: [{ value: string }]
    }
  ]
}

type SearchResponse = {
  items: Item[]
}

export const HereApiRequests = {
  SearchByText: async (text: string): Promise<Item | null> => {
    return new Promise((resolve) => {
      mapsApi.get(`discover?at=-15.7801,-47.9292&limit=1&q=${text}&apiKey=${ApiKey}`).then(response => {
        let result: Array<Item> = []
        if (response.status === 200)
          result = (response.data as SearchResponse).items;

        if (result.length > 0)
          resolve(result[0]);
        else
          resolve(null);
      });
    });
  },
  SearchByRestaurants: async (lat: number, long: number): Promise<Item[]> => {
    return new Promise((resolve) => {
      mapsApi.get(`discover?in=circle:${lat},${long};r=10000&q=Restaurant&apiKey=${ApiKey}`).then(response => {
        let result: Array<Item> = []
        if (response.status === 200)
          result = (response.data as SearchResponse).items;

        resolve(result);
      });
    });
  },
}

export default mapsApi;