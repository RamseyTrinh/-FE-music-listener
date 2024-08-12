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
            <IconButton onClick={() => {/* previous song logic */}}>
              <SkipPrevious />
            </IconButton>
            <IconButton onClick={playPause}>
              {isPlaying ? <Pause /> : <PlayArrow />}
            </IconButton>
            <IconButton onClick={() => {/* next song logic */}}>
              <SkipNext />
            </IconButton>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default JukeboxApp;
