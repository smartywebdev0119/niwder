import React, { useEffect, useState } from "react";
import { makeStyles } from "@mui/styles";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import ButtonGroup from "@mui/material/ButtonGroup";
import { NavLink, useSearchParams } from "react-router-dom";
import useEnableFCM from "../../helpers/useEnableFCM";
import {
  authorizeGoogle,
  clearAuthorizingMessages,
  revokeGoogle,
} from "../../store/actions";
import { useDispatch, useSelector } from "react-redux";
import { useFirebase } from "react-redux-firebase";
import ConfirmationDialog from "../../helpers/ConfirmationDialog";
import Message from "../../helpers/Notification";

const Transfers = () => {
  const dispatch = useDispatch();
  const firebase = useFirebase();
  const [open, setOpen] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const [error, setError] = useState(null);
  const [errorOpen, setErrorOpen] = useState(false);

  const classes = makeStyles((theme) => ({
    root: {
      minWidth: 350,
    },
    title: {
      fontSize: 14,
    },
    large: {
      paddingBottom: "6px",
      marginBottom: "2px",
      filter: "drop-shadow(0px 0px 15px #222)",
    },
    typography: {
      flexGrow: 1,
      textAlign: "center",
      color: theme.palette.text.primary,
    },
    button: {
      marginTop: theme.spacing(2),
      fontSize: "18px",
      width: "150px",
      "&:hover": {
        border: `1px solid ${theme.palette.action.success}`,
        color: theme.palette.action.success,
      },
    },
    linkText: {
      textDecoration: `none`,
      color: theme.palette.text.disabled,
    },
    linkTextActive: {
      textDecoration: `none`,
      color: theme.palette.text.primary,
    },
  }))();

  useEnableFCM();

  const loading = useSelector(
    ({
      userData: {
        authorizing: { loading },
      },
    }) => loading
  );

  const googleAuthorized = useSelector(
    ({
      firebase: {
        profile: { google },
      },
    }) => google
  );

  useEffect(() => () => clearAuthorizingMessages()(dispatch), [dispatch]);

  const handleClose = () => {
    setOpen(false);
  };

  const handleRemoveAuth = () => {
    setOpen(true);
  };

  useEffect(() => {
    const error = searchParams.get("error");
    if (error) {
      setError(error);
      setErrorOpen(true);
    }
  }, [searchParams]);

  const onErrorNotificationClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setErrorOpen(false);
    setSearchParams();
  };

  return (
    <div className="container">
      {error && (
        <Message
          severity={"error"}
          onClose={onErrorNotificationClose}
          message={"Google Drive API authentication failed"}
          open={errorOpen}
          autoHideDuration={2000}
        />
      )}
      <Grid
        container
        spacing={0}
        direction="column"
        alignItems="center"
        justifyContent="center"
        sx={{ minHeight: "40vh" }}
      >
        <Grid item sx={{ textAlign: "center", minWidth: "50vw", mb: "20px" }}>
          <Card className={classes.root}>
            <CardContent>
              <Typography
                variant="h5"
                className={classes.typography}
                sx={{ marginBottom: "10px" }}
              >
                Authorize Google Drive
              </Typography>
              <ConfirmationDialog
                id="google-remove-auth"
                keepMounted
                open={open}
                onClose={handleClose}
                primaryMessage={"Revoking Google Drive API Access"}
                secondaryMessage={
                  "You are going to revoke the authorization for Google Drive API. This will suspend all queued transfers for Google Drive."
                }
                action={() => revokeGoogle()(firebase, dispatch)}
              />
              <ButtonGroup
                orientation="vertical"
                aria-label="vertical contained button group"
                variant="contained"
              >
                {googleAuthorized ? (
                  <Button
                    variant="contained"
                    size="large"
                    onClick={handleRemoveAuth}
                  >
                    {loading
                      ? "Revoking Authorization"
                      : "Revoke Authorization"}
                  </Button>
                ) : (
                  <Button
                    variant="contained"
                    size="large"
                    onClick={() => authorizeGoogle()(firebase, dispatch)}
                  >
                    {loading ? "Authorizing" : "Authorize"}
                  </Button>
                )}
              </ButtonGroup>
            </CardContent>
          </Card>
        </Grid>

        <Grid item sx={{ textAlign: "center", minWidth: "50vw" }}>
          <Card className={classes.root}>
            <CardContent>
              <Typography
                variant="h5"
                className={classes.typography}
                sx={{ marginBottom: "10px" }}
              >
                Niwder.io supports the following transfers
              </Typography>
              <ButtonGroup
                orientation="vertical"
                aria-label="vertical contained button group"
                variant="contained"
              >
                <Button
                  variant="contained"
                  size="large"
                  disabled={!googleAuthorized}
                >
                  <NavLink
                    to={"/transfers/mega-to-gdrive"}
                    className={({ isActive }) =>
                      isActive ? classes.linkTextActive : classes.linkText
                    }
                  >
                    Transfer from Mega.nz to Google Drive
                  </NavLink>
                </Button>
                <Button
                  variant="contained"
                  size="large"
                  disabled={!googleAuthorized}
                >
                  <NavLink
                    to={"/transfers/gdrive-to-mega"}
                    className={({ isActive }) =>
                      isActive ? classes.linkTextActive : classes.linkText
                    }
                  >
                    Transfer from Google Drive to Mega.nz
                  </NavLink>
                </Button>
                <Button
                  variant="contained"
                  size="large"
                  disabled={!googleAuthorized}
                >
                  <NavLink
                    to={"/transfers/direct-to-gdrive"}
                    className={({ isActive }) =>
                      isActive ? classes.linkTextActive : classes.linkText
                    }
                  >
                    Transfer from Direct Link to Google Drive
                  </NavLink>
                </Button>
                <Button variant="contained" size="large">
                  <NavLink
                    to={"/transfers/direct-to-mega"}
                    className={({ isActive }) =>
                      isActive ? classes.linkTextActive : classes.linkText
                    }
                  >
                    Transfer from Direct Link to Mega.nz
                  </NavLink>
                </Button>
              </ButtonGroup>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </div>
  );
};

export default Transfers;
