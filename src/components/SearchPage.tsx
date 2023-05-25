import React, { useState, useEffect } from "react";

import {
  AppBar,
  Box,
  Button,
  Collapse,
  Divider,
  Drawer,
  FormControl,
  Grid,
  IconButton,
  InputLabel,
  List,
  ListItemButton,
  MenuItem,
  Select,
  TextField,
  Toolbar,
  Typography,
} from "@mui/material";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import MultiSelectCheckbox from "./components/MultiSelectCheckbox";
import {
  ChevronLeft,
  ChevronRight,
  Menu,
  KeyboardArrowDown,
} from "@mui/icons-material";
import {
  Location,
  LocationSearchRequestBody,
  LocationSearchResponse,
  Match,
  SearchParams,
  SearchResponse,
  computedValue,
} from "../types";
import CssBaseline from "@material-ui/core/CssBaseline";
import clsx from "clsx";
import { Dog } from "../types";
import DogCard from "./components/DogCard";
import MultiRangeSlider from "./components/multiRangeSlider/MultiRangeSlider";
import { ListItem } from "@material-ui/core";
import {
  getDogBreeds,
  getDogsList,
  matchDog,
  searchDogs,
  searchDogsPage,
} from "../services/dogs";
import { getLocationSearch, getLocations } from "../services/location";
import { logout } from "../services/auth";
import { useNavigate } from "react-router-dom";

const drawerWidth = 300;
const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
  },
  appBar: {
    transition: theme.transitions.create(["margin", "width"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: drawerWidth,
    transition: theme.transitions.create(["margin", "width"], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  hide: {
    display: "none",
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
  drawerPaper: {
    width: drawerWidth,
  },
  drawerHeader: {
    display: "flex",
    alignItems: "center",
    padding: theme.spacing(0, 1),
    ...theme.mixins.toolbar,
    justifyContent: "flex-end",
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: -drawerWidth,
  },
  contentShift: {
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginLeft: 0,
  },
}));

const SearchPage: React.FC = () => {
  const [precomputedValue, setPrecomputedValue] = useState([
    { value: "", label: "" },
  ]);
  const [currentPage, setCurrentPage] = useState(1);
  const [nextQuery, setNextQuery] = useState<string>();
  const [prevQuery, setPrevQuery] = useState<string>();
  const [totalResults, setTotalResults] = useState<number>(0);
  const [breeds, setBreeds] = useState<string[]>([]);
  const [zipCodes, setZipCodes] = useState<string[]>([]);
  const [zipCode, setZipCode] = useState<string>("");
  const [city, setCity] = useState<string>("");
  const [state, setState] = useState<string>("");
  const [cards, setCards] = useState<Dog[]>([]);
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const [minAge, setMinAge] = useState<number | null>(null);
  const [maxAge, setMaxAge] = useState<number | null>(null);
  const [sort, setSort] = useState<
    "breed:asc" | "breed:desc" | "age:asc" | "age:desc"
  >("breed:asc");
  const [favoriteCards, setFavoriteCards] = useState<string[]>([]);

  const classes = useStyles();
  const navigate = useNavigate();
  const theme = useTheme();

  const [openDrawer, setOpenDrawer] = React.useState(false);
  const [expanded, setExpanded] = useState(false);

  const handleToggle = () => {
    setExpanded(!expanded);
  };

  const handleDrawerOpen = () => {
    setOpenDrawer(true);
  };

  const handleDrawerClose = () => {
    setOpenDrawer(false);
  };

  const handleScrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth", // Optional: Add smooth scrolling behavior
    });
  };

  const handleNextPage = async () => {
    try {
      const dogs: SearchParams = {};
      dogs.from = nextQuery;
      dogs.zipCodes = zipCodes;
      dogs.sort = "breed:asc";

      const response: SearchResponse = await searchDogsPage(dogs);

      setTotalResults(response.total);
      setNextQuery(response.next === undefined ? "" : response.next);
      setPrevQuery(response.prev === undefined ? "" : response.prev);
      const data: Dog[] = await getDogsList(response.resultIds);
      setCards(data);
      handleScrollToTop();
    } catch (error) {
      console.error("Error fetching dog breeds:", error);
    }
  };

  const handlePrevPage = async () => {
    try {
      const dogs: SearchParams = {};
      dogs.from = prevQuery;
      dogs.zipCodes = zipCodes;
      dogs.sort = "breed:asc";

      const response: SearchResponse = await searchDogsPage(dogs);

      setTotalResults(response.total);
      setNextQuery(response.next === undefined ? "" : response.next);
      setPrevQuery(response.prev === undefined ? "" : response.prev);
      const data: Dog[] = await getDogsList(response.resultIds);
      setCards(data);
      handleScrollToTop();
    } catch (error) {
      console.error("Error fetching dog breeds:", error);
    }
  };

  const handleDataFromChild = (data: string[]) => {
    setSelectedOptions(data);
  };

  const handleFavorite = (id: string) => {
    const isFavorite = favoriteCards.includes(id);
    if (isFavorite) {
      const updatedFavorites = favoriteCards.filter((cardId) => cardId !== id);
      setFavoriteCards(updatedFavorites);
    } else {
      setFavoriteCards([...favoriteCards, id]);
    }
  };

  const handleLogOut = async () => {
    await logout();
    navigate("/", { replace: true });
  };

  const handleMatch = async () => {
    try {
      if (favoriteCards.length !== 0) {
        const response: Match = await matchDog(favoriteCards);
        const match: Dog[] = await getDogsList([response.match]);
        setCurrentPage(1);
        setNextQuery("");
        setPrevQuery("");
        setTotalResults(0);
        setFavoriteCards([]);

        setCards(match);
      } else {
        alert("Add some favorites first");
      }
    } catch (error) {
      console.error("Error fetching dog breeds:", error);
    }
  };

  useEffect(() => {
    const fetchBreeds = async () => {
      try {
        const loc: LocationSearchRequestBody = {};
        loc.size = 29;
        if (zipCode !== "") {
          if (zipCode.length < 5){
            return
          }

          const response: Location[] = await getLocations([zipCode]);

          const tr = {
            lat: response[0].latitude + 0.5,
            lon: response[0].longitude + 0.5,
          };
          const bl = {
            lat: response[0].latitude - 0.5,
            lon: response[0].longitude - 0.5,
          };
          loc.geoBoundingBox = {
            top_right: tr,
            bottom_left: bl,
          };
        } else {
          setZipCodes([]);
          delete loc.geoBoundingBox;
        }
        if (city !== "" && city !== null) {
          loc.city = city;
        } else {
          delete loc.city;
        }
        if (state === "ALL STATES" || state === null) {
          delete loc.states;
        } else {
          loc.states = [state];
        }

        const re = (lo: Location[]) => {
          lo.map((l) => {
            setZipCodes((prevList) => [...prevList, l.zip_code]);
          });
        };
        setZipCodes((prevList) => [...prevList, zipCode]);

        const res: LocationSearchResponse = await getLocationSearch(loc);

        re(res.results);
      } catch (error) {
        console.error("Error fetching dog breeds:", error);
      }
    };
    fetchBreeds();
  }, [zipCode, city, state]);

  useEffect(() => {
    const states = computedValue;
    setPrecomputedValue(states);
    const fetchBreeds = async () => {
      try {
        const response = await getDogBreeds();
        setBreeds(response);
      } catch (error) {
        console.error("Error fetching dog breeds:", error);
      }
    };
    fetchBreeds();
  }, []);

  useEffect(() => {
    const fetchDogs = async () => {
      setCurrentPage(1);
      setPrevQuery("");
      setNextQuery("");

      try {
        const dogs: SearchParams = {};
        if (maxAge !== null && maxAge !== 30) {
          dogs.ageMax = maxAge;
        } else {
          delete dogs.ageMax;
        }
        if (minAge !== null && minAge !== 0) {
          dogs.ageMin = minAge;
        } else {
          delete dogs.ageMin;
        }
        if (breeds !== null && breeds.length !== 0) {
          dogs.breeds = breeds;
        } else {
          delete dogs.breeds;
        }
        if (zipCodes !== null && zipCodes.length !== 0) {
          dogs.zipCodes = zipCodes;
        } else {
          delete dogs.zipCodes;
        }
        if (sort !== null) {
          dogs.sort = sort;
        } else {
          delete dogs.sort;
        }
        if (selectedOptions !== null && selectedOptions.length !== 0) {
          dogs.breeds = selectedOptions;
        } else {
          delete dogs.breeds;
        }

        const response: SearchResponse = await searchDogs(dogs);

        setTotalResults(response.total);
        setNextQuery(response.next === undefined ? "" : response.next);
        setPrevQuery(response.prev === undefined ? "" : response.prev);
        const data: Dog[] = await getDogsList(response.resultIds);
        setCards(data);
      } catch (error) {
        console.error("Error fetching dog breeds:", error);
      }
    };
    fetchDogs();
  }, [selectedOptions, zipCodes, minAge, maxAge, sort]);

  return (
    <div className={classes.root}>
      <CssBaseline />
      <AppBar
        position="fixed"
        className={clsx(classes.appBar, {
          [classes.appBarShift]: openDrawer,
        })}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="openDrawer drawer"
            onClick={handleDrawerOpen}
            edge="start"
            className={clsx(classes.menuButton, openDrawer && classes.hide)}
          >
            <Menu />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Fetch A Dog
          </Typography>
          <Button variant="contained" onClick={handleMatch}>
            Find Match
          </Button>
          <Button variant="contained" onClick={handleLogOut}>
            Log Out
          </Button>
        </Toolbar>
      </AppBar>

      <Drawer
        className={classes.drawer}
        variant="persistent"
        anchor="left"
        open={openDrawer}
        classes={{
          paper: classes.drawerPaper,
        }}
      >
        <div className={classes.drawerHeader}>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === "ltr" ? <ChevronLeft /> : <ChevronRight />}
          </IconButton>
        </div>

        <Divider />

        <List
          sx={{ width: "100%", maxWidth: 360, bgcolor: "background.paper" }}
          component="nav"
          aria-labelledby="nested-list-subheader"
        >
          <ListItem>
            <div style={{ width: 250 }}>
              <MultiRangeSlider
                min={0}
                max={30}
                onChange={({ min, max }) => {
                  setMinAge(min);
                  setMaxAge(max);
                }}
              />
            </div>
          </ListItem>

          <ListItem>
            <div>
              <TextField
                placeholder="Enter name of the city"
                style={{ width: 250 }}
                onChange={(e) => {
                  setCity(e.target.value);
                }}
                sx={{ color: "inherit", ml: 1 }}
              />
            </div>
          </ListItem>

          <ListItem>
            <div>
              <FormControl>
                <InputLabel id="state-label">Select State</InputLabel>
                <Select
                  labelId="state-label"
                  value={state}
                  MenuProps={{
                    PaperProps: {
                      style: {
                        maxHeight: 200,
                      },
                    },
                  }}
                  style={{ width: 250 }}
                  onChange={(e) => {
                    setState(e.target.value);
                  }}
                >
                  {precomputedValue.map((state) => (
                    <MenuItem key={state.value} value={state.value}>
                      {state.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </div>
          </ListItem>

          <ListItem>
            <div>
              <FormControl>
                <InputLabel id="state-label">Select Sorting Method</InputLabel>
                <Select
                  labelId="state-label"
                  value={sort}
                  MenuProps={{
                    PaperProps: {
                      style: {
                        maxHeight: 200,
                      },
                    },
                  }}
                  style={{ width: 250 }}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (
                      value !== "breed:asc" &&
                      value !== "breed:desc" &&
                      value !== "age:asc" &&
                      value !== "age:desc"
                    ) {
                      return;
                    } else {
                      setSort(value);
                    }
                  }}
                >
                  <MenuItem key={"breed:asc"} value={"breed:asc"}>
                    {" "}
                    Ascending Based on Breed{" "}
                  </MenuItem>
                  <MenuItem key={"breed:desc"} value={"breed:desc"}>
                    {" "}
                    Descending Based on Breed{" "}
                  </MenuItem>
                  <MenuItem key={"age:asc"} value={"age:asc"}>
                    {" "}
                    Ascending Based on Age{" "}
                  </MenuItem>
                  <MenuItem key={"age:desc"} value={"age:desc"}>
                    {" "}
                    Descending Based on Age{" "}
                  </MenuItem>
                </Select>
              </FormControl>
            </div>
          </ListItem>

          <ListItem>
            <div>
              <TextField
                placeholder="Enter name of the zipcode"
                onChange={(e) => {
                  setZipCode(e.target.value);
                }}
                style={{ width: 250 }}
                sx={{ color: "inherit", ml: 1 }}
              />
            </div>
          </ListItem>

          <div style={{ width: 300 }}>
            <ListItemButton onClick={handleToggle}>
              <Box display="flex" alignItems="center" onClick={handleToggle}>
                <IconButton>
                  {expanded === true ? <KeyboardArrowDown /> : <ChevronRight />}
                </IconButton>
                <Typography variant="h6" style={{ cursor: "pointer" }}>
                  Breeds
                </Typography>
              </Box>
            </ListItemButton>
            <div style={{ width: 250 }}>
              <Box sx={{ overflow: "auto" }}>
                <Collapse in={expanded} style={{ maxHeight: "450px" }}>
                  <MultiSelectCheckbox
                    label="Breeds"
                    options={breeds}
                    setSelectedOptionsChange={handleDataFromChild}
                  />
                </Collapse>
              </Box>
            </div>
          </div>
        </List>
      </Drawer>
      <main
        className={clsx(classes.content, {
          [classes.contentShift]: openDrawer,
        })}
      >
        <div className={classes.drawerHeader} />
        <Grid container spacing={2}>
          {cards.map((card) => (
            <Grid item xs={12} sm={6} md={4} lg={3} xl={3} key={card.id}>
              <DogCard
                dog={card}
                isFavorite={favoriteCards.includes(card.id)}
                onFavorite={handleFavorite}
              />
            </Grid>
          ))}
        </Grid>

        <h2>Page: {currentPage}</h2>
        <div className="spinner-border"></div>
        <Button
          id="previousPage"
          disabled={prevQuery === undefined || prevQuery === "" ? true : false}
          onClick={() => {
            handlePrevPage();
            setCurrentPage((prevCount) => prevCount - 1);
          }}
        >
          Previous
        </Button>
        <Button
          id="nextPage"
          disabled={nextQuery === undefined || nextQuery === "" ? true : false}
          onClick={() => {
            setCurrentPage((prevCount) => prevCount + 1);
            handleNextPage();
          }}
        >
          Next
        </Button>
      </main>
    </div>
  );
};

export default SearchPage;
