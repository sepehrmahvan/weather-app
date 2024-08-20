import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchWeather } from "./app/weatherData/weatherData";
import backgroundImage from "./assets/background.jpg";
import { Box, Container, Paper, ThemeCssVarOverrides, Typography } from "@mui/material";
import { makeStyles } from "@mui/styles";

// interfaces
interface Condition {
  text: string;
  icon: string;
}

interface Day {
  avgtemp_c: number;
  maxtemp_c: number;
  mintemp_c: number;
  condition: Condition;
}

interface WeatherData {
  date: string;
  day: Day;
}

interface WeatherState {
  data: WeatherData[];
  location: string;
}


// styles
const styles = {
  weatherContainer: {
    background: `url(${backgroundImage}) rgba(0,0,0,30%)`,
    backgroundSize: "cover",
    backgroundRepeat: "no-repeat",
    backgroundBlendMode: "darken",
    height: "100vh",
    boxSizing: "border-box",
    display: "flex",
    justifyContent: "center",
    alignItems: "center"
  },
  weatherBox: {
    height: "100%",
    padding: "0",
    display: "flex !important",
    justifyContent: "center !important",
    alignItems: "center !important"
  },
  todayInfo: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    padding: "0",
    width: "100% !important",
    margin: "0 !important"
  },
  paper: {
    padding: "20px",
    boxSizing: "border-box",
    backgroundColor: "rgba(255, 255, 255, 0) !important",
    backdropFilter: "blur(10px)",
    borderRadius: "10px !important",
    width: "100% !important",
    margin: "0 !important"
  },
  nameBox: {
    width: "50% !important",
    textAlign: "left !important",
  },
  location: {
    color: "white",
    fontSize: "6vw !important",
  },
  date: {
    fontSize: "1.5vw !important",
    color: "white",
    padding: "15px 0",
    letterSpacing: "4px !important",
  },
  situation: {
    display: "flex",
    justifyContent: "flex-start",
    alignItems: "center",
  },
  icon: {
    width: "17%",
  },
  condition: {
    color: "white",
    fontSize: "1.5vw !important",
    marginLeft: "25px !important",
    textTransform: "capitalize",
  },
  tempBox: {
    width: "50% !important",
    textAlign: "center !important",
  },
  avgTemp: {
    fontSize: "5vw !important",
    color: "white",
  },
  minMaxTemps: {
    color: "white !important",
    fontSize: "2vw",
    marginTop: "10px !important",
  },
  line: {
    width: "100% !important",
    height: "3px !important",
    backgroundColor: "white !important",
    margin: "20px 0 !important",
  },
  otherDays:{
    display: "flex",
    justifyContent: "space-evenly"
  },
  dayBox: {
    width: "17% !important",
    textAlign: "center",
    cursor: "pointer !important"
  },
  dayDate: {
    color: "white !important",
    fontSize: "1.5vw !important",
  },
  daysIcon: {
    width: "60%",
    margin: "15px 0 !important",
  },
  daysTemps: {
    color: "white !important",
    fontSize: "1.5vw !important",
  },
};

const App: React.FC = () => {
  // getting weather data -----------------------------------
  const dispatch = useDispatch();
  const weather = useSelector((state: { weather: WeatherState } ) => state.weather.data);
  const weatherLocation = useSelector((state: { weather: WeatherState }) => state.weather.location);

  // calling weather fetching API function----------------------
  useEffect(() => {
    dispatch(fetchWeather());
  }, [dispatch]);

  // main weather for today ------------------------------------
  const useStyles: any = makeStyles(styles as ThemeCssVarOverrides);
  const classes = useStyles();
  const [todayWeather, setTodayWeather] = useState<WeatherData | undefined>(undefined);

  useEffect(() => {
    if (weather) {
      setTodayWeather(weather[0]);
    }
  }, [weather]);

  const todayInfo = todayWeather && (
    <Box className={classes.todayInfo}>
      <Box className={classes.nameBox}>
        <Typography className={classes.location} variant="h1">
          {weatherLocation}
        </Typography>
        <Typography className={classes.date}>{todayWeather.date}</Typography>
        <Box className={classes.situation}>
          <Box
            component="img"
            src={todayWeather.day.condition.icon}
            alt="icon"
            className={classes.icon}
          />
          <Typography className={classes.condition} variant="h3">
            {todayWeather.day.condition.text}
          </Typography>
        </Box>
      </Box>
      <Box className={classes.tempBox}>
        <Typography className={classes.avgTemp}>
          {todayWeather.day.avgtemp_c}°C
        </Typography>
        <Box className={classes.minMaxTemps}>
          {todayWeather.day.mintemp_c}° / {todayWeather.day.maxtemp_c}°
        </Box>
      </Box>
    </Box>
  );

  return (
    <div className={classes.weatherContainer}>
      <Container className={classes.weatherBox}>
        <Paper className={classes.paper}>
          {/* today info */}
          {todayInfo}
          {/* line */}
          <Box className={classes.line}></Box>
          {/* other days */}
          <Box className={classes.otherDays}>
            {weather &&
              weather.map((day: WeatherData, index: number) => (
                <Box
                  className={classes.dayBox}
                  onClick={() => setTodayWeather(day)}
                  key={index}
                >
                  <Typography className={classes.dayDate}>
                    {day.date}
                  </Typography>
                  <Box className={classes.otherDay}>
                    <Box
                      component="img"
                      src={day.day.condition.icon}
                      alt="icon"
                      className={classes.daysIcon}
                    />
                  </Box>
                  <Typography className={classes.daysTemps}>
                    {day.day.mintemp_c}° / {day.day.maxtemp_c}°
                  </Typography>
                </Box>
              ))}
          </Box>
        </Paper>
      </Container>
    </div>
  );
};

export default App;
