import * as React from "react";
import { styled, useTheme, Theme, CSSObject } from "@mui/material/styles";
import MuiDrawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import InboxIcon from "@mui/icons-material/MoveToInbox";
import MailIcon from "@mui/icons-material/Mail";
import { blue } from "@mui/material/colors";
import { ListItem, Stack } from "@mui/material";
import Link from "next/link";
import Image from "next/image";
import { Layers, BarChart, Person, ViewList } from "@mui/icons-material";
import router, { useRouter } from "next/router";
import { KEY_ROUTE } from "@/constants/routes";
import { TEXT_MENU } from "@/constants/text/text-menu";

const drawerWidth = 240;

const openedMixin = (theme: Theme): CSSObject => ({
  width: drawerWidth,
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: "hidden",
});

const closedMixin = (theme: Theme): CSSObject => ({
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: "hidden",
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up("sm")]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}));

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: "nowrap",
  boxSizing: "border-box",
  ...(open && {
    ...openedMixin(theme),
    "& .MuiDrawer-paper": openedMixin(theme),
  }),
  ...(!open && {
    ...closedMixin(theme),
    "& .MuiDrawer-paper": closedMixin(theme),
  }),
}));

type MenuProp = {
  open: boolean;
  onDrawerClose: () => void;
};

export default function Menu({ open, onDrawerClose }: MenuProp) {
  const theme = useTheme();

  return (
    <Drawer variant="permanent" open={open}>
      <DrawerHeader>
        <Stack
          direction="row"
          alignItems="center"
          sx={{ backgroundColor: blue }}>
          <Image
            src="/static/img/cm_logo.png"
            width={200}
            height={40}
            objectFit="contain"
            alt="logo"
          />
          <IconButton onClick={onDrawerClose}>
            {theme.direction === "ltr" ? (
              <ChevronLeftIcon />
            ) : (
              <ChevronRightIcon />
            )}
          </IconButton>
        </Stack>
      </DrawerHeader>
      <Divider />

      <Divider />
      <List>
        {/* Stock */}
        <Link href={KEY_ROUTE.STOCK} passHref>
          <ListItem
            button
            className={
              router.pathname === KEY_ROUTE.STOCK ? "Mui-selected" : ""
            }>
            <ListItemIcon>
              <ViewList />
            </ListItemIcon>
            <ListItemText primary={TEXT_MENU.STOCK} />
          </ListItem>
        </Link>

        {/* Report */}
        <Link href={KEY_ROUTE.REPORT} passHref>
          <ListItem
            button
            className={
              router.pathname === KEY_ROUTE.REPORT ? "Mui-selected" : ""
            }>
            <ListItemIcon>
              <BarChart />
            </ListItemIcon>
            <ListItemText primary={TEXT_MENU.REPORT} />
          </ListItem>
        </Link>

        {/* Aboutus */}
        <Link href={KEY_ROUTE.ABOUTUS} passHref>
          <ListItem
            button
            className={
              router.pathname === KEY_ROUTE.ABOUTUS ? "Mui-selected" : ""
            }>
            <ListItemIcon>
              <Person />
            </ListItemIcon>
            <ListItemText primary={TEXT_MENU.ABOUTUS} />
          </ListItem>
        </Link>
      </List>

      <Divider />
      {/* <List>
        {["All mail", "Trash", "Spam"].map((text, index) => (
          <ListItem button key={text}>
            <ListItemIcon>
              {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
            </ListItemIcon>
            <ListItemText primary={text} />
          </ListItem>
        ))}
      </List> */}
    </Drawer>
  );
}
