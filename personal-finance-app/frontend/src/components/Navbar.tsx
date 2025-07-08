import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import ThemeToggle from './ThemeToggle';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemText,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { Menu as MenuIcon, Dashboard, Receipt, Login, PersonAdd, Logout } from '@mui/icons-material';
import './Navbar.css';

const Navbar: React.FC = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [drawerOpen, setDrawerOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
    setDrawerOpen(false);
  };

  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen);
  };

  const menuItems = isAuthenticated ? [
    { text: '대시보드', path: '/dashboard', icon: <Dashboard /> },
    { text: '거래 내역', path: '/transactions', icon: <Receipt /> },
  ] : [
    { text: '로그인', path: '/login', icon: <Login /> },
    { text: '회원가입', path: '/register', icon: <PersonAdd /> },
  ];

  const drawer = (
    <Box
      sx={{ width: 250 }}
      role="presentation"
      onClick={() => setDrawerOpen(false)}
      onKeyDown={() => setDrawerOpen(false)}
    >
      <List>
        {menuItems.map((item) => (
          <ListItem 
            key={item.text} 
            component={Link} 
            to={item.path}
            sx={{ 
              color: 'inherit', 
              textDecoration: 'none',
              '&:hover': { backgroundColor: 'action.hover' }
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
              <Box sx={{ mr: 2 }}>{item.icon}</Box>
              <ListItemText primary={item.text} />
            </Box>
          </ListItem>
        ))}
        
        {isAuthenticated && (
          <ListItem 
            onClick={handleLogout}
            sx={{ 
              cursor: 'pointer',
              '&:hover': { backgroundColor: 'action.hover' }
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
              <Box sx={{ mr: 2 }}><Logout /></Box>
              <ListItemText primary="로그아웃" />
            </Box>
          </ListItem>
        )}
      </List>
    </Box>
  );

  return (
    <AppBar position="static" sx={{ mb: 2 }}>
      <Toolbar>
        <Typography 
          variant="h6" 
          component={Link} 
          to="/" 
          sx={{ 
            flexGrow: 1, 
            textDecoration: 'none', 
            color: 'inherit',
            fontWeight: 'bold'
          }}
        >
          개인 가계부
        </Typography>
        
        {isMobile ? (
          <>
            <ThemeToggle />
            <IconButton
              color="inherit"
              aria-label="open drawer"
              onClick={handleDrawerToggle}
              sx={{ ml: 1 }}
            >
              <MenuIcon />
            </IconButton>
          </>
        ) : (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            {isAuthenticated ? (
              <>
                <Button 
                  color="inherit" 
                  component={Link} 
                  to="/dashboard"
                  startIcon={<Dashboard />}
                >
                  대시보드
                </Button>
                <Button 
                  color="inherit" 
                  component={Link} 
                  to="/transactions"
                  startIcon={<Receipt />}
                >
                  거래 내역
                </Button>
                <Typography variant="body2" sx={{ mx: 1 }}>
                  {user?.username}님
                </Typography>
                <Button 
                  color="inherit" 
                  onClick={handleLogout}
                  startIcon={<Logout />}
                >
                  로그아웃
                </Button>
              </>
            ) : (
              <>
                <Button 
                  color="inherit" 
                  component={Link} 
                  to="/login"
                  startIcon={<Login />}
                >
                  로그인
                </Button>
                <Button 
                  color="inherit" 
                  component={Link} 
                  to="/register"
                  startIcon={<PersonAdd />}
                >
                  회원가입
                </Button>
              </>
            )}
            <ThemeToggle />
          </Box>
        )}
      </Toolbar>
      
      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
      >
        {drawer}
      </Drawer>
    </AppBar>
  );
};

export default Navbar;