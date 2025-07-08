import React from 'react';
import { Box, Fab, useMediaQuery, useTheme } from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

interface MobileOptimizedProps {
  children: React.ReactNode;
}

const MobileOptimized: React.FC<MobileOptimizedProps> = ({ children }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();

  const handleAddTransaction = () => {
    navigate('/transactions?add=true');
  };

  return (
    <Box>
      {children}
      
      {/* 모바일에서만 보이는 플로팅 액션 버튼 */}
      {isMobile && (
        <Fab
          color="primary"
          aria-label="add transaction"
          onClick={handleAddTransaction}
          sx={{
            position: 'fixed',
            bottom: 20,
            right: 20,
            zIndex: 1000,
          }}
        >
          <AddIcon />
        </Fab>
      )}
    </Box>
  );
};

export default MobileOptimized;