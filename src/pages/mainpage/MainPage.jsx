import React, { useState, useRef, useEffect } from "react";
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

    const [hasPlayed, setHasPlayed] = useState(false);
    const [volume, setVolume] = useState(40);
    const [isPlaying, setIsPlaying] = useState(false);
    const [audioSource, setAudioSource] = useState("");
    const [timestamp, setTimestamp] = useState(0);
    const [albumArt, setAlbumArt] = useState("https://baolamdong.vn/file/e7837c02845ffd04018473e6df282e92/dataimages/202004/original/images2282618_song_bien.jpg");
    const [songName, setSongName] = useState("song name");
    const [songArtist, setSongArtist] = useState("song artist");

    const audio = document.getElementById("audio_player");


    const handleVolumeChange = (event, newValue) => {
        setVolume(newValue);
    };

    socket.on("connect", function () {
        console.log("Connected to server");
        socket.emit("request_sync");
    });

    socket.on("play", function (data) {
        console.log("Play event received from server", data);
        if (!isPlaying) {
            audio?.play();
            setIsPlaying(true);
        }
    });

    socket.on("pause", function (data) {
        console.log("Pause event received from server", data);
        if (data.timestamp !== undefined && audio !== undefined) {
            if (audio !== null) {
                audio.currentTime = data.timestamp;
            }
            setTimestamp(data.timestamp);
            if (isPlaying) {
                audio?.pause();
                setIsPlaying(false);
            }
        } else {
            console.error("Pause event received without timestamp");
        }
    });

    socket.on("sync", function (data) {
        console.log("Sync event received from server", data);
        if (data.timestamp !== undefined) {
            setTimestamp(data.timestamp);

            if (data.song) {
                playSong(data.song.filename, data.song.title, data.song.artist, data.song.cover_art);
            }

            if (data.action === 'seek') {
                audio.currentTime = data.timestamp;
            }
            else if (data.is_playing && !isPlaying) {
                if (audio !== null) {
                    audio.currentTime = data.timestamp;
                }
                audio?.play();
                setIsPlaying(true);
            }
            else if (!data.is_playing && isPlaying) {
                if (audio !== null) {
                    audio.currentTime = data.timestamp;
                }
                audio?.pause();
                setIsPlaying(false);
            }

            // slider.value = (audio?.currentTime / audio?.duration) * 100;
        } else {
            console.error("Sync event received without timestamp");
        }
    });

    function requestInitialSync() {
        console.log("Requesting initial sync from server");
        socket.emit("request_sync");
    }

    // setInterval(function () {
    //     console.log("Requesting sync from server");
    //     socket.emit("request_sync");
    // }, 1500);

    // setInterval(function () {
    //     if (isPlaying) {
    //         socket.emit('timestamp', { timestamp: audio?.currentTime });
    //     }
    // }, 1000); // Sync every second

    function playSong(filePath, title, artist, cover_art) {
        console.log("Playing song:", filePath, title, artist, cover_art);
        if (filePath) {
            let encodedPath = btoa(unescape(encodeURIComponent(filePath)));
            let audioPath = "http://127.0.0.1:5135/music/" + encodedPath;
            setAudioSource(audioPath);
            if (audio) {
                audio.src = audioPath;
            }
            audio?.load();
            setSongName(title);
            setSongArtist(artist);
            setAlbumArt(cover_art);
        }
        if (audio !== null) {
            audio.currentTime = timestamp;
        }
    }

    function playpause() {
        if (!hasPlayed) {
            requestInitialSync();
            setHasPlayed(true);
            playsong(true);
        } else {
            if (isPlaying) {
                pausesong();
                setIsPlaying(false);
            } else {
                playsong();
                setIsPlaying(true);
            }
        }
    }

    function playsong(skipTimestamp) {
        console.log("Playing song");
        if (!skipTimestamp) {
            socket.emit("play", { timestamp: timestamp });
        }
        audio?.play();
        setIsPlaying(true);
    }

    function pausesong() {
        console.log("Pausing song");
        if (isPlaying) {
            setIsPlaying(false);
            socket.emit("pause", { timestamp: timestamp });
            audio?.pause();
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

                <audio
                    id="audio_player"
                    volume={volume}
                    src={audioSource}
                // onLoadedData={handleLoadedData}
                // onTimeUpdate={() => setCurrentTime(audioRef.current.currentTime)}
                // onEnded={() => setPlay(false)}
                >
                </audio>

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
                        <IconButton onClick={() => { }}>
                            <SkipPrevious />
                        </IconButton>
                        <IconButton onClick={playpause}>
                            {isPlaying ? <Pause /> : <PlayArrow />}
                        </IconButton>
                        <IconButton onClick={() => { }}>
                            <SkipNext />
                        </IconButton>
                    </Box>
                </Box>
            </Box>
        </Box>
    );
};

export default JukeboxApp;
