import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";


// interfaces --------------------------------------------------------

interface CounterState {
  data: DayWeather[] | null;
  location: string;
}

interface WeatherCondition {
  text: string;
  icon: string;
}

interface DayWeather {
  date: string;
  day: {
    avgtemp_c: number;
    maxtemp_c: number;
    mintemp_c: number;
    condition: WeatherCondition;
  };
}

const initialState: CounterState = {
  data: null,
  location: "",
};

export const fetchWeather: any = createAsyncThunk(
  "weather/fetchWeather",
  async () => {
    try {
      // Get user location
      const userLocation = await new Promise<string>((resolve, reject) => {
        const success = async (position: GeolocationPosition) => {
          const geoApiUrl = `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${position.coords.latitude}&longitude=${position.coords.longitude}&localityLanguage=en`;

          try {
            const res = await fetch(geoApiUrl);
            const data = await res.json();
            resolve(data.city);
          } catch (err) {
            reject("Failed to fetch city name");
          }
        };

        const error = () => {
          reject("Geolocation error");
        };

        navigator.geolocation.getCurrentPosition(success, error);
      });
      console.log(userLocation, "loc");
      // Get weather for desktop
      const response = await fetch(
        `https://api.weatherapi.com/v1/marine.json?key=78eda694ddea48a7847114126242008&q=${userLocation}&days=7`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch weather data");
      }
      const data = await response.json();
      console.log(data, "data");
      return data;
    } catch (error) {
      console.error(error);
      throw error; // Re-throw the error to let Redux Toolkit handle it
    }
  }
);



export const weatherSlice = createSlice({
  name: "weather",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchWeather.fulfilled, (state, action) => {
        state.data = action.payload.forecast.forecastday,
        state.location = action.payload.location.name
      })
  },
});

export default weatherSlice.reducer;
