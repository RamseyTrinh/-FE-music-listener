import React, { useState, useEffect } from "react";
import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    IconButton,
    Slider,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField,
    Typography,
} from "@mui/material";
import { PlayArrow, Pause, SkipNext, SkipPrevious, Shuffle, Delete, VolumeDown, VolumeUp } from "@mui/icons-material";
import SearchIcon from '@mui/icons-material/Search';
import { socket } from '../../socket';

const JukeboxApp = () => {
    const [joinModalOpen, setJoinModalOpen] = useState(false);
    const [clearQueueModalOpen, setClearQueueModalOpen] = useState(false);
    const [volume, setVolume] = useState(50);
    const [isPlaying, setIsPlaying] = useState(false);
    const [timestamp, setTimestamp] = useState(0);
    const [albumArt, setAlbumArt] = useState("https://baolamdong.vn/file/e7837c02845ffd04018473e6df282e92/dataimages/202004/original/images2282618_song_bien.jpg");
    const [songName, setSongName] = useState("song name");
    const [songArtist, setSongArtist] = useState("song artist");
    const [songUrl, setSongUrl] = useState("");
    const [loading, setLoading] = useState(false);
    const [queueList, setQueueList] = useState([]);

    let hasPlayed = false;
    var audio = document.getElementById("songplayer");

    const handleInputChange = (event) => {
        setSongUrl(event.target.value);
    };
    const handleKeyPress = async (event) => {
        if (event.key === "Enter") {
          setLoading(true);
          try {
            const response = await fetch("http://127.0.0.1:5135/add_song", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ songurl: songUrl }),
            });
    
            if (response.ok) {
              const data = await response.json();
              console.log("Song added to queue:", data);
              alert("Song added to queue");
            } else {
              console.error("Error adding song to queue:", response.statusText);
            }
          } catch (error) {
            console.error("Error adding song to queue:", error);
          } finally {
            setLoading(false);
            setSongUrl("");
          }
        }
      };

    const handleVolumeChange = (event, newValue) => {
        setVolume(newValue);
    };

    // const playPause = () => {
    //     document.getElementById("loadingsong")?.classList.add("hidden")
    //     if (!hasPlayed) {
    //         requestInitialSync();
    //         hasPlayed = true;
    //         playsong(true);
            
    //     } else {
    //       if (isPlaying) {
    //         pausesong();
    //         document.getElementById("play-icon")?.classList.remove("hidden");
    //         document.getElementById("pause-icon")?.classList.add("hidden");
    //       } else {
    //         playsong();
    //         document.getElementById("play-icon")?.classList.add("hidden");
    //         document.getElementById("pause-icon")?.classList.remove("hidden");

    //       }
    //     }
    // }

    socket.on("connect", function () {
        console.log("Connected to server");
        socket.emit("request_sync");
    });

    socket.on("play", function (data) {
        console.log("Play event received from server", data);
        if (!isPlaying) {
            audio.play();
            setIsPlaying(true);
        }
    });
    socket.on("pause", function (data) {
        console.log("Pause event received from server", data);
        if (data.timestamp !== undefined) {
          audio.currentTime = data.timestamp;
          if (isPlaying) {
            audio.pause();
            setIsPlaying(false);
          }
        } else {
          console.error("Pause event received without timestamp");
        }
      });

    socket.on("sync", function (data) {
        console.log("Sync event received from server", data);
        if (data.timestamp !== undefined) {
            setTimestamp(data.timestamp); // Store current timestamp

            if (data.song) {
                playSong(data.song.filename, data.song.title, data.song.artist, data.song.cover_art);
            }

            console.log(data.is_playing);
            console.log(data);
            console.log(isPlaying);
            

            if (data.action === 'seek') {
                // audio.currentTime = data.timestamp;
            }
            else if (data.is_playing && isPlaying) {
                // audio.currentTime = data.timestamp;
                // audio.play();
                setIsPlaying(true);
                console.log('def');
                
            }
            else if (!data.is_playing && !isPlaying) {
                // audio.currentTime = data.timestamp;
                // audio.pause();
                setIsPlaying(false);
                console.log('abc');
                
            }

            // slider.value = (audio.currentTime / audio.duration) * 100;
        } else {
            console.error("Sync event received without timestamp");
        }
    });

    function requestInitialSync() {
        console.log("Requesting initial sync from server");
        socket.emit("request_sync");
    }

    function playSong(filePath, title, artist, cover_art) {
        console.log("Playing song:", filePath, title, artist, cover_art);
        var audio = document.getElementById("songplayer");
        if (filePath) {
            let encodedPath = btoa(unescape(encodeURIComponent(filePath))); // Base64 encode the path
            // audio.src = `/music/${encodedPath}`;
            setSongName(title);
            setSongArtist(artist);
            setAlbumArt(cover_art);
        }
        // audio.currentTime = timestamp;
    }


    function handlePlayPause() {
        if (!isPlaying) {
            requestInitialSync();
            console.log("Playing songggggggggggggg");
            socket.emit("play", { timestamp: audio.currentTime });
            audio?.play();
            setIsPlaying(true);
        } else {
            console.log("Pausing song");
            socket.emit("pause", { timestamp: timestamp });
            setIsPlaying(false);
        }
    }

    const fetchLibrary = async () => {
        try {
            const response = await fetch("http://localhost:5135/library");
            if (response.ok) {
                const data = await response.json();
                console.log("Library data received:", data);
                setQueueList(data);
            } else {
                console.error("Error fetching library:", response.statusText);
            }
        }
        catch (error) {
            console.error("Error fetching library:", error);
        }
    }
    useEffect(() => {
        fetchLibrary();
    }, []);

    return (
        <Box>
            <Box display="flex" alignItems="center" bgcolor="background.default" p={2}>
                <Typography variant="h6">FCI Radio Bot</Typography>
                <Typography variant="body2" ml={1}>
                    1.0
                </Typography>
                <Button onClick={fetchLibrary} variant="contained" color="primary" sx={{marginLeft:'620px'}}>
                    Refresh Library
                </Button>
            </Box>

            <Box display="flex">
                <Box flex={2} p={2}>
                    <Box display="flex" mb={2}>
                        <TextField
                            id="songurl"
                            variant="outlined"
                            placeholder="Paste a SPOTIFY link to your favorite song, playlist, album then click enter/return"
                            fullWidth
                            value={songUrl}
                            onChange={handleInputChange}
                            onKeyPress={handleKeyPress}
                            disabled={loading}
                        />
                        <IconButton aria-label="search" sx={{ ml: 2 }}>
                            <SearchIcon />
                        </IconButton>
                    </Box>

                    <TableContainer>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Queue Number</TableCell>
                                    <TableCell>Song Name</TableCell>
                                    <TableCell>Actions</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                            {queueList.map((song, index) => (
                <TableRow key={index}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>
                        <Box display="flex" alignItems="center">
                            <img src={song.cover_url} alt={song.song_name} style={{ width: 48, height: 48, marginRight: 16 }} />
                            <Box>
                                <Typography>{song.song_name}</Typography>
                                <Typography variant="body2" color="textSecondary">
                                    {song.artist}
                                </Typography>
                            </Box>
                        </Box>
                    </TableCell>
                    <TableCell>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={() => playSong(song.album_id, song.song_name, song.artist, song.cover_url)}
                        >
                            Play
                        </Button>
                    </TableCell>
                </TableRow>
            ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Box>

                <Box flex={1} p={2}>
                    <Box display="flex" alignItems="center">
                        <img
                            style={{ width: 96, height: 96, marginRight: 16 }}
                            src={albumArt}
                        />
                        <Box>
                            <Typography id="song-title" variant="h6">{songName}</Typography>
                            <Typography id="song-artist" variant="body2" color="textSecondary">{songArtist}</Typography>
                        </Box>
                    </Box>

                    <Box display="flex" alignItems="center" mt={2}>
                        <Typography id="song-current-time">00:00:00</Typography>
                        <Slider id="song-percentage-played" sx={{ mx: 2 }} />
                        <Typography id="song-total-time">00:00:00</Typography>
                    </Box>
                    <Box display="flex" alignItems="center" mt={2}>
                        <Typography mr={3}>Volume</Typography>
                        <VolumeDown />
                        <Slider
                            value={volume}
                            onChange={handleVolumeChange}
                            sx={{ width: 100, ml: 2, mr: 2 }}
                        />
                        <VolumeUp />
                        <Typography id="song-volume" ml={2}>{volume}</Typography>
                    </Box>

                    <Box display="flex" justifyContent="space-between" mt={4}>
                        <IconButton onClick={() => {/* previous song logic */ }}>
                            <SkipPrevious />
                        </IconButton>
                        <IconButton onClick={handlePlayPause}>
                            {isPlaying ? <Pause /> : <PlayArrow />}
                        </IconButton>
                        <IconButton onClick={() => {/* next song logic */ }}>
                            <SkipNext />
                        </IconButton>
                    </Box>
                </Box>
            </Box>
        </Box>
    );
};

export default JukeboxApp;
