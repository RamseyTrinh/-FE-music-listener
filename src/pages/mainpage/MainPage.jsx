import React, { useState } from "react";
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

    const handleVolumeChange = (event, newValue) => {
        setVolume(newValue);
    };

    const playPause = () => {
        setIsPlaying(!isPlaying);
    };

    socket.on("connect", function () {
        console.log("Connected to server");
        socket.emit("request_sync");
    });

    socket.on("play", function (data) {
        console.log("Play event received from server", data);
        if (!isPlaying) {
            audio.play();
            isPlaying = true;
        }
    });

    socket.on("sync", function (data) {
        console.log("Sync event received from server", data);
        if (data.timestamp !== undefined) {
            current_timestamp = data.timestamp; // Store current timestamp

            if (data.song) {
                playSong(data.song.filename, data.song.title, data.song.artist, data.song.cover_art);
            }

            if (data.action === 'seek') {
                audio.currentTime = data.timestamp;
            }
            else if (data.is_playing && !isPlaying) {
                audio.currentTime = data.timestamp;
                audio.play();
                isPlaying = true;
            }
            else if (!data.is_playing && isPlaying) {
                audio.currentTime = data.timestamp;
                audio.pause();
                isPlaying = false;
            }

            slider.value = (audio.currentTime / audio.duration) * 100;
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
            audio.src = `/music/${encodedPath}`;
            $("#song-title").text(title);
            $("#song-artist").text(artist);
            $("#cover-art").attr("src", cover_art);
        }
        audio.currentTime = current_timestamp;
    }

    function playpause() {
        if (!isPlaying) {
            requestInitialSync();
            playsong(true);
        } else {
            if (isPlaying) {
                pausesong();
                isPlaying = false;
            } else {
                playsong();
                isPlaying = true;
            }
        }
    }

    function playsong(skipTimestamp) {
        console.log("Playing song");
        if (!skipTimestamp) {
            socket.emit("play", { timestamp: audio.currentTime });
        }
        audio.play();
        isPlaying = true;
    }

    function pausesong() {
        console.log("Pausing song");
        if (isPlaying) {
            isPlaying = false;
            socket.emit("pause", { timestamp: audio.currentTime });
            audio.pause();
        }
    }

    return (
        <Box>
            <Box display="flex" alignItems="center" bgcolor="background.default" p={2}>
                <Typography variant="h6">FCI Radio Bot</Typography>
                <Typography variant="body2" ml={1}>
                    1.0
                </Typography>
            </Box>

            <Box display="flex">
                <Box flex={2} p={2}>
                    <Box display="flex" mb={2}>
                        <TextField
                            id="songurl"
                            variant="outlined"
                            placeholder="Paste a SPOTIFY link to your favorite song, playlist, album then click enter/return"
                            fullWidth
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
                                {/* Dynamically populate rows here */}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Box>

                <Box flex={1} p={2}>
                    <Box display="flex" alignItems="center">
                        <img
                            style={{ width: 96, height: 96, marginRight: 16 }}
                            src="https://baolamdong.vn/file/e7837c02845ffd04018473e6df282e92/dataimages/202004/original/images2282618_song_bien.jpg"
                        />
                        <Box>
                            <Typography id="song-title" variant="h6">Song name</Typography>
                            <Typography id="song-artist" variant="body2" color="textSecondary">Song artist</Typography>
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
                        <IconButton onClick={playPause}>
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
