import { Typography } from '@mui/material';
import React from 'react';

function PageTitle({ children }) {
  return (
    <div>
      <Typography variant="h5" sx={{ fontWeight: 'bold', marginBottom: '1rem', marginTop: '2rem' }}>
        {children}
      </Typography>
    </div>
  );
}

export default PageTitle;
